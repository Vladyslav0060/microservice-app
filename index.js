const express = require("express");
const app = express();
const { addNewWorkerTask, apiQueue } = require("./src/queues/queue");
require("dotenv").config();
const { createBullBoard } = require("bull-board");
const { BullAdapter } = require("bull-board/bullAdapter");
const workerQueue = require("./src/services/worker");
process.on("uncaughtException", (error) => {
  console.log(error);
});

const { router } = createBullBoard([
  new BullAdapter(apiQueue),
  new BullAdapter(workerQueue),
]);

app.use("/admin/queues", router);

app.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.sendStatus(401);
    addNewWorkerTask("listContacts", { email });
    return res.sendStatus(200);
  } catch (error) {
    return res.send(404).send(error);
  }
});

app.listen(5000, () => console.log("works on 5000"));
