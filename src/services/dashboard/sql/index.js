const {
  sql_contacts,
  update_custom_fields_contacts,
} = require("./sql_contacts");
const sql_deals = require("./sql_deals");
const sql_dire_contacts = require("./sql_dire_contacts");
const sql_tasks = require("./sql_tasks");
const sql_pipelines = require("./sql_pipelines");

module.exports = {
  sql_contacts,
  update_custom_fields_contacts,
  sql_deals,
  sql_dire_contacts,
  sql_tasks,
  sql_pipelines,
};
