const { postgres, tables } = require("../src/services/dbClient");
const sql = require("../src/services/dashboard/sql");
const loader = require("../src/services/dashboard/csv/loader");

class QueueActions {
  constructor() {
    console.log("NEW QUEUEACTIONS OBJECT");
  }
  update_ic_ac_contacts = async () => {
    await postgres.truncate(tables.IC_AC_CONTACTS);
    await postgres.insert(tables.IC_AC_CONTACTS, await sql.sql_contacts(false));
    await sql.update_custom_fields_contacts(false);
  };

  update_dire_ac_contacts = async () => {
    await postgres.truncate(tables.DIRE_AC_CONTACTS);
    await postgres.insert(
      tables.DIRE_AC_CONTACTS,
      await sql.sql_contacts(true)
    );
    await sql.update_custom_fields_contacts(true);
  };

  update_ic_ac_deals = async () => {
    await postgres.truncate(tables.IC_AC_DEALS);
    await postgres.insert(tables.IC_AC_DEALS, await sql.sql_deals(false));
    await sql.update_custom_fields_deals(false);
  };

  update_dire_ac_deals = async () => {
    await postgres.truncate(tables.DIRE_AC_DEALS);
    await postgres.insert(tables.DIRE_AC_DEALS, await sql.sql_deals(true));
    await sql.update_custom_fields_deals(true);
  };

  update_ic_uc_joined_report = async () => await loader();

  update_ic_ac_contacts_fields = async () => {
    await postgres.truncate(tables.IC_AC_CONTACTS_FIELDS);
    await postgres.insert(
      tables.IC_AC_CONTACTS_FIELDS,
      await sql.sql_contacts_fields(false)
    );
  };

  update_dire_ac_contacts_fields = async () => {
    await postgres.truncate(tables.DIRE_AC_CONTACTS_FIELDS);
    await postgres.insert(
      tables.DIRE_AC_CONTACTS_FIELDS,
      await sql.sql_contacts_fields(true)
    );
  };

  update_ic_ac_deals_fields = async () => {
    await postgres.truncate(tables.IC_AC_DEALS_FIELDS);
    await postgres.insert(
      tables.IC_AC_DEALS_FIELDS,
      await sql.sql_deals_fields(false)
    );
  };

  update_dire_ac_deals_fields = async () => {
    await postgres.truncate(tables.DIRE_AC_DEALS_FIELDS);
    await postgres.insert(
      tables.DIRE_AC_DEALS_FIELDS,
      await sql.sql_deals_fields(true)
    );
  };

  update_ic_ac_pipelines = async () => {
    await postgres.truncate(tables.IC_AC_PIPELINES);
    await postgres.insert(
      tables.IC_AC_PIPELINES,
      await sql.sql_pipelines(false)
    );
  };

  update_dire_ac_pipelines = async () => {
    await postgres.truncate(tables.DIRE_AC_PIPELINES);
    await postgres.insert(
      tables.DIRE_AC_PIPELINES,
      await sql.sql_pipelines(true)
    );
  };

  update_ic_ac_stages = async () => {
    await postgres.truncate(tables.IC_AC_STAGES);
    await postgres.insert(tables.IC_AC_STAGES, await sql.sql_stages(false));
  };

  update_dire_ac_stages = async () => {
    await postgres.truncate(tables.DIRE_AC_STAGES);
    await postgres.insert(tables.DIRE_AC_STAGES, await sql.sql_stages(true));
  };

  update_ic_ac_task_types = async () => {
    await postgres.truncate(tables.IC_AC_TASK_TYPES);
    await postgres.insert(
      tables.IC_AC_TASK_TYPES,
      await sql.sql_task_types(false)
    );
  };

  update_dire_ac_task_types = async () => {
    await postgres.truncate(tables.DIRE_AC_TASK_TYPES);
    await postgres.insert(
      tables.DIRE_AC_TASK_TYPES,
      await sql.sql_task_types(true)
    );
  };

  update_ic_ac_tasks = async () => {
    await postgres.truncate(tables.IC_AC_TASKS);
    await postgres.insert(tables.IC_AC_TASKS, await sql.sql_tasks(false));
  };

  update_dire_ac_tasks = async () => {
    await postgres.truncate(tables.DIRE_AC_TASKS);
    await postgres.insert(tables.DIRE_AC_TASKS, await sql.sql_tasks(true));
  };

  update_ic_ac_users = async () => {
    await postgres.truncate(tables.IC_AC_USERS);
    await postgres.insert(tables.IC_AC_USERS, await sql.sql_users(false));
  };

  update_dire_ac_users = async () => {
    await postgres.truncate(tables.DIRE_AC_USERS);
    await postgres.insert(tables.DIRE_AC_USERS, await sql.sql_users(true));
  };
}

module.exports = new QueueActions();
