const express = require("express");
require("dotenv").config();
const Bull = require("bull");
const { createBullBoard } = require("bull-board");
const { BullAdapter } = require("bull-board/bullAdapter");
const app = express();

const queue = new Bull("queue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
  limiter: { max: 5, duration: 1000 },
});

const { router } = createBullBoard([new BullAdapter(queue)]);

const start = (email) => queue.add("listContacts", { email });

app.use("/admin/queues", router);

app.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.sendStatus(401);
    start(email.split(" ").join("+"));
    return res.sendStatus(200);
  } catch (error) {
    return res.send(404).send(error);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Started on ${process.env.PORT}`)
);
