const {
  ac_listAllContacts,
  retreiveContactData,
  getData,
} = require("../../axios");
const { validateArray } = require("./utils");
const { postgres, postgres_ac } = require("../../dbClient");
const _ = require("lodash");

const update_custom_fields_contacts = async () => {
  const result = {};
  const fields = await getData("fields");
  const fieldValues = await getData("fieldValues");

  const fieldsById = _.keyBy(fields, "id");
  for (const currentField of fieldValues) {
    //field by id | currentField.field = field_id
    const fieldName = _.get(fieldsById, [currentField.field, "title"], null);
    if (!fieldName) continue; // move to next iteration
    _.set(result, [currentField.contact, fieldName], currentField.value);
  }

  for (const [contact_id, data] of Object.entries(result)) {
    const values = Object.entries(data)
      .map((entry) => `"${entry[0]}"='${entry[1].replace(/'/g, "''")}'`)
      .join(",");

    await postgres.client.query(
      `UPDATE ic_ac_contacts SET ${values} where "id"=${contact_id}`
    );
  }
  console.log("all updated");
};

const sql_contacts = async () => {
  try {
    const contacts = await ac_listAllContacts();
    return validateArray(contacts);
    // const result = contacts
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

module.exports = { sql_contacts, update_custom_fields_contacts };
