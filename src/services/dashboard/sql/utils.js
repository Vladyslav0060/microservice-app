const { postgres } = require("../../dbClient");
const { get_api_function } = require("../../dbClient/utils");

const fillOptionalProps = (object, propertiesToCheck) => {
  propertiesToCheck.forEach((property) => {
    if (!object.hasOwnProperty(property)) object[property] = "";
  });
};

const validateField = (field) => {
  return Array.isArray(field)
    ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
    : !field
    ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
    : `'${JSON.stringify(field).replace(/'/g, "''").replace(/"/g, "")}'`;
};

const validateArray = (array, propertiesToCheck = "", limit = false) => {
  return array
    .map((item) => {
      const { links, ...rest } = item;
      if (limit) rest.fieldLabel = rest.fieldLabel.substring(0, 62);
      !!propertiesToCheck && fillOptionalProps(rest, propertiesToCheck);
      if (Object.values(rest).length < 6) return;

      const result = Object.values(rest).map((field) => {
        return Array.isArray(field)
          ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
          : !field
          ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
          : `'${JSON.stringify(field).replace(/'/g, "''").replace(/"/g, "")}'`;
      });
      return `(${result})`;
    })
    .filter(Boolean)
    .join(",");
};

const check_new_columns = async (tableName, columns = null) => {
  try {
    const db_response = await postgres.client
      .query(`SELECT * FROM information_schema.columns
        WHERE
        table_schema = 'public'
        AND table_name = '${tableName}';`);
    const db_columns = db_response[1].rows;
    if (columns) {
      columns.forEach((column) => {
        const found = db_columns.some((el) => {
          return (
            column
              .toLocaleLowerCase()
              .includes(el.column_name.toLocaleLowerCase()) &&
            (column.length > 64
              ? true
              : column.length - el.column_name.length < 2)
          );
        });
        if (!found) {
          postgres.client.query(
            `ALTER TABLE ${tableName} ADD COLUMN "${column.substring(
              0,
              62
            )}" varchar`
          );
        }
      });
      return;
    }
    const response = await get_api_function[tableName + "_fields"]();
    response.forEach((item) => {
      const found = db_columns.some((el) => {
        const col_name = item.fieldLabel || item.title;
        return (
          col_name
            .toLocaleLowerCase()
            .includes(el.column_name.toLocaleLowerCase()) &&
          (col_name.length > 64
            ? true
            : col_name.length - el.column_name.length < 2)
        );
      });

      if (!found) {
        postgres.client.query(
          `ALTER TABLE ${tableName} ADD COLUMN "${
            item.fieldLabel.substring(0, 62) || item.title.substring(0, 62)
          }" varchar`
        );
      }
    });
  } catch (error) {
    throw new Error("❌ check_new_columns", error);
  }
};

const sliceIntoChunks = (arr, chunkSize) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

module.exports = {
  validateArray,
  check_new_columns,
  validateField,
  sliceIntoChunks,
};
