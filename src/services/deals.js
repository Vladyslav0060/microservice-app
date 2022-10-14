const instance = require("./instance");

const listAllDeals = async (userId) => {
  const options = {
    url: `contacts/${userId}/deals`,
  };
  try {
    const res = await instance.get(options.url);
    if (!res.data?.deals) throw new Error("No deals were found");
    return res.data.deals.map((deal) => deal.id);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { listAllDeals };
