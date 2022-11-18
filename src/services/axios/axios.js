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

const getData = async (name, params = {}) => {
  const limit = 100;
  let offset = 0;
  let isLoaded = false;
  let resultArr = [];
  while (!isLoaded) {
    const response = await ac_axios.get(name, {
      params: { limit: limit, offset: offset, ...params },
    });
    resultArr = resultArr.concat(response.data[name]);
    offset += limit;
    if (response.data.meta.total < offset) isLoaded = true;
  }
  return resultArr;
};

const ac_listAllCustomFieldsContacts = async () => await getData("fields");

const ac_listAllContacts = async () => await getData("contacts");

const dire_listAllContacts = async () => await dire_axios.get("contacts");

const ac_listAllDeals = async () => await getData("deals");

const ac_listAllTasks = async () => await getData("dealTasks");

const ac_listAllPipelines = async () => await getData("dealGroups");

const ac_listAllStages = async () => await getData("dealStages");

const retreiveContactData = async (id) =>
  await ac_axios.get(`contacts/${id}/fieldValues`);

module.exports = {
  ac_axios,
  ac_axios_dev,
  ac_listAllCustomFieldsContacts,
  ac_listAllContacts,
  dire_listAllContacts,
  ac_listAllDeals,
  ac_listAllTasks,
  ac_listAllPipelines,
  ac_listAllStages,
  retreiveContactData,
  getData,
};
