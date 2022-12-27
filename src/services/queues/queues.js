const { Queue } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};
const defaultJobOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 1000 },
};
// process.on("uncaughtException", (error) => console.log("worker ❌", error));

const verification_queue = new Queue("verification_queue", {
  connection: connection,
  defaultJobOptions: defaultJobOptions,
});

const db_queue = new Queue("db_queue", {
  connection: connection,
  defaultJobOptions: defaultJobOptions,
});
const init_verification_queue = (email, dev) =>
  verification_queue.add("listContacts", { email, dev });

const init_db_queue = () =>
  db_queue.add("start_db_queue", {
    repeat: {
      every: 3600000,
      limit: 5,
    },
  });

module.exports = { init_verification_queue, init_db_queue };
