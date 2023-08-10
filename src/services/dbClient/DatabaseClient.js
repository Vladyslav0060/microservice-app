const { Sequelize } = require("sequelize");

class DatabaseClient {
  constructor(database) {
    this.client = new Sequelize(
      database,
      process.env.IC_UC_USER,
      process.env.IC_UC_PASSWORD,
      {
        host: process.env.IC_UC_HOST,
        dialect: "postgres",
        logging: () => (process.env.NODE_ENV === "production" ? false : true),
        dialectOptions: {
          ssl: true,
        },
      }
    );
    try {
      this.client.authenticate().then(() => console.log(`DB ${database} ✅`));
    } catch (error) {
      throw new Error(`Unable to connect to the database ${database}:`, error);
    }
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
        WHERE TABLE_NAME = N'${tableName}' ORDER BY
        ordinal_position`
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
      throw new Error("getTableColumns ❌", error);
    }
  };

  addDuplicate(arr) {
    const duplicates = {};
    for (let i = 0; i < arr.length; i++) {
      if (duplicates[arr[i]]) {
        arr[i] += "_1";
        duplicates[arr[i]] = true;
      } else {
        duplicates[arr[i]] = true;
      }
    }
    return arr;
  }

  insertByColumns = async (name, values, columns) => {
    try {
      let modifiedColumns = this.addDuplicate(columns);
      modifiedColumns = modifiedColumns
        .map((column) => `"${column}"`)
        .join(",");
      await this.client.query(
        `INSERT INTO ${name} (${modifiedColumns}) VALUES ${values.slice(1)}`
      );
    } catch (error) {
      throw new Error("insertByColumns ❌", error);
    }
  };

  truncate = async (name) => {
    try {
      await this.client.query(`TRUNCATE TABLE ${name}`);
    } catch (error) {
      throw new Error("truncate ❌", error);
    }
  };

  insert = async (name, values) => {
    try {
      if (values)
        await this.client.query(`INSERT INTO ${name} VALUES ${values}`);
    } catch (error) {
      throw new Error("insert ❌", error);
    }
  };
}

module.exports = DatabaseClient;
