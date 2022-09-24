const instance = require("./instance");

const listAllContacts = async (email) => {
  email = email.replace(/@/g, "%");
  const options = {
    url: `contacts`,
    params: { email: email, status: "-1", "orders[email]": "ASC" },
  };
  try {
    const res = await instance.get(options.url, { params: options.params });
    const { firstName, lastName } = res.data.contacts[0];
    if (!firstName || !lastName) throw new Error("User wasn't found");
    return { firstName, lastName };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { listAllContacts };
