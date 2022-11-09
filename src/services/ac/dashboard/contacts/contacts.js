const { ac_listAllContacts } = require("../../../axios");

const contacts = async () => {
  try {
    const response = await ac_listAllContacts();
    const result = response.data.contacts
      .map((item) => {
        const { links, ...contact } = item;

        return `(${Object.values(contact).map((field) => {
          return Array.isArray(field)
            ? `'${JSON.stringify(field)}'`
            : !field
            ? `'${JSON.stringify(field)}'`.replace(/"/g, "")
            : JSON.stringify(field).replace(/"/g, "'");
        })})`;
      })
      .join(",");

    return result;
  } catch (error) {
    console.log("❌ contacts", error);
  }
};

module.exports = contacts;
