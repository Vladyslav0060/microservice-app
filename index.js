const express = require("express");
require("dotenv").config();
const { adminRouter, verificationRouter } = require("./src/routers");

const app = express();

app.use("/admin/queues", adminRouter);

app.use("/verification-tasks", verificationRouter);

app.listen(process.env.PORT, () =>
  console.log(`Started on ${process.env.PORT}`)
);
