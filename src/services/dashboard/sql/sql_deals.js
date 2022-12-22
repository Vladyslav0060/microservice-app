const { tables, postgres } = require("../../dbClient");
const { ac_listAllDeals, getData, dire_listAllDeals } = require("../../axios");
const { validateArray, validateField, check_new_columns } = require("./utils");

const update_custom_fields_deals = async (isDire = false) => {
  const table_name = isDire ? tables.DIRE_AC_DEALS : tables.IC_AC_DEALS;
  const fields = await getData("dealCustomFieldMeta", isDire);
  const fieldValues = await getData("dealCustomFieldData", isDire, {
    limit: 10000,
  });

  for (let field of fields) {
    const fieldId = Number(field.id);
    const values = fieldValues
      .filter(
        (fieldValue) =>
          fieldValue.customFieldId === fieldId && !!fieldValue?.fieldValue
      )
      .map((item) => {
        const { dealId, fieldValue } = item;
        return `(${validateField(dealId)}, ${validateField(fieldValue)})`;
      })
      .join(",");

    if (!values?.length) continue;

    if (field.fieldLabel.length > 62) {
      const query = `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table_name}';`;
      const db_columns = await postgres.client.query(query);
      const db_col_name = db_columns.rows.filter((row) => {
        return field.fieldLabel
          .toLocaleLowerCase()
          .includes(row.column_name.toLocaleLowerCase());
      })[0].column_name;
      if (!db_col_name) values = undefined;
      field.fieldLabel = db_col_name;
    }

    !!values &&
      (await postgres.client.query(`
    UPDATE "${table_name}"
    set "${field.fieldLabel}" = nv."${field.fieldLabel}"
    from(
        values ${values}
    ) as nv (id, "${field.fieldLabel}")
    where "${table_name}".id = nv.id;
    `));
  }
};

const sql_deals = async (isDire = false) => {
  try {
    await check_new_columns(isDire ? tables.DIRE_AC_DEALS : tables.IC_AC_DEALS);
    return validateArray(
      isDire ? await dire_listAllDeals() : await ac_listAllDeals(),
      ["nextTask"]
    );
  } catch (error) {
    console.log("❌ sql_deals", error);
  }
};

module.exports = { sql_deals, update_custom_fields_deals };
