const Bull = require("bull");

const csvService = () => {
  const dbQueue = new Bull("dbQueue", {
    redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  });
  dbQueue.on("error", (e) => console.log("dbQueue❌ ", e));

  // dbQueue.add("start_db_queue", {
  //   repeat: {
  //     every: 900000,
  //     // every: 3600000,
  //     limit: 5,
  //   },
  // });
};

module.exports = csvService;
