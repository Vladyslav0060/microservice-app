// const { Pool, Client } = require("pg");
const { Sequelize } = require("sequelize");

class DatabaseClient {
  constructor(database) {
    console.log("new db client", database);
    this.client = new Sequelize(
      database,
      process.env.IC_UC_USER,
      process.env.IC_UC_PASSWORD,
      {
        host: process.env.IC_UC_HOST,
        dialect: "postgres",
        dialectOptions: {
          ssl: true,
        },
      }
    );
    try {
      this.client
        .authenticate()
        .then(() =>
          console.log(
            `Connection to ${database} has been established successfully.`
          )
        );
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    // this.client = new Pool({
    //   host: process.env.IC_UC_HOST,
    //   port: process.env.IC_UC_PORT,
    //   user: process.env.IC_UC_USER,
    //   password: process.env.IC_UC_PASSWORD,
    //   database: database,
    //   ssl: true,
    //   min: 0,
    //   max: 10,
    //   createTimeoutMillis: 8000,
    //   acquireTimeoutMillis: 8000,
    //   idleTimeoutMillis: 20000,
    //   reapIntervalMillis: 1000,
    //   createRetryIntervalMillis: 100,
    // });
    // this.client.connect((err) =>
    //   console.log(err ? `DB ${database} ${err} ❌` : `DB ${database} ✅`)
    // );
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
      console.log("getTableColumns ❌", error);
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
