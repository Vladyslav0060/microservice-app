const { ac_listAllStages } = require("../../axios");

const sql_stages = async () => {
  try {
    const response = await ac_listAllStages();

    return response.data.dealStages
      .map((item) => {
        const { links, ...stage } = item;

        const stages = Object.values(stage).map((field) => {
          return Array.isArray(field)
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`
            : !field
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
            : JSON.stringify(field).replace(/'/g, "''").replace(/"/g, "'");
        });
        console.log(stages.length);
        return `(${stages})`;
      })
      .join(",");
  } catch (error) {
    console.log("❌ sql_stages", error);
  }
};

module.exports = sql_stages;
