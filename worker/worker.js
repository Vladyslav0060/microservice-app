require("dotenv").config();
require("events").setMaxListeners(100);
const { Queue, Worker } = require("bullmq");
const { contacts, deals, tasks } = require("../src/services/verification");
const actions = require("./actions");

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

const defaultJobOptions = {
  attempts: 5,
  backoff: { type: "exponential", delay: 1000 },
};

const verification_queue = new Queue("verification_queue", {
  connection: connection,
  defaultJobOptions: defaultJobOptions,
});

const db_queue = new Queue("db_queue", {
  connection: connection,
  defaultJobOptions: defaultJobOptions,
});

const db_worker = new Worker(
  "db_queue",
  async (job) => {
    if (job.name === "start_db_queue") {
      await db_queue.add("update_ic_ac_contacts_fields");
    }
    if (job.name === "update_ic_ac_contacts_fields") {
      await actions.update_dire_ac_contacts_fields(false);
      await db_queue.add("update_dire_ac_contacts_fields");
    }
    if (job.name === "update_dire_ac_contacts_fields") {
      await actions.update_dire_ac_contacts_fields(true);
      await db_queue.add("update_ic_ac_deals_fields");
    }
    if (job.name === "update_dire_ac_contacts_fields") {
      await actions.update_dire_ac_contacts_fields();
      await db_queue.add("update_ic_ac_deals_fields");
    }

    if (job.name === "update_ic_ac_deals_fields") {
      await actions.update_ic_ac_deals_fields();
      await db_queue.add("update_dire_ac_deals_fields");
    }
    if (job.name === "update_dire_ac_deals_fields") {
      await actions.update_dire_ac_deals_fields();
      await db_queue.add("update_ic_ac_task_types");
    }
    if (job.name === "update_ic_ac_task_types") {
      await actions.update_ic_ac_task_types();
      await db_queue.add("update_dire_ac_task_types");
    }

    if (job.name === "update_dire_ac_task_types") {
      await actions.update_dire_ac_task_types();
      await db_queue.add("update_ic_ac_stages");
    }

    if (job.name === "update_ic_ac_stages") {
      await actions.update_ic_ac_stages();
      await db_queue.add("update_dire_ac_stages");
    }

    if (job.name === "update_dire_ac_stages") {
      await actions.update_dire_ac_stages();
      await db_queue.add("update_ic_ac_pipelines");
    }

    if (job.name === "update_ic_ac_pipelines") {
      await actions.update_ic_ac_pipelines();
      await db_queue.add("update_dire_ac_pipelines");
    }

    if (job.name === "update_ic_ac_pipelines") {
      await actions.update_dire_ac_pipelines();
      await db_queue.add("update_ic_ac_users");
    }

    if (job.name === "update_ic_ac_users") {
      await actions.update_ic_ac_users();
      await db_queue.add("update_dire_ac_users");
    }

    if (job.name === "update_dire_ac_users") {
      await actions.update_dire_ac_users();
      await db_queue.add("update_ic_ac_tasks");
    }

    if (job.name === "update_ic_ac_tasks") {
      await actions.update_ic_ac_tasks();
      await db_queue.add("update_dire_ac_tasks");
    }

    if (job.name === "update_dire_ac_tasks") {
      await actions.update_dire_ac_tasks();
      await db_queue.add("update_ic_uc_joined_report");
    }

    if (job.name === "update_ic_uc_joined_report") {
      await actions.update_ic_uc_joined_report();
      await db_queue.add("update_ic_ac_contacts");
    }

    if (job.name === "update_ic_ac_contacts") {
      await actions.update_ic_ac_contacts();
      await db_queue.add("update_dire_ac_contacts");
    }

    if (job.name === "update_dire_ac_contacts") {
      await actions.update_dire_ac_contacts();
      await db_queue.add("update_ic_ac_deals");
    }

    if (job.name === "update_ic_ac_deals") {
      await actions.update_ic_ac_deals();
      await db_queue.add("update_dire_ac_deals");
    }

    if (job.name === "update_dire_ac_deals") {
      await actions.update_dire_ac_deals();
    }
  },
  {
    connection: connection,
  }
);

db_worker.on("error", (error) => console.log("❗️ db_worker error", error));
db_worker.on("failed", (failed) => console.log("❕ db_worker failed", failed));

const verification_worker = new Worker(
  "verification_queue",
  async (job) => {
    if (job.name === "listContacts") {
      const userId = await contacts.listAllContacts(
        job.data.email,
        job.data.dev
      );
      if (!userId) return new Error("creds are empty");
      await verification_queue.add("listDeals", { userId, dev: job.data.dev });
    }
    if (job.name === "listDeals") {
      const foundDeals = await deals.listAllDeals(
        job.data.userId,
        job.data.dev
      );
      await verification_queue.add("listTasks", {
        foundDeals,
        dev: job.data.dev,
      });
    }
    if (job.name === "listTasks") {
      const taskIds = await tasks.listAllTasks(
        job.data.foundDeals,
        job.data.dev
      );
      await verification_queue.add(
        "closeTasks",
        { taskIds, dev: job.data.dev },
        { priority: 3 }
      );
    }
    if (job.name === "closeTasks") {
      await tasks.closeTasks(job.data.taskIds, job.data.dev);
    }
  },
  { connection: connection }
);

verification_worker.on("error", (error) =>
  console.log("❗️ verification_worker error", error)
);
verification_worker.on("failed", (failed) =>
  console.log("❕ verification_worker failed", failed)
);
