const Bull = require("bull");
require("dotenv").config();
const { contacts, deals, tasks } = require("../src/services/verification");
const loader = require("../src/services/dashboard/csv/loader");
const { postgres, postgres_ac } = require("../src/services/dbClient");
const {
  sql_contacts,
  sql_deals,
  sql_tasks,
  sql_pipelines,
} = require("../src/services/dashboard/sql");
const sql_stages = require("../src/services/dashboard/sql/sql_stages");

process.on("uncaughtException", (error) => console.log("worker ❌", error));

const queue = new Bull("queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 5, duration: 1000 },
});

const dbQueue = new Bull("dbQueue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

dbQueue.process(async function (job, done) {
  console.log("it works");

  // await loader();
  // done(null, addToDbQueue("update_ic_ac_contacts"));
  done();
});

dbQueue.process("update_ic_ac_contacts", async (job, done) => {
  await postgres.truncate("ic_ac_contacts");
  console.log("inserting ic_ac_contacts");
  await postgres.insert("ic_ac_contacts", await sql_contacts());
  done(null, addToDbQueue("update_ic_ac_deals"));
});

dbQueue.process("update_ic_ac_deals", async (job, done) => {
  await postgres.truncate("ic_ac_deals");
  console.log("inserting ic_ac_deals");
  await postgres.insert("ic_ac_deals", await sql_deals());
  done(null, addToDbQueue("update_ic_ac_tasks"));
});

dbQueue.process("update_ic_ac_tasks", async (job, done) => {
  await postgres.truncate("ic_ac_tasks");
  console.log("inserting ic_ac_tasks");
  await postgres.insert("ic_ac_tasks", await sql_tasks());
  done(null, addToDbQueue("update_ic_ac_pipelines"));
});

dbQueue.process("update_ic_ac_pipelines", async (job, done) => {
  await postgres.truncate("ic_ac_pipelines");
  console.log("inserting ic_ac_pipelines");
  await postgres.insert("ic_ac_pipelines", await sql_pipelines());
  done(null, addToDbQueue("update_ic_ac_stages"));
});

dbQueue.process("update_ic_ac_stages", async (job, done) => {
  await postgres.truncate("ic_ac_stages");
  console.log("inserting ic_ac_stages");
  await postgres.insert("ic_ac_stages", await sql_stages());
  done();
});

const addToDbQueue = (name, data = {}, ...props) =>
  dbQueue.add(name, data, {
    attempts: 60,
    backoff: 500,
    ...props,
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
