const {
  ac_listAllCustomFieldsDeals,
  dire_listAllCustomFieldsDeals,
} = require("../../axios");
const { validateArray } = require("./utils");

const sql_deals_fields = async (isDire = false) => {
  try {
    return validateArray(
      isDire
        ? await dire_listAllCustomFieldsDeals()
        : await ac_listAllCustomFieldsDeals(),
      "",
      true
    );
  } catch (error) {
    throw new Error("❌ sql_deals_fields", error);
  }
};

module.exports = sql_deals_fields;
