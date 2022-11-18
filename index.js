const express = require("express");
require("dotenv").config();
const { adminRouter, verificationRouter } = require("./src/routers");
const {
  ac_listAllContacts,
  ac_listAllDeals,
  ac_listAllTasks,
  getData,
  ac_axios,
  ac_listAllCustomFieldsContacts,
} = require("./src/services/axios");
const csvService = require("./src/services/dashboard/csv/csvService");
const {
  sql_contacts,
  sql_deals,
  sql_pipelines,
  sql_tasks,
  update_custom_fields_contacts,
} = require("./src/services/dashboard/sql");
const sql_stages = require("./src/services/dashboard/sql/sql_stages");
const { postgres } = require("./src/services/dbClient");
const _ = require("lodash");

const app = express();

csvService();
// sql_contacts();
const test = async () => {
  console.log("start test");
  // console.log(await ac_listAllCustomFieldsContacts());
  // await update_custom_fields_contacts();
  // await postgres.truncate("ic_ac_stages");
  // await postgres.insert("ic_ac_stages", await sql_stages());
  // await postgres.truncate("ic_ac_tasks");
  // await postgres.insert("ic_ac_tasks", await sql_tasks());
  await postgres.truncate("ic_ac_pipelines");
  await postgres.insert("ic_ac_pipelines", await sql_pipelines());
  // await postgres.truncate("ic_ac_deals");
  // await postgres.insert("ic_ac_deals", await sql_deals());
  // await postgres.truncate("ic_ac_contacts");
  // await postgres.insert("ic_ac_contacts", await sql_contacts());
};

test();
app.use("/admin/queues", adminRouter);

app.use("/verification-tasks", verificationRouter);

app.listen(process.env.PORT, () =>
  console.log(`Started on ${process.env.PORT} ✅`)
);
