const {
  sql_contacts,
  update_custom_fields_contacts,
} = require("./sql_contacts");
const { sql_deals, update_custom_fields_deals } = require("./sql_deals");
const sql_tasks = require("./sql_tasks");
const sql_pipelines = require("./sql_pipelines");
const sql_contacts_fields = require("./sql_contacts_fields");
const sql_deals_fields = require("./sql_deals_fields");
const sql_users = require("./sql_users");
const sql_task_types = require("./sql_task_types");

module.exports = {
  sql_contacts,
  update_custom_fields_contacts,
  update_custom_fields_deals,
  sql_deals,
  sql_tasks,
  sql_task_types,
  sql_pipelines,
  sql_contacts_fields,
  sql_deals_fields,
  sql_users,
};
