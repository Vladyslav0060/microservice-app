const { ac_listAllTasks, dire_listAllTasks } = require("../../axios");
const { validateArray } = require("./utils");

const sql_tasks = async (isDire = false) => {
  try {
    return validateArray(
      isDire ? await dire_listAllTasks() : await ac_listAllTasks(),
      ["taskOutcome", "updatedBy", "doneBy"]
    );
  } catch (error) {
    console.log("❌ sql_tasks", error);
  }
};

module.exports = sql_tasks;
