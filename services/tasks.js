const axios = require("axios");
require("dotenv").config();
const listAllTasks = async (foundIds) => {
    return await Promise.all(
        foundIds.map(async (id) => {
            const options = {
                method: "GET",
                url: `https://curtisstreetmedia1651721711.api-us1.com/api/3/dealTasks?filters[reltype]=Deal&filters[relid]=${id}`,
            };
            const response = await axios.request(options);
            return response.data.dealTasks.map((dealTask) => {
                return dealTask.id;
            });
        })
    )
        .then((result) => {
            result = result.filter((value) => !!value.length);
            return [].concat(...result);
        })
        .catch((e) => {
            throw new Error(e);
        });
};

const closeTasks = async (taskIds) => {
    return await Promise.all(
        taskIds.map(async (taskId) => {
            const options = {
                method: "PUT",
                url: `https://curtisstreetmedia1651721711.api-us1.com/api/3/dealTasks/${taskId}`,
                data: { dealTask: { status: 1 } },
            };
            await axios.request(options);
        })
    )
    .catch((e) => {
        throw new Error(e);
    });
};

module.exports = { listAllTasks, closeTasks };
