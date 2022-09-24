const express = require("express");
const app = express();
const { sendNewEmail } = require("./src/queues/queue");
require("dotenv").config();

process.on("uncaughtException", (error) => {
  console.log(error);
});

app.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) res.status(401).send("Email address required");
    await sendNewEmail(email);
    return res.sendStatus(200);
  } catch (error) {
    res.send(404).send(error);
  }
});

app.listen(5000, () => console.log("works on 5000"));
