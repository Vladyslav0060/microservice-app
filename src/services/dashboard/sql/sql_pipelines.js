const { ac_listAllPipelines } = require("../../axios");

const sql_tasks = async () => {
  try {
    const response = await ac_listAllPipelines();

    return response.data.dealStages
      .map((item) => {
        const { links, ...contact } = item;

        const contacts = Object.values(contact).map((field) => {
          return Array.isArray(field)
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`
            : !field
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
            : JSON.stringify(field).replace(/'/g, "''").replace(/"/g, "'");
        });

        return `(${contacts})`;
      })
      .join(",");
  } catch (error) {
    console.log("❌ contacts", error);
  }
};

module.exports = sql_tasks;
