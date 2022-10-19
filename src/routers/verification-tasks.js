const { Router } = require("express");
const Bull = require("bull");

const verificationRouter = Router();

const queue = new Bull("queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 5, duration: 1000 },
});

const testQueue = new Bull("testQueue");

testQueue.process(function (job) {
  console.log(job.data, new Date());
});

testQueue.add({ test: "test" }, { repeat: { cron: "* * * * *" } });

const start = (email, dev) => queue.add("listContacts", { email, dev });

const verificateTasks = async (req, res) => {
  try {
    const { email } = req.query;
    const isDev =
      req.originalUrl.split("?email")[0].split("/").at(-1) === "dev";
    if (!email || req.headers.api_key !== process.env.API_KEY)
      return res.sendStatus(401);
    start(email.split(" ").join("+"), isDev);
    return res.sendStatus(200);
  } catch (error) {
    return res.send(404).send(error);
  }
};

verificationRouter.get("/", verificateTasks);

verificationRouter.get("/dev", verificateTasks);

module.exports = verificationRouter;
