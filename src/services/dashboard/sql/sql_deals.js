const { ac_listAllDeals } = require("../../axios");

const sql_deals = async () => {
  try {
    const response = await ac_listAllDeals();
    return response.data.deals
      .map((item) => {
        const { links, ...contact } = item;

        const contacts = Object.values(contact).map((field) => {
          return Array.isArray(field)
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`
            : !field
            ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
            : JSON.stringify(field).replace(/'/g, "''").replace(/"/g, "'");
        });
        if (contacts.length < 26) contacts.splice(-2, 0, `'null'`);
        return `(${contacts})`;
      })
      .join(",");
  } catch (error) {
    console.log("❌ contacts", error);
  }
};

module.exports = sql_deals;
