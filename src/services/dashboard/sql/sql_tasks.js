const { ac_listAllTasks } = require("../../axios");

const sql_tasks = async () => {
  try {
    const response = await ac_listAllTasks();

    return response.data.dealTasks
      .map((task) => {
        const tasks = Object.values(task).map((field) => {
          return Array.isArray(field)
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`
            : !field
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
            : JSON.stringify(field).replace(/'/g, "''").replace(/"/g, "'");
        });
        return `(${tasks})`;
      })
      .join(",");
  } catch (error) {
    console.log("❌ sql_tasks", error);
  }
};

module.exports = sql_tasks;
