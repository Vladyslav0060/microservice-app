const Bull = require("bull");
const { contacts, deals, tasks } = require("../src/services");
require("dotenv").config();

process.on("uncaughtException", (error) => console.log(error));

const queue = new Bull("queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 1, duration: 1000 },
});

const addToQueue = (name, data, ...props) =>
  queue.add(name, data, { attempts: 60, backoff: 500, ...props });

queue.process("listContacts", async (job, done) => {
  const userCreds = await contacts.listAllContacts(job.data.email);
  if (!userCreds) done(new Error("creds empty"));
  done(null, addToQueue("listDeals", { userCreds }));
});

queue.process("listDeals", async (job, done) => {
  const foundDeals = await deals.listAllDeals(job.data.userCreds);
  done(null, addToQueue("listTasks", { foundDeals }));
});

queue.process("listTasks", async (job, done) => {
  const taskIds = await tasks.listAllTasks(job.data.foundDeals);
  done(null, addToQueue("closeTasks", { taskIds }, { priority: 3 }));
});

queue.process("closeTasks", async (job, done) => {
  await tasks.closeTasks(job.data.taskIds);
  done();
});
