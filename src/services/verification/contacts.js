const { ac_axios, ac_axios_dev } = require("./instance");

const listAllContacts = async (email, dev) => {
  email = email.replace(/@/g, "%");
  const options = {
    url: "contacts",
    params: { email: email, status: "-1" },
  };
  try {
    const http = dev ? ac_axios_dev : ac_axios;
    const res = await http.get(options.url, { params: options.params });
    if (!res.data?.contacts[0]) return false;
    const { id } = res.data.contacts[0];
    if (!id) throw new Error("User wasn't found");
    return id;
  } catch (error) {
    throw new Error("❌ listAllContacts ", error);
  }
};

module.exports = { listAllContacts };
