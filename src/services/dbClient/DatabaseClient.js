const { Pool } = require("pg");

class DatabaseClient {
  constructor(database) {
    this.client = new Pool({
      host: process.env.IC_UC_HOST,
      port: process.env.IC_UC_PORT,
      user: process.env.IC_UC_USER,
      password: process.env.IC_UC_PASSWORD,
      database: database,
    });
    this.client.connect((err) =>
      console.log(err ? `DB ${database} ❌` : `DB ${database} ✅`)
    );
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

  insertByColumns = async (name, values) => {
    try {
      const columns = await this.getTableColumns(name);
      await this.client.query(
        `INSERT INTO ${name} (${columns}) VALUES ${values}`
      );
    } catch (error) {
      console.log("insertByColumns ❌", error);
    }
  };

  truncate = async (name) => {
    try {
      await this.client.query(`TRUNCATE TABLE ${name}`);
    } catch (error) {
      console.log("truncate ❌", error);
    }
  };

  insert = async (name, values) => {
    try {
      await this.client.query(`INSERT INTO ${name} VALUES ${values}`);
    } catch (error) {
      console.log("insert ❌", error);
    }
  };
}

module.exports = DatabaseClient;
