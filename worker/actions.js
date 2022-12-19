const {
  postgres,
  tables,
  get_sql_function,
} = require("../src/services/dbClient");
const {
  update_custom_fields_contacts,
  update_custom_fields_deals,
} = require("../src/services/dashboard/sql");
const loader = require("../src/services/dashboard/csv/loader");

class QueueActions {
  update_any_table = async (tableName) => {
    await postgres.truncate(tableName);
    console.log({ tableName });
    await postgres.insert(tableName, await get_sql_function[tableName]());
  };

  update_ic_ac_contacts = async () => {
    await this.update_any_table(tables.IC_AC_CONTACTS);
    await update_custom_fields_contacts(false);
  };

  update_dire_ac_contacts = async () => {
    await this.update_any_table(tables.DIRE_AC_CONTACTS);
    await update_custom_fields_contacts(true);
  };

  update_ic_ac_deals = async () => {
    await this.update_any_table(tables.IC_AC_DEALS);
    await update_custom_fields_deals(false);
  };

  update_dire_ac_deals = async () => {
    await this.update_any_table(tables.DIRE_AC_DEALS);
    await update_custom_fields_deals(true);
  };

  update_ic_uc_joined_report = async () => await loader();

  update_ic_ac_contacts_fields = async () =>
    await this.update_any_table(tables.IC_AC_CONTACTS_FIELDS);

  update_dire_ac_contacts_fields = async () =>
    await this.update_any_table(tables.DIRE_AC_CONTACTS_FIELDS);

  update_ic_ac_deals_fields = async () =>
    await this.update_any_table(tables.IC_AC_DEALS_FIELDS);

  update_dire_ac_deals_fields = async () =>
    await this.update_any_table(tables.DIRE_AC_DEALS_FIELDS);

  update_ic_ac_pipelines = async () =>
    await this.update_any_table(tables.IC_AC_PIPELINES);

  update_dire_ac_pipelines = async () =>
    await this.update_any_table(tables.DIRE_AC_PIPELINES);

  update_ic_ac_stages = async () =>
    await this.update_any_table(tables.IC_AC_STAGES);

  update_dire_ac_stages = async () =>
    await this.update_any_table(tables.DIRE_AC_STAGES);

  update_ic_ac_task_types = async () =>
    await this.update_any_table(tables.IC_AC_TASK_TYPES);

  update_dire_ac_task_types = async () =>
    await this.update_any_table(tables.DIRE_TASK_TYPES);

  update_ic_ac_tasks = async () =>
    await this.update_any_table(tables.IC_AC_TASKS);

  update_dire_ac_tasks = async () =>
    await this.update_any_table(tables.DIRE_AC_TASKS);

  update_ic_ac_users = async () =>
    await this.update_any_table(tables.IC_AC_USERS);

  update_dire_ac_users = async () =>
    await this.update_any_table(tables.DIRE_AC_USERS);
}

const q_a = new QueueActions();

const ACTION_TYPES = {
  UPDATE_IC_AC_CONTACTS: () => q_a.update_ic_ac_contacts(),
  UPDATE_DIRE_AC_CONTACTS: () => q_a.update_dire_ac_contacts(),

  UPDATE_IC_AC_CONTACTS_FIELDS: () => q_a.update_ic_ac_contacts_fields(),
  UPDATE_DIRE_AC_CONTACTS_FIELDS: () => q_a.update_dire_ac_contacts_fields(),

  UPDATE_IC_AC_USERS: () => q_a.update_ic_ac_users(),
  UPDATE_DIRE_AC_USERS: () => q_a.update_dire_ac_users(),

  UPDATE_IC_AC_DEALS: () => q_a.update_ic_ac_deals(),
  UPDATE_DIRE_AC_DEALS: () => q_a.update_dire_ac_deals(),

  UPDATE_IC_AC_DEALS_FIELDS: () => q_a.update_ic_ac_deals_fields(),
  UPDATE_DIRE_AC_DEALS_FIELDS: () => q_a.update_dire_ac_deals_fields(),

  UPDATE_IC_AC_PIPELINES: () => q_a.update_ic_ac_pipelines(),
  UPDATE_DIRE_AC_PIPELINES: () => q_a.update_dire_ac_pipelines(),

  UPDATE_IC_AC_STAGES: () => q_a.update_ic_ac_stages(),
  UPDATE_DIRE_AC_STAGES: () => q_a.update_dire_ac_stages(),

  UPDATE_IC_AC_TASKS: () => q_a.update_ic_ac_tasks(),
  UPDATE_DIRE_AC_TASKS: () => q_a.update_dire_ac_tasks(),

  UPDATE_IC_AC_TASK_TYPES: () => q_a.update_ic_ac_task_types(),
  UPDATE_DIRE_AC_TASK_TYPES: () => q_a.update_dire_ac_task_types(),

  UPDATE_IC_UC_JOINED_REPORT: () => q_a.update_ic_uc_joined_report(),
};

module.exports = ACTION_TYPES;
