const {
  ac_listAllContacts,
  getData,
  dire_listAllContacts,
} = require("../../axios");
const {
  validateArray,
  check_new_columns,
  validateField,
  sliceIntoChunks,
} = require("./utils");
const { postgres, tables } = require("../../dbClient");

const update_custom_fields_contacts = async (isDire) => {
  try {
    const table_name = isDire ? tables.DIRE_AC_CONTACTS : tables.IC_AC_CONTACTS;
    const fields = await getData("fields", isDire);
    const chunkedArray = sliceIntoChunks(fields, 10);

    const getDataByColumn = async (field) => {
      const fieldValues = await getData("fieldValues", isDire, {
        "filters[fieldid]": field.id,
        limit: 100,
      });

      console.log(field.title, " started");
      const values = fieldValues
        .filter((fieldValue) => !!fieldValue.value)
        .map((fieldValue) => {
          const { contact, value } = fieldValue;
          return `(${validateField(contact)}, ${validateField(value)})`;
        })
        .join(",");
      if (field.title.length > 62) {
        const query = `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table_name}';`;
        const db_columns = await postgres.client.query(query);
        const db_col_name = db_columns.rows.filter((row) => {
          return field.title
            .toLocaleLowerCase()
            .includes(row.column_name.toLocaleLowerCase());
        })[0].column_name;
        if (!db_col_name) values = undefined;
        field.title = db_col_name;
      }
      console.log(`UPDATE "${table_name}"
      set "${field.title}" = nv."${field.title}"
      from(
          values ${values}
      ) as nv (id, "${field.title}")
      where "${table_name}".id = nv.id;`);
      values &&
        (await postgres.client.query(`
      UPDATE "${table_name}"
      set "${field.title}" = nv."${field.title}"
      from(
          values ${values}
      ) as nv (id, "${field.title}")
      where "${table_name}".id = nv.id;
      `));
      console.log(field.title, " done");
    };

    for (let item of chunkedArray) {
      const responses = item.map((field) => getDataByColumn(field));
      await Promise.all(responses);
    }

    console.log("all updated");
  } catch (error) {
    console.log(error);
  }
};

const sql_contacts = async (isDire = false) => {
  try {
    await check_new_columns(
      isDire ? tables.DIRE_AC_CONTACTS : tables.IC_AC_CONTACTS
    );
    // await update_custom_fields_contacts(isDire);
    return validateArray(
      isDire ? await dire_listAllContacts() : await ac_listAllContacts()
    );
  } catch (error) {
    console.log("❌ contacts", error);
  }
};

module.exports = { sql_contacts, update_custom_fields_contacts };
