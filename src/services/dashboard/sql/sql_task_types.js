const { ac_listAllTaskTypes, dire_listAllTaskTypes } = require("../../axios");
const { validateArray } = require("./utils");

const sql_tasks_types = async (isDire = false) => {
  try {
    return validateArray(
      isDire ? await dire_listAllTaskTypes() : await ac_listAllTaskTypes()
    );
  } catch (error) {
    console.log("❌ sql_tasks", error);
  }
};

module.exports = sql_tasks_types;
