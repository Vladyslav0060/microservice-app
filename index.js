const express = require("express");
require("dotenv").config();
const { adminRouter, verificationRouter } = require("./src/routers");
const { init_db_queue } = require("./src/services/queues");

const app = express();

init_db_queue();

app.use("/admin/queues", adminRouter);

app.use("/verification-tasks", verificationRouter);

app.listen(process.env.PORT, () =>
  console.log(`Started on ${process.env.PORT} ✅`)
);
