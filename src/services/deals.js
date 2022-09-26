const instance = require("./instance");
require("dotenv").config();

const listAllDeals = async (userCreds) => {
  const { firstName, lastName } = userCreds;
  const options = {
    url: `deals`,
    params: {
      "filters[search_field]": `${process.env.SEARCH_FIELD}${encodeURIComponent(
        "="
      )}${firstName}${encodeURIComponent(" ")}${lastName}`,
      "orders[title]": "ASC",
      "orders[value]": "ASC",
      "orders[cdate]": "ASC",
      "orders[contact_name]": "ASC",
      "orders[contact_orgname]": "ASC",
      "orders[next-action]": "ASC",
    },
  };
  try {
    const res = await instance.get(options.url, { params: options.params });
    if (!res.data?.deals) throw new Error("No deals were found");
    return res.data.deals.map((deal) => deal.id);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { listAllDeals };
