const axios = require("axios").default;

const instance = axios.create({
  headers: { "Api-Token": process.env.API_TOKEN },
  baseURL: process.env.AC_BASE_URL,
});

module.exports = instance;
