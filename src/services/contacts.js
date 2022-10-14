const instance = require("./instance");

const listAllContacts = async (email) => {
  email = email.replace(/@/g, "%");
  const options = {
    url: `contacts`,
    params: { email: email, status: "-1" },
  };
  try {
    const res = await instance.get(options.url, { params: options.params });
    if (!res.data?.contacts[0]) return false;
    const { id } = res.data.contacts[0];
    if (!id) throw new Error("User wasn't found");
    return id;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { listAllContacts };
