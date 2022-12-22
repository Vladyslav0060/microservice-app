const { ac_axios, ac_axios_dev } = require("./instance");

const listAllDeals = async (userId, dev) => {
  const options = {
    url: `contacts/${userId}/deals`,
  };
  try {
    const http = dev ? ac_axios_dev : ac_axios;
    const res = await http.get(options.url);
    if (!res.data?.deals) throw new Error("No deals were found");
    return res.data.deals.map((deal) => deal.id);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { listAllDeals };
