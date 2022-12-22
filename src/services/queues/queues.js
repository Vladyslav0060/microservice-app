const Bull = require("bull");

const verification_queue = new Bull("verification_queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 5, duration: 1000 },
});

const db_queue = new Bull("db_queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
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
