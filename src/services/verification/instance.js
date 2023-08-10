const axios = require("axios").default;

const ac_axios = axios.create({
  headers: { "Api-Token": process.env.API_TOKEN },
  baseURL: process.env.AC_BASE_URL,
});

const ac_axios_dev = axios.create({
  headers: { "Api-Token": process.env.API_TOKEN_DEV },
  baseURL: process.env.AC_BASE_URL_DEV,
});

module.exports = { ac_axios, ac_axios_dev };
