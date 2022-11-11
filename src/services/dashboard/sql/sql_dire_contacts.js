const { dire_listAllContacts } = require("../../axios");

const sql_dire_contacts = async () => {
  try {
    const response = await dire_listAllContacts();
    return response.data.contacts
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

module.exports = sql_dire_contacts;
