const { Router } = require("express");
const { init_verification_queue } = require("../services/queues");

const verificationRouter = Router();

const verificateTasks = async (req, res) => {
  try {
    const { email } = req.query;
    const isDev =
      req.originalUrl.split("?email")[0].split("/").at(-1) === "dev";
    if (!email || req.headers.api_key !== process.env.API_KEY)
      return res.sendStatus(401);
    init_verification_queue(email.split(" ").join("+"), isDev);
    return res.sendStatus(200);
  } catch (error) {
    return res.send(404).send(error);
  }
};

verificationRouter.get("/", verificateTasks);

verificationRouter.get("/dev", verificateTasks);

module.exports = verificationRouter;
