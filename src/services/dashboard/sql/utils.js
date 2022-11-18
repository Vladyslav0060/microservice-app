const fillOptionalProps = (object, propertiesToCheck) => {
  propertiesToCheck.forEach((property) => {
    if (!object.hasOwnProperty(property)) object[property] = "";
  });
};

const validateArray = (array, propertiesToCheck = "") => {
  return array
    .map((item) => {
      const { links, ...rest } = item;
      !!propertiesToCheck && fillOptionalProps(rest, propertiesToCheck);

      const result = Object.values(rest).map((field) => {
        return Array.isArray(field)
          ? `'${JSON.stringify(field)}'`
          : !field
          ? `'${JSON.stringify(field).replace(/'/g, "''")}'`.replace(/"/g, "")
          : `'${JSON.stringify(field)
              .replace(/\'/g, "''")
              .replace(/'/g, "''")
              .replace(/"/g, "")}'`;
      });
      return `(${result})`;
    })
    .join(",");
};

module.exports = { validateArray };
