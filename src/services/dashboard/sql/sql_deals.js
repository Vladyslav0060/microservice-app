const { ac_listAllDeals } = require("../../axios");
const { validateArray } = require("./utils");

const sql_deals = async () => {
  try {
    const deals = await ac_listAllDeals();
    return validateArray(deals, ["nextTask"]);
    // return deals
    //   .map((item) => {
    //     const { links, ...object } = item;
    //     if (!object.hasOwnProperty("nextTask")) object.nextTask = "";

    //     const result = Object.values(object).map((field) => {
    //       return Array.isArray(field)
    //         ? `'${JSON.stringify(field)}'`
    //         : !field
    //         ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
    //         : `'${JSON.stringify(field)
    //             .replace(/\'/g, "''")
    //             .replace(/'/g, "''")
    //             .replace(/"/g, "")}'`;
    //     });
    //     return `(${result})`;
    //   })
    //   .join(",");
  } catch (error) {
    console.log("❌ contacts", error);
  }
};

module.exports = sql_deals;
