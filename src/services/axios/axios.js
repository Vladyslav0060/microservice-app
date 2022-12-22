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

const getData = async (name, isDire = false, params = {}) => {
  let limit = params?.limit || 100;
  console.log(name);
  let offset = 0;
  let isLoaded = false;
  let resultArr = [];
  const axios = isDire ? dire_axios : ac_axios;
  let iteration = 0;
  console.log("getData init");
  while (!isLoaded) {
    iteration++;
    let response = await axios.get(name, {
      params: { limit: limit, offset: offset, ...params },
    });
    if (name === "deals") {
      response.data[name] = response.data[name].map((item) => {
        if (item.value) {
          item.value = Number(item.value / 100)
            .toFixed(2)
            .toString();
        }
        return item;
      });
    }
    resultArr = resultArr.concat(response.data[name]);
    offset += limit;
    if (response.data.meta.total < offset) isLoaded = true;
  }
  console.log("\nfetched\n", resultArr.length);
  return resultArr;
};

const ac_listAllCustomFieldsContacts = async () => await getData("fields");

const ac_listAllCustomFieldsDeals = async () =>
  await getData("dealCustomFieldMeta");

const ac_listAllContacts = async () => await getData("contacts");

const ac_listAllUsers = async () => await getData("users");

const ac_listAllDeals = async () => await getData("deals");

const ac_listAllTasks = async () => await getData("dealTasks");

const ac_listAllTaskTypes = async () => await getData("dealTasktypes");

const ac_listAllPipelines = async () => await getData("dealGroups");

const ac_listAllStages = async () => await getData("dealStages");

const dire_listAllContacts = async () => await getData("contacts", true);

const dire_listAllCustomFieldsDeals = async () =>
  await getData("dealCustomFieldMeta", true);

const dire_listAllUsers = async () => await getData("users", true);

const dire_listAllDeals = async () => await getData("deals", true);

const dire_listAllPipelines = async () => await getData("dealGroups", true);

const dire_listAllCustomFieldsContacts = async () => getData("fields", true);

const dire_listAllStages = async () => await getData("dealStages", true);

const dire_listAllTaskTypes = async () => await getData("dealTasktypes", true);

const dire_listAllTasks = async () => await getData("dealTasks", true);

module.exports = {
  ac_axios,
  dire_axios,
  ac_axios_dev,
  ac_listAllCustomFieldsContacts,
  ac_listAllCustomFieldsDeals,
  ac_listAllContacts,
  ac_listAllUsers,
  dire_listAllContacts,
  dire_listAllCustomFieldsDeals,
  dire_listAllDeals,
  dire_listAllUsers,
  dire_listAllPipelines,
  dire_listAllCustomFieldsContacts,
  dire_listAllStages,
  dire_listAllTaskTypes,
  dire_listAllTasks,
  ac_listAllDeals,
  ac_listAllTasks,
  ac_listAllTaskTypes,
  ac_listAllPipelines,
  ac_listAllStages,
  getData,
};
