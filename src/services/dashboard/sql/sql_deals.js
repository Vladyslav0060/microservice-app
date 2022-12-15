const { tables, postgres } = require("../../dbClient");
const { ac_listAllDeals, getData, dire_listAllDeals } = require("../../axios");
const { validateArray, check_new_columns } = require("./utils");
const _ = require("lodash");

const update_custom_fields_deals = async (isDire = false) => {
  const result = {};
  const fields = await getData("dealCustomFieldMeta", isDire);
  const fieldValues = await getData("dealCustomFieldData", isDire, {
    limit: 10000,
  });

  const fieldsById = _.keyBy(fields, "id");
  for (const currentField of fieldValues) {
    //field by id | currentField.field = field_id
    const fieldName = _.get(
      fieldsById,
      [currentField.customFieldId, "fieldLabel"],
      null
    );
    if (!fieldName) continue; // move to next iteration
    _.set(result, [currentField.dealId, fieldName], currentField.fieldValue);
  }

  // for (const [deal_id, data] of Object.entries(result)) {
  //   console.log({ deal_id });
  //   const values = Object.entries(data).map((entry) => {
  //     console.log("Entry0 ", entry[0]);
  //     console.log("Entry1 ", entry[1]);
  //   });
  //   // `"${entry[0]}"='${entry[1].replace(/'/g, "''")}'`})
  // }

  for (const [deal_id, data] of Object.entries(result)) {
    const values = Object.entries(data)
      .map(
        (entry) =>
          `"${entry[0]}"='${JSON.stringify(entry[1]).replace(/'/g, "''")}'`
      )
      .join(",");
    await postgres.client.query(
      `UPDATE ${
        isDire ? tables.DIRE_AC_DEALS : tables.IC_AC_DEALS
      } SET ${values} where "id"='${deal_id}'`
    );
  }
};

const sql_deals = async (isDire = false) => {
  try {
    await check_new_columns(isDire ? tables.DIRE_AC_DEALS : tables.IC_AC_DEALS);
    // await update_custom_fields_deals(isDire);
    return validateArray(
      isDire ? await dire_listAllDeals() : await ac_listAllDeals(),
      ["nextTask"]
    );
  } catch (error) {
    console.log("❌ sql_deals", error);
  }
};

module.exports = { sql_deals, update_custom_fields_deals };
