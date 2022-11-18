const { ac_listAllStages } = require("../../axios");

const sql_stages = async () => {
  try {
    const response = await ac_listAllStages();
    const result = response
      .map((item) => {
        const { links, ...object } = item;
        return `(${Object.values(object).map((field) => {
          return Array.isArray(field)
            ? `'${JSON.stringify(field)}'`
            : !field
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
            : `'${JSON.stringify(field)
                .replace(/\'/g, "''")
                .replace(/'/g, "''")
                .replace(/"/g, "")}'`;
        })})`;
      })
      .join(",");
    return result;
  } catch (error) {
    console.log("❌ sql_stages", error);
  }
};

module.exports = sql_stages;
