const express = require("express");
require("dotenv").config();
const { adminRouter, verificationRouter } = require("./src/routers");
const csvService = require("./src/services/dashboard/csv/csvService");
const { tables, postgres } = require("./src/services/dbClient");
const {
  sql_tasks,
  sql_users,
  sql_deals,
  sql_deals_fields,
  sql_contacts,
  update_custom_fields_contacts,
  update_custom_fields_deals,
  sql_contacts_fields,
} = require("./src/services/dashboard/sql");
const {
  dire_listAllTasks,
  dire_listAllContacts,
  dire_axios,
  dire_listAllUsers,
  dire_listAllDeals,
  dire_listAllCustomFieldsContacts,
  getData,
} = require("./src/services/axios");
const sql_stages = require("./src/services/dashboard/sql/sql_stages");
const loader = require("./src/services/dashboard/csv/loader");
const { check_new_columns } = require("./src/services/dashboard/sql/utils");
const actions = require("./worker/actions");
const { get_sql_function } = require("./src/services/dbClient/utils");

const app = express();

csvService();
// sql_contacts();
const test = async () => {
  console.log("start test");
  // await postgres.truncate(tables.DIRE_AC_DEALS);
  // await postgres.insert(tables.DIRE_AC_DEALS, await sql_deals(true));
  // await actions.update_dire_ac_stages();
  // await actions.update_dire_ac_stages();
  // await actions.update_dire_ac_stages();
  // await loader();
  // await update_custom_fields_contacts();
  // await postgres.truncate(tables.IC_AC_DEALS);
  // await postgres.insert(tables.IC_AC_DEALS, await sql_deals(false));
  // await update_custom_fields_deals(false);

  // await postgres.truncate(tables.IC_AC_CONTACTS);
  // await postgres.insert(tables.IC_AC_CONTACTS, await sql_contacts(false));
  // await update_custom_fields_contacts(false);
  // await sql_contacts(true);
  // await postgres.truncate(tables.DIRE_AC_CONTACTS);
  // await postgres.insert(tables.DIRE_AC_CONTACTS, await sql_contacts(true));
  // await check_new_columns(tables.DIRE_AC_CONTACTS);

  // await update_custom_fields_contacts(true);
  // const fields = await getData("fields", true);
  // fields.forEach((field) => console.log(field.title));

  // console.log("Started trunctate ", tables.DIRE_AC_DEALS);
  // await postgres.truncate(tables.DIRE_AC_DEALS);
  // console.log("Finished trunctate ", tables.DIRE_AC_DEALS);
  // console.log("Started insert ", tables.DIRE_AC_DEALS);
  // await postgres.insert(tables.DIRE_AC_DEALS, await sql_deals(true));
  // console.log("Finished insert ", tables.DIRE_AC_DEALS);
  // console.log("Started update custom fields ", tables.DIRE_AC_DEALS);
  // await update_custom_fields_deals(true);
  // console.log("Finished update custom fields ", tables.DIRE_AC_DEALS);
  // await postgres.truncate(tables.DIRE_AC_DEALS_FIELDS);
  // await postgres.insert(
  //   tables.DIRE_AC_DEALS_FIELDS,
  //   await sql_deals_fields(true)
  // );
  // await postgres.truncate(tables.DIRE_AC_CONTACTS);
  // await postgres.insert(tables.DIRE_AC_CONTACTS, await sql_contacts(true));
  // await update_custom_fields_contacts(true);
};

test();
app.use("/admin/queues", adminRouter);

app.use("/verification-tasks", verificationRouter);

app.listen(process.env.PORT, () =>
  console.log(`Started on ${process.env.PORT} ✅`)
);
