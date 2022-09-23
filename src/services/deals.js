const axios = require("axios");
const listAllDeals = async (userCreds) => {
    const { firstName, lastName } = userCreds;
    const options = {
        method: "GET",
        url: `https://curtisstreetmedia1651721711.api-us1.com/api/3/deals?filters[search_field]=contact%3D${firstName}%20${lastName}&orders[title]=ASC&orders[value]=ASC&orders[cdate]=ASC&orders[contact_name]=ASC&orders[contact_orgname]=ASC&orders[next-action]=ASC`,
    };
    try {
        const res = await axios.request(options);
        return res.data.deals.map((deal) => deal.id);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { listAllDeals };
