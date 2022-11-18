const { ac_listAllPipelines } = require("../../axios");
const { validateArray } = require("./utils");

const sql_tasks = async () => {
  try {
    const dealStages = await ac_listAllPipelines();
    return validateArray(dealStages);
    // const result = dealStages
    //   .map((item) => {
    //     const { links, ...contact } = item;
    //     return `(${Object.values(contact).map((field) => {
    //       return Array.isArray(field)
    //         ? `'${JSON.stringify(field)}'`
    //         : !field
    //         ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
    //         : `'${JSON.stringify(field)
    //             .replace(/\'/g, "''")
    //             .replace(/'/g, "''")
    //             .replace(/"/g, "")}'`;
    //     })})`;
    //   })
    //   .join(",");
    // return result;
  } catch (error) {
    console.log("❌ contacts", error);
  }
};

module.exports = sql_tasks;
