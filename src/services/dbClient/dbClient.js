const { Pool } = require("pg");

class DatabaseClient {
  constructor() {
    this.client = new Pool({
      host: "52.90.35.229",
      port: 5432,
      user: "postgres",
      password: "Denver1234",
    });
    this.client.connect((err) => console.log(err ? "DB ❌" : "DB ✅"));
  }

  getTableColumns = async (tableName = "ic_csv", quoted = true) => {
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
}

module.exports = new DatabaseClient();
