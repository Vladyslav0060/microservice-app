const DatabaseClient = require("./DatabaseClient");

const postgres = new DatabaseClient("postgres");
// const postgres_ac = new DatabaseClient("postgres_ac");
const { tables } = require("./tables");

module.exports = {
  postgres,
  // postgres_ac,
  tables,
};
