const { ac_listAllPipelines, dire_listAllPipelines } = require("../../axios");
const { validateArray } = require("./utils");

const sql_tasks = async (isDire = false) => {
  try {
    return validateArray(
      isDire ? await dire_listAllPipelines() : await ac_listAllPipelines()
    );
  } catch (error) {
    console.log("❌ contacts", error);
  }
};

module.exports = sql_tasks;
