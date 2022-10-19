const Bull = require("bull");
const { createBullBoard } = require("bull-board");
const { BullAdapter } = require("bull-board/bullAdapter");

const queue = new Bull("queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 5, duration: 1000 },
});

const testQueue = new Bull("testQueue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

const { router } = createBullBoard([
  new BullAdapter(queue),
  new BullAdapter(testQueue),
]);

module.exports = router;
