const Bull = require("bull");
const { createBullBoard } = require("bull-board");
const { BullAdapter } = require("bull-board/bullAdapter");

const verification_queue = new Bull("verification_queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 5, duration: 1000 },
});

const db_queue = new Bull("db_queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

const { router } = createBullBoard([
  new BullAdapter(verification_queue),
  new BullAdapter(db_queue),
]);

module.exports = router;
