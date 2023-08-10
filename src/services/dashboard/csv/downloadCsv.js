const axios = require("axios");
const Papa = require("papaparse");

const downloadCsv = async (url) => {
  const response = await axios
    .get(url, { responseType: "blob" })
    .then((response) => {
      return Papa.parse(response.data, { skipEmptyLines: true }).data.map(
        (item) => `('${item.map((el) => el.replace(/'/g, "''")).join("','")}')`
      );
    });
  return response;
};

module.exports = downloadCsv;
