const Bull = require("bull");
const { deals, contacts, tasks } = require("../services");

const emailQueue = new Bull("closeTasks", process.env.REDIS_URL, {
  limiter: { max: 5, duration: 10000 },
});

emailQueue.on("error", () => console.log("err"));

emailQueue.process(async (job, done) => {
  try {
    const userCreds = await contacts.listAllContacts(job.data.email);
    const foundDeals = await deals.listAllDeals(userCreds);
    const taskIds = await tasks.listAllTasks(foundDeals);
    if (taskIds.length) await tasks.closeTasks(taskIds);
    done();
  } catch (error) {
    console.log(error);
  }
});

const sendNewEmail = async (email) => {
  await emailQueue.add({ email });
};

module.exports = { sendNewEmail };
