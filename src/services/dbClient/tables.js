const functions = require("../axios");
const tables = {
  IC_AC_CONTACTS: "ic_ac_contacts",
  IC_AC_CONTACTS_FIELDS: "ic_ac_contacts_fields",
  IC_AC_USERS: "ic_ac_users",
  IC_AC_DEALS: "ic_ac_deals",
  IC_AC_DEALS_FIELDS: "ic_ac_deals_fields",
  IC_AC_PIPELINES: "ic_ac_pipelines",
  IC_AC_STAGES: "ic_ac_stages",
  IC_AC_TASKS: "ic_ac_tasks",
  IC_AC_TASK_TYPES: "ic_ac_task_types",
  IC_UC_JOINED_REPORT: "ic_uc_joined_report",
  DIRE_AC_CONTACTS: "dire_ac_contacts",
  DIRE_AC_DEALS_FIELDS: "dire_ac_deals_fields",
  DIRE_AC_CONTACTS_FIELDS: "dire_ac_contacts_fields",
  DIRE_AC_PIPELINES: "dire_ac_pipelines",
  DIRE_AC_STAGES: "dire_ac_stages",
  DIRE_TASK_TYPES: "dire_ac_task_types",
  DIRE_AC_TASKS: "dire_ac_tasks",
  DIRE_AC_USERS: "dire_ac_users",
  DIRE_AC_DEALS: "dire_ac_deals",
};

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

module.exports = { tables, get_api_function };
