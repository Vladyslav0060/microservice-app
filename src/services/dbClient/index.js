const DatabaseClient = require("./DatabaseClient");

const postgres = new DatabaseClient("postgres");
const postgres_ac = new DatabaseClient("postgres_ac");

module.exports = { postgres, postgres_ac };
