const {
  ExpressAdapter,
  createBullBoard,
  BullMQAdapter,
} = require("@bull-board/express");
const { Queue } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

const verification_queue = new Queue("verification_queue", {
  connection: connection,
});

const db_queue = new Queue("db_queue", {
  connection: connection,
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(db_queue), new BullMQAdapter(verification_queue)],
  serverAdapter,
});

module.exports = serverAdapter.getRouter();
