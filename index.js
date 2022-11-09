const express = require("express");
require("dotenv").config();
const { adminRouter, verificationRouter } = require("./src/routers");
const contacts = require("./src/services/ac/dashboard/contacts/contacts");
const csvService = require("./src/services/ac/dashboard/csv/csvService");
const { insertContacts } = require("./src/services/ac/dashboard/dbClient");
const {
  truncateTable,
} = require("./src/services/ac/dashboard/dbClient/dbClient");

const app = express();

csvService();

app.use("/admin/queues", adminRouter);

app.use("/verification-tasks", verificationRouter);

app.get("/", async (req, res) => {
  const response = await contacts();
  await truncateTable("ic_ac_contacts");
  insertContacts("ic_ac_contacts", response);
  res.send(response);
});

app.listen(process.env.PORT, () =>
  console.log(`Started on ${process.env.PORT} ✅`)
);
