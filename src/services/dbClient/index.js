const DatabaseClient = require("./DatabaseClient");

const postgres = new DatabaseClient("postgres");
const postgres_ac = new DatabaseClient("postgres_ac");
const { tables, get_api_function } = require("./tables");

module.exports = { postgres, postgres_ac, tables, get_api_function };
