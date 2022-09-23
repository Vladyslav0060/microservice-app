const axios = require("axios");
require("dotenv").config();
const listAllContacts = async (email) => {
    email = email.replace(/@/g, "%");
    const options = {
        method: "GET",
        url: `https://curtisstreetmedia1651721711.api-us1.com/api/3/contacts?email=${email}&status=-1&orders[email]=ASC`,
    };
    try {
        const res = await axios.request(options);
        const { firstName, lastName } = res.data.contacts[0];
        if (!firstName || !lastName) throw new Error("User wasn't found");
        return { firstName, lastName };
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { listAllContacts };
