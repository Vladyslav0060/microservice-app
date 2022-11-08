const express = require("express");
require("dotenv").config();
const { adminRouter, verificationRouter } = require("./src/routers");
const csvService = require("./src/services/csv/csvService");

const app = express();

csvService();

app.use("/admin/queues", adminRouter);

app.use("/verification-tasks", verificationRouter);

app.listen(process.env.PORT, () =>
  console.log(`Started on ${process.env.PORT} ✅`)
);
