const Bull = require("bull");
const express = require("express");
require("dotenv").config();
const { adminRouter, verificationRouter } = require("./src/routers");
const loader = require("./src/services/loader");

const testQueue = new Bull("testQueue", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

testQueue.on("error", (e) => console.log(e));

const app = express();

loader();
// app.use(() => {
//   console.log("works");
//   // testQueue.add(
//   //   { foo: "test" },
//   //   {
//   //     repeat: {
//   //       every: 1000,
//   //       limit: 100,
//   //     },
//   //     lifo: true,
//   //   }
//   // );
// });

app.use("/admin/queues", adminRouter);

app.use("/verification-tasks", verificationRouter);

app.listen(process.env.PORT, () =>
  console.log(`Started on ${process.env.PORT}`)
);
