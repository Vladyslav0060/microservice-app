const axios = require("axios");

const ac_axios = axios.create({
  headers: { "Api-Token": process.env.API_TOKEN },
  baseURL: process.env.AC_BASE_URL,
});

const ac_axios_dev = axios.create({
  headers: { "Api-Token": process.env.API_TOKEN_DEV },
  baseURL: process.env.AC_BASE_URL_DEV,
});

const ac_listAllContacts = async (dev = false) => {
  const fetch = dev ? ac_axios_dev : ac_axios;
  return await fetch.get("contacts");
};

module.exports = { ac_axios, ac_axios_dev, ac_listAllContacts };
