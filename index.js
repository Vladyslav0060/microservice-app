const express = require("express");
const app = express();
const axios = require("axios").default;
const cors = require("cors");
const { deals, contacts, tasks } = require("./src/services");
// const { sendNewEmail } = require("./src/queues/email.queue");
const Bull = require("bull");
require("dotenv").config();

process.on("uncaughtException", () => {});
axios.defaults.headers.common["Api-Token"] = process.env.API_TOKEN;

app.use(cors());
app.use(express.json());

const newQueue = new Bull("new_queue", {
  redis: { port: 6379, host: "127.0.0.1" },
});

newQueue.on("error", (e) => console.log("error", e));

app.post("/send-email", async (req, res) => {
  //    processorFuct(req.body);
  //   await sendNewEmail(req.body);
  res.send({ status: "ok" });
});

app.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) res.status(401).send("Email address required");
    const userCreds = await contacts.listAllContacts(email);
    const foundDeals = await deals.listAllDeals(userCreds);
    const taskIds = await tasks.listAllTasks(foundDeals);
    if (taskIds.length) await tasks.closeTasks(taskIds);
    return res.sendStatus(200);
  } catch (error) {
    res.send(404).send(error);
  }
});

app.listen(5000, () => console.log("works on 5000"));
