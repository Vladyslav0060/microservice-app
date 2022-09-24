const Bull = require("bull");

const workerQueue = new Bull("workerQueue", process.env.REDIS_URL, {});

workerQueue.on("error", () => {
  console.log("error");
});

// const addNewWorkerTask = (name, data) => {
//   apiQueue.add(name, data, { attempts: 60, delay: 500 });
// };

// workerQueue.process(addNewWorkerTask);

module.exports = workerQueue;
