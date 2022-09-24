const Bull = require("bull");
const { deals, contacts, tasks } = require("../services");
const workerQueue = require("../services/worker");

const apiQueue = new Bull("queue", process.env.REDIS_URL, {
  limiter: { max: 1, duration: 500 },
});

const addNewWorkerTask = (name, data) => {
  apiQueue.add(name, data, { attempts: 60, delay: 500 });
};

workerQueue.process(addNewWorkerTask);

apiQueue.on("error", () => console.log("err"));

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
  console.log(job.data);
  await tasks.closeTasks(job.data.taskIds);
  done();
});

module.exports = { apiQueue, addNewWorkerTask };
