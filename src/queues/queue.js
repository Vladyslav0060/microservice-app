const Bull = require("bull");
const { deals, contacts, tasks } = require("../services");

const apiQueue = new Bull("queue", process.env.REDIS_URL, {
  limiter: { max: 1, duration: 500 },
});

const addNewWorkerTask = (processName, data) => {
  apiQueue.add("save", { processName, data });
};

apiQueue.process(addNewWorkerTask);

apiQueue.on("error", () => console.log("err"));

apiQueue.process("save", async (job, done) => {
  const { processName, data } = job.data;
  apiQueue.add(processName, data, { attempts: 60, delay: 500 });
  done();
});

apiQueue.process("listContacts", async (job, done) => {
  const userCreds = await contacts.listAllContacts(job.data.email);
  if (!userCreds) done(new Error("creds empty"));
  done(null, addNewWorkerTask("listDeals", { userCreds }));
});

apiQueue.process("listDeals", async (job, done) => {
  const foundDeals = await deals.listAllDeals(job.data.userCreds);
  done(null, addNewWorkerTask("listTasks", { foundDeals }));
});

apiQueue.process("listTasks", async (job, done) => {
  const taskIds = await tasks.listAllTasks(job.data.foundDeals);
  done(null, addNewWorkerTask("closeTasks", { taskIds }));
});

apiQueue.process("closeTasks", async (job, done) => {
  await tasks.closeTasks(job.data.taskIds);
  done();
});

module.exports = { apiQueue, addNewWorkerTask };
