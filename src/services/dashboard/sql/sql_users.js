const { ac_listAllUsers, dire_listAllUsers } = require("../../axios");
const { validateArray } = require("./utils");

const sql_users = async (isDire = false) => {
  try {
    return validateArray(
      isDire ? await dire_listAllUsers() : await ac_listAllUsers()
    );
  } catch (error) {
    console.log("❌ sql_users", error);
  }
};

module.exports = sql_users;
