const { instance, instanceDev } = require("./instance");

const listAllDeals = async (userId, dev) => {
  const options = {
    url: `contacts/${userId}/deals`,
  };
  try {
    const http = dev ? instanceDev : instance;
    const res = await http.get(options.url);
    if (!res.data?.deals) throw new Error("No deals were found");
    return res.data.deals.map((deal) => deal.id);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { listAllDeals };
