const axios = require("axios");

const ac_axios = axios.create({
  headers: { "Api-Token": process.env.API_TOKEN },
  baseURL: process.env.AC_BASE_URL,
});

const ac_axios_dev = axios.create({
  headers: { "Api-Token": process.env.API_TOKEN_DEV },
  baseURL: process.env.AC_BASE_URL_DEV,
});

const dire_axios = axios.create({
  headers: { "Api-Token": process.env.DIRE_API_TOKEN },
  baseURL: process.env.DIRE_BASE_URL,
});

const ac_listAllContacts = async () => await ac_axios.get("contacts");

const dire_listAllContacts = async () => await dire_axios.get("contacts");

const ac_listAllDeals = async () => await ac_axios.get("deals");

const ac_listAllTasks = async () => await ac_axios.get("dealTasks");

const ac_listAllPipelines = async () => await ac_axios.get("dealGroups");

const ac_listAllStages = async () => await ac_axios.get("dealStages");

module.exports = {
  ac_axios,
  ac_axios_dev,
  ac_listAllContacts,
  dire_listAllContacts,
  ac_listAllDeals,
  ac_listAllTasks,
  ac_listAllPipelines,
  ac_listAllStages,
};
