const { createBullBoard } = require("bull-board");
const { BullAdapter } = require("bull-board/bullAdapter");
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

const { router } = createBullBoard([
  new BullAdapter(verification_queue),
  new BullAdapter(db_queue),
]);

module.exports = router;
