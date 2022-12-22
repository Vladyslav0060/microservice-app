const Bull = require("bull");
require("dotenv").config();
require("events").setMaxListeners(100);
const { contacts, deals, tasks } = require("../src/services/verification");
const actions = require("./actions");

process.on("uncaughtException", (error) => console.log("worker ❌", error));

const verification_queue = new Bull("verification_queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 5, duration: 1000 },
});

const db_queue = new Bull("db_queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

db_queue.process("start_db_queue", async function (job, done) {
  done(null, addToDbQueue("update_ic_ac_contacts_fields"));
});

db_queue.process("update_ic_ac_contacts_fields", async (job, done) => {
  await actions.update_ic_ac_contacts_fields();
  done(null, addToDbQueue("update_dire_ac_contacts_fields"));
});

db_queue.process("update_dire_ac_contacts_fields", async (job, done) => {
  await actions.update_dire_ac_contacts_fields();
  done(null, addToDbQueue("update_ic_ac_deals_fields"));
});

db_queue.process("update_ic_ac_deals_fields", async (job, done) => {
  await actions.update_ic_ac_deals_fields();
  done(null, addToDbQueue("update_dire_ac_deals_fields"));
});

db_queue.process("update_dire_ac_deals_fields", async (job, done) => {
  await actions.update_dire_ac_deals_fields();
  done(null, addToDbQueue("update_ic_ac_task_types"));
});

db_queue.process("update_ic_ac_task_types", async (job, done) => {
  await actions.update_ic_ac_task_types();
  done(null, addToDbQueue("update_dire_ac_task_types"));
});

db_queue.process("update_dire_ac_task_types", async (job, done) => {
  await actions.update_dire_ac_task_types();
  done(null, addToDbQueue("update_ic_ac_stages"));
});

db_queue.process("update_ic_ac_stages", async (job, done) => {
  await actions.update_ic_ac_stages();
  done(null, addToDbQueue("update_dire_ac_stages"));
});

db_queue.process("update_dire_ac_stages", async (job, done) => {
  await actions.update_dire_ac_stages();
  done(null, addToDbQueue("update_ic_ac_pipelines"));
});

db_queue.process("update_ic_ac_pipelines", async (job, done) => {
  await actions.update_ic_ac_pipelines();
  done(null, addToDbQueue("update_dire_ac_pipelines"));
});

db_queue.process("update_dire_ac_pipelines", async (job, done) => {
  await actions.update_dire_ac_pipelines();
  done(null, addToDbQueue("update_ic_ac_users"));
});

db_queue.process("update_ic_ac_users", async (job, done) => {
  await actions.update_ic_ac_users();
  done(null, addToDbQueue("update_dire_ac_users"));
});

db_queue.process("update_dire_ac_users", async (job, done) => {
  await actions.update_dire_ac_users();
  done(null, addToDbQueue("update_ic_ac_tasks"));
});

db_queue.process("update_ic_ac_tasks", async (job, done) => {
  await actions.update_ic_ac_tasks();
  done(null, addToDbQueue("update_dire_ac_tasks"));
});

db_queue.process("update_dire_ac_tasks", async (job, done) => {
  await actions.update_dire_ac_tasks();
  done(null, addToDbQueue("update_ic_uc_joined_report"));
});

db_queue.process("update_ic_uc_joined_report", async (job, done) => {
  await actions.update_ic_uc_joined_report();
  done(null, addToDbQueue("update_ic_ac_contacts"));
});

db_queue.process("update_ic_ac_contacts", async (job, done) => {
  await actions.update_ic_ac_contacts();
  done(null, addToDbQueue("update_dire_ac_contacts"));
});

db_queue.process("update_dire_ac_contacts", async (job, done) => {
  await actions.update_dire_ac_contacts();
  done(null, addToDbQueue("update_ic_ac_deals"));
});

db_queue.process("update_ic_ac_deals", async (job, done) => {
  await actions.update_ic_ac_deals();
  done(null, addToDbQueue("update_dire_ac_deals"));
});

db_queue.process("update_dire_ac_deals", async (job, done) => {
  await actions.update_dire_ac_deals();
  done();
});

const addToDbQueue = (name, data = {}, ...props) =>
  db_queue.add(name, data, {
    attempts: 60,
    backoff: 500,
    ...props,
  });

const addToQueue = (name, data, ...props) =>
  verification_queue.add(name, data, {
    attempts: 60,
    backoff: 500,
    ...props,
  });

verification_queue.process("listContacts", async (job, done) => {
  const userId = await contacts.listAllContacts(job.data.email, job.data.dev);
  if (!userId) done(new Error("creds empty"));
  done(null, addToQueue("listDeals", { userId, dev: job.data.dev }));
});

verification_queue.process("listDeals", async (job, done) => {
  const foundDeals = await deals.listAllDeals(job.data.userId, job.data.dev);
  done(null, addToQueue("listTasks", { foundDeals, dev: job.data.dev }));
});

verification_queue.process("listTasks", async (job, done) => {
  const taskIds = await tasks.listAllTasks(job.data.foundDeals, job.data.dev);
  done(
    null,
    addToQueue("closeTasks", { taskIds, dev: job.data.dev }, { priority: 3 })
  );
});

verification_queue.process("closeTasks", async (job, done) => {
  await tasks.closeTasks(job.data.taskIds, job.data.dev);
  done();
});
