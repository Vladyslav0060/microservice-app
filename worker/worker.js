const Bull = require("bull");
require("dotenv").config();
require("events").setMaxListeners(100);
const { contacts, deals, tasks } = require("../src/services/verification");
const actions = require("./actions");

process.on("uncaughtException", (error) => console.log("worker ❌", error));

const queue = new Bull("queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 5, duration: 1000 },
});

const dbQueue = new Bull("dbQueue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

dbQueue.process("start_db_queue", async function (job, done) {
  done(null, addToDbQueue("update_ic_ac_contacts_fields"));
});

dbQueue.process("update_ic_ac_contacts_fields", async (job, done) => {
  console.log("WORKER: STARTED update_ic_ac_contacts_fields");
  await actions.update_ic_ac_contacts_fields();
  console.log("WORKER: Finished update_ic_ac_contacts_fields");
  done(null, addToDbQueue("update_dire_ac_contacts_fields"));
});

dbQueue.process("update_dire_ac_contacts_fields", async (job, done) => {
  console.log("WORKER: STARTED update_dire_ac_contacts_fields");
  await actions.update_dire_ac_contacts_fields();
  console.log("WORKER: Finished update_dire_ac_contacts_fields");
  done(null, addToDbQueue("update_ic_ac_deals_fields"));
});

dbQueue.process("update_ic_ac_deals_fields", async (job, done) => {
  console.log("WORKER: STARTED update_ic_ac_deals_fields");
  await actions.update_ic_ac_deals_fields();
  console.log("WORKER: Finished update_ic_ac_deals_fields");
  done(null, addToDbQueue("update_dire_ac_deals_fields"));
});

dbQueue.process("update_dire_ac_deals_fields", async (job, done) => {
  console.log("WORKER: STARTED update_dire_ac_deals_fields");
  await actions.update_dire_ac_deals_fields();
  console.log("WORKER: Finished update_dire_ac_contacts_fields");
  done(null, addToDbQueue("update_ic_ac_task_types"));
});

dbQueue.process("update_ic_ac_task_types", async (job, done) => {
  console.log("WORKER: STARTED update_ic_ac_task_types");
  await actions.update_ic_ac_task_types();
  console.log("WORKER: Finished update_ic_ac_task_types");
  done(null, addToDbQueue("update_dire_ac_task_types"));
});

dbQueue.process("update_dire_ac_task_types", async (job, done) => {
  console.log("WORKER: STARTED update_dire_ac_task_types");
  await actions.update_dire_ac_task_types();
  console.log("WORKER: Finished update_dire_ac_task_types");
  done(null, addToDbQueue("update_ic_ac_stages"));
});

dbQueue.process("update_ic_ac_stages", async (job, done) => {
  console.log("WORKER: STARTED update_ic_ac_stages");
  await actions.update_ic_ac_stages();
  console.log("WORKER: Finished update_ic_ac_stages");
  done(null, addToDbQueue("update_dire_ac_stages"));
});

dbQueue.process("update_dire_ac_stages", async (job, done) => {
  console.log("WORKER: STARTED update_dire_ac_stages");
  await actions.update_dire_ac_stages();
  console.log("WORKER: Finished update_dire_ac_stages");
  done(null, addToDbQueue("update_ic_ac_pipelines"));
});

dbQueue.process("update_ic_ac_pipelines", async (job, done) => {
  console.log("WORKER: STARTED update_ic_ac_pipelines");
  await actions.update_ic_ac_pipelines();
  console.log("WORKER: Finished update_ic_ac_pipelines");
  done(null, addToDbQueue("update_dire_ac_pipelines"));
});

dbQueue.process("update_dire_ac_pipelines", async (job, done) => {
  console.log("WORKER: STARTED update_dire_ac_pipelines");
  await actions.update_dire_ac_pipelines();
  console.log("WORKER: Finished update_dire_ac_pipelines");
  done(null, addToDbQueue("update_ic_ac_users"));
});

dbQueue.process("update_ic_ac_users", async (job, done) => {
  console.log("WORKER: STARTED update_ic_ac_users");
  await actions.update_ic_ac_users();
  console.log("WORKER: Finished update_ic_ac_users");
  done(null, addToDbQueue("update_dire_ac_users"));
});

dbQueue.process("update_dire_ac_users", async (job, done) => {
  console.log("WORKER: STARTED update_dire_ac_users");
  await actions.update_dire_ac_users();
  console.log("WORKER: Finished update_dire_ac_users");
  done(null, addToDbQueue("update_ic_ac_tasks"));
});

dbQueue.process("update_ic_ac_tasks", async (job, done) => {
  console.log("WORKER: STARTED update_ic_ac_tasks");
  await actions.update_ic_ac_tasks();
  console.log("WORKER: Finished update_ic_ac_tasks");
  done(null, addToDbQueue("update_dire_ac_tasks"));
});

dbQueue.process("update_dire_ac_tasks", async (job, done) => {
  console.log("WORKER: STARTED update_dire_ac_tasks");
  await actions.update_dire_ac_tasks();
  console.log("WORKER: Finished update_dire_ac_tasks");
  done(null, addToDbQueue("update_ic_uc_joined_report"));
});

dbQueue.process("update_ic_uc_joined_report", async (job, done) => {
  console.log("WORKER: STARTED update_ic_uc_joined_report");
  await actions.update_ic_uc_joined_report();
  console.log("WORKER: Finished update_ic_uc_joined_report");
  done(null, addToDbQueue("update_ic_ac_contacts"));
});

dbQueue.process("update_ic_ac_contacts", async (job, done) => {
  console.log("WORKER: STARTED update_ic_ac_contacts");
  await actions.update_ic_ac_contacts();
  console.log("WORKER: FINISHED update_ic_ac_contacts");
  done(null, addToDbQueue("update_dire_ac_contacts"));
});

dbQueue.process("update_dire_ac_contacts", async (job, done) => {
  console.log("WORKER: STARTED update_dire_ac_contacts");
  await actions.update_dire_ac_contacts();
  console.log("WORKER: FINISHED update_dire_ac_contacts");
  done(null, addToDbQueue("update_ic_ac_deals"));
});

dbQueue.process("update_ic_ac_deals", async (job, done) => {
  console.log("WORKER: STARTED update_ic_ac_deals");
  await actions.update_ic_ac_deals();
  console.log("WORKER: FINISHED update_ic_ac_deals");
  done(null, addToDbQueue("update_dire_ac_deals"));
});

dbQueue.process("update_dire_ac_deals", async (job, done) => {
  console.log("WORKER: STARTED update_dire_ac_deals");
  await actions.update_dire_ac_deals();
  console.log("WORKER: FINISHED update_dire_ac_deals");
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
