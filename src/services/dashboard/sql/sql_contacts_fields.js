const {
  ac_listAllCustomFieldsContacts,
  dire_listAllCustomFieldsContacts,
} = require("../../axios");
const { validateArray } = require("./utils");

const sql_contacts_fields = async (isDire = false) => {
  try {
    return validateArray(
      isDire
        ? await dire_listAllCustomFieldsContacts()
        : await ac_listAllCustomFieldsContacts()
    );
  } catch (error) {
    console.log("❌ sql_contacts_fields", error);
  }
};

module.exports = sql_contacts_fields;
