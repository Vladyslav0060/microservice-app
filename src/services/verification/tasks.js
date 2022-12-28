const { ac_axios, ac_axios_dev } = require("./instance");

const listAllTasks = async (foundIds, dev) => {
  const http = dev ? ac_axios_dev : ac_axios;
  return await Promise.all(
    foundIds.map(async (id) => {
      const options = {
        url: `dealTasks`,
        params: {
          "filters[reltype]": "Deal",
          "filters[relid]": id,
          "filters[d_tasktypeid]": dev
            ? process.env.SEARCH_FIELD_DEV
            : process.env.SEARCH_FIELD,
          "filters[status]": "0",
        },
      };
      const response = await http.get(options.url, {
        params: options.params,
      });
      return response.data.dealTasks.map((dealTask) => {
        return dealTask.id;
      });
    })
  )
    .then((result) => {
      result = result?.filter((value) => !!value?.length);
      return [].concat(...result);
    })
    .catch((error) => {
      throw new Error("listAllTasks ❌", error);
    });
};

const closeTasks = async (taskIds, dev) => {
  const http = dev ? ac_axios_dev : ac_axios;
  return await Promise.all(
    taskIds.map(async (taskId) => {
      const options = {
        method: "PUT",
        url: `dealTasks/${taskId}`,
        data: { dealTask: { status: 1 } },
      };
      await http.request(options);
    })
  ).catch((error) => {
    throw new Error("closeTasks ❌", error);
  });
};

module.exports = { listAllTasks, closeTasks };
