const { Pool } = require("pg");

class DatabaseClient {
  constructor() {
    this.client = new Pool({
      host: process.env.IC_UC_HOST,
      port: process.env.IC_UC_PORT,
      user: process.env.IC_UC_USER,
      password: process.env.IC_UC_PASSWORD,
    });
    this.client.connect((err) => console.log(err ? "DB ❌" : "DB ✅"));
  }

  getTableColumns = async (
    tableName = "ic_uc_joined_report",
    quoted = true
  ) => {
    try {
      return this.client
        .query(
          `SELECT *
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = N'${tableName}'`
        )
        .then((response) => {
          return response.rows
            .map((row) => (quoted ? `"${row.column_name}"` : row.column_name))
            .filter(
              (column) => column !== '"created_at"' && column !== '"row_id"'
            )
            .join(",");
        });
    } catch (error) {
      console.log("getTableColumns ❌", error);
    }
  };

  truncateTable = async (name) => {
    try {
      await this.client.query(`TRUNCATE TABLE ${name}`);
    } catch (error) {
      console.log("truncateTable ❌", error);
    }
  };

  insertCsv = async (name, data) => {
    try {
      const columns = await this.getTableColumns(name, true);
      await this.client.query(
        `INSERT INTO ${name} (${columns}) VALUES ${data}`
      );
      return;
    } catch (error) {
      console.log("insertCsv ❌", error);
    }
  };

  insertContacts = async (name, data) => {
    try {
      await this.client.query(`INSERT INTO ${name} VALUES ${data}`);
      return;
    } catch (error) {
      console.log("insertContacts ❌", error);
    }
  };
}

module.exports = new DatabaseClient();
