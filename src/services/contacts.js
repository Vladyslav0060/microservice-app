const instance = require("./instance");
require("dotenv").config();

const listAllContacts = async (email) => {
  email = email.replace(/@/g, "%");
  const options = {
    url: `contacts`,
    params: { email: email, status: "-1", "orders[email]": "ASC" },
  };
  try {
    const res = await instance.get(options.url, { params: options.params });
    if (!res.data?.contacts[0]) return false;
    const { firstName, lastName } = res.data.contacts[0];
    if (!firstName || !lastName) throw new Error("User wasn't found");
    return { firstName, lastName };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { listAllContacts };
