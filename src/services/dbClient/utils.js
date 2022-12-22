const functions = require("../axios");
const sql = require("../dashboard/sql");

const get_api_function = {
  ic_ac_contacts: () => functions.ac_listAllContacts(),
  ic_ac_contacts_fields: () => functions.ac_listAllCustomFieldsContacts(),
  ic_ac_deals: () => functions.ac_listAllDeals(),
  ic_ac_deals_fields: () => functions.ac_listAllCustomFieldsDeals(),
  ic_ac_pipelines: () => functions.ac_listAllPipelines(),
  ic_ac_stages: () => functions.ac_listAllStages(),
  ic_ac_tasks: () => functions.ac_listAllTasks(),
  dire_ac_contacts: () => functions.dire_listAllContacts(),
  dire_ac_contacts_fields: () => functions.dire_listAllCustomFieldsContacts(),
  dire_ac_users: () => functions.dire_listAllContacts(),
  dire_ac_deals: () => functions.dire_listAllDeals(),
  dire_ac_deals_fields: () => functions.dire_listAllCustomFieldsDeals(),
};

const get_sql_function = {
  ic_ac_contacts_fields: () => sql.sql_contacts_fields(false),
  dire_ac_contacts_fields: () => sql.sql_contacts_fields(true),

  ic_ac_contacts: () => sql.sql_contacts(false),
  dire_ac_contacts: () => sql.sql_contacts(true),

  ic_ac_deals_fields: () => sql.sql_deals_fields(false),
  dire_ac_deals_fields: () => sql.sql_deals_fields(true),

  ic_ac_deals: () => sql.sql_deals(false),
  dire_ac_deals: () => sql.sql_deals(true),

  ic_ac_pipelines: () => sql.sql_pipelines(false),
  dire_ac_pipelines: () => sql.sql_pipelines(true),

  ic_ac_stages: () => sql.sql_stages(false),
  dire_ac_stages: () => sql.sql_stages(true),

  ic_ac_task_types: () => sql.sql_task_types(false),
  dire_ac_task_types: () => sql.sql_task_types(true),

  ic_ac_tasks: () => sql.sql_tasks(false),
  dire_ac_tasks: () => sql.sql_tasks(true),

  ic_ac_users: () => sql.sql_users(false),
  dire_ac_users: () => sql.sql_users(true),
};

module.exports = { get_api_function, get_sql_function };
