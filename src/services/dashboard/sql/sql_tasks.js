const { ac_listAllTasks } = require("../../axios");

const sql_tasks = async () => {
  try {
    const response = await ac_listAllTasks();
    const result = response
      .map((item) => {
        const { links, ...object } = item;
        const propertiesToCheck = ["taskOutcome", "updatedBy", "doneBy"];

        propertiesToCheck.forEach((property) => {
          if (!object.hasOwnProperty(property)) object[property] = "";
        });
        const final = Object.values(object).map((field) => {
          return Array.isArray(field)
            ? `'${JSON.stringify(field)}'`
            : !field
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
            : `'${JSON.stringify(field)
                .replace(/\'/g, "''")
                .replace(/'/g, "''")
                .replace(/"/g, "")}'`;
        });
        return `(${final})`;
      })
      .join(",");
    return result;
  } catch (error) {
    console.log("❌ sql_tasks", error);
  }
};

module.exports = sql_tasks;
