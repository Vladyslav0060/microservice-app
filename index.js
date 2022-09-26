const express = require("express");
const app = express();
const { router, start } = require("./src/queues");
require("dotenv").config();

app.use("/admin/queues", router);

app.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.sendStatus(401);
    start(email);
    return res.sendStatus(200);
  } catch (error) {
    return res.send(404).send(error);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Started on ${process.env.PORT}`)
);
