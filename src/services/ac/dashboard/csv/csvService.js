const Bull = require("bull");

const csvService = () => {
  const csvQueue = new Bull("csvQueue", {
    redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  });
  csvQueue.on("error", (e) => console.log("csvQueue❌ ", e));

  csvQueue.add(null, {
    repeat: {
      every: 3600000,
      limit: 5,
    },
  });
};

module.exports = csvService;
