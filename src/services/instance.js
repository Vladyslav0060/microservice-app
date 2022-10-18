const axios = require("axios").default;

const instance = axios.create({
  headers: { "Api-Token": process.env.API_TOKEN },
  baseURL: process.env.AC_BASE_URL,
});

const instanceDev = axios.create({
  headers: { "Api-Token": process.env.API_TOKEN_DEV },
  baseURL: process.env.AC_BASE_URL_DEV,
});

module.exports = { instance, instanceDev };
