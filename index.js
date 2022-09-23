const express = require("express");
const app = express();
const axios = require("axios").default;
require("dotenv").config();

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  const options = {
    method: "GET",
    url: "https://curtisstreetmedia1651721711.api-us1.com/api/3/contacts?status=-1&orders[email]=ASC",
    headers: {
      accept: "application/json",
      "Api-Token": process.env.API_TOKEN,
    },
  };
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
  res.send("hello world");
});

app.listen(3000, () => console.log("works on 3000"));
