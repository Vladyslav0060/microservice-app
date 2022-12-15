const { ac_listAllStages } = require("../../axios");
const { dire_listAllStages } = require("../../axios/axios");
const { validateArray } = require("./utils");
const sql_stages = async (isDire = false) => {
  try {
    return validateArray(
      isDire ? await dire_listAllStages() : await ac_listAllStages()
    );
  } catch (error) {
    console.log("❌ sql_stages", error);
  }
};

module.exports = sql_stages;
