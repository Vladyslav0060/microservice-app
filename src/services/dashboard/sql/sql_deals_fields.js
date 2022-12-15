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
    // response = response.slice(0, -2);
    // return response
    //   .split("'),")
    //   .filter(Boolean)
    //   .map((item) => {
    //     // item = item.replace(",(", "").replace("(", "").split(",");
    //     item = item.substring(1).split(",");
    //     console.log(item);
    //     // console.log(`(${item})`);
    //     item[1] = `'${item[1].slice(1, -1).substring(0, 63)}'`;
    //     // item[item.length - 1] = item[item.length - 1] + "'";
    //     return `(${item}')`;
    //   })
    //   .join(",");
  } catch (error) {
    console.log("❌ sql_deals_fields", error);
  }
};

module.exports = sql_deals_fields;
