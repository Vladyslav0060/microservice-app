const superagent = require("superagent").agent();

const loader = async () => {
  const response = await superagent
    .get("https://investors.irontoncapital.com/admin/properties")
    .send({
      "user[email]": "it@curtisst.media",
      "user[password]": "$m4iuM#30Tqqeu000M51&",
    })
    .set("content-type", "application/x-www-form-urlencoded");
  console.log(response.statusCode);
  console.log(response.text);
  if (response.statusCode === 302) {
    console.log(response.headers.location);
  }
};

module.exports = loader;
