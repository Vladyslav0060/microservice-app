const fs = require("fs");
const Path = require("path");
const axios = require("axios");

const downloadCsv = async (url) => {
  const fileBinary = [];
  const path = Path.resolve(__dirname, "files", "test.csv");

  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  });

  response.data.pipe(fs.createWriteStream(path));

  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      //   console.log(Buffer.concat(fileBinary));
      resolve();
    });

    response.data.on("data", (data) => {
      fileBinary.push(data);
    });

    response.data.on("error", (err) => reject(err));
  });
};

module.exports = downloadCsv;
