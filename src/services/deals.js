const instance = require("./instance");

const listAllDeals = async (userCreds) => {
  const { firstName, lastName } = userCreds;
  const options = {
    url: `deals`,
    params: {
      "filters[search_field]": `${process.env.SEARCH_FIELD}%3D${firstName}%20${lastName}`,
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
    return res.data.deals.map((deal) => deal.id);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { listAllDeals };
