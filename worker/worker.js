const Bull = require("bull");
require("dotenv").config();
const { contacts, deals, tasks } = require("../src/services");
const loader = require("../src/services/loader/loader");

process.on("uncaughtException", (error) => console.log(error));

const queue = new Bull("queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 5, duration: 1000 },
});

const testQueue = new Bull("testQueue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

testQueue.process(async function (job, done) {
  await loader();
  done();
});

const addToQueue = (name, data, ...props) =>
  queue.add(name, data, {
    attempts: 60,
    backoff: 500,
    ...props,
  });

queue.process("listContacts", async (job, done) => {
  const userId = await contacts.listAllContacts(job.data.email, job.data.dev);
  if (!userId) done(new Error("creds empty"));
  done(null, addToQueue("listDeals", { userId, dev: job.data.dev }));
});

queue.process("listDeals", async (job, done) => {
  const foundDeals = await deals.listAllDeals(job.data.userId, job.data.dev);
  done(null, addToQueue("listTasks", { foundDeals, dev: job.data.dev }));
});

queue.process("listTasks", async (job, done) => {
  const taskIds = await tasks.listAllTasks(job.data.foundDeals, job.data.dev);
  done(
    null,
    addToQueue("closeTasks", { taskIds, dev: job.data.dev }, { priority: 3 })
  );
});

queue.process("closeTasks", async (job, done) => {
  await tasks.closeTasks(job.data.taskIds, job.data.dev);
  done();
});
