const Bull = require("bull");
const emailProcess = require("../processes/processor.js");

const emailQueue = new Bull("email", {
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
  connectTimeout: 180000,
});

const processorFuct = function (job, done) {
  console.log("I am in processor");
  console.log("job.data: ", job.data);
  return Promise.resolve(job);
  //   return Promise.resolve(job);
};

emailQueue.process(processorFuct);

const sendNewEmail = async (data) => {
  console.log("entered");
  await emailQueue.add(data, {});
  console.log(data, "111");
};

module.exports = { sendNewEmail };
