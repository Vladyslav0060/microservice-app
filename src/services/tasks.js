const instance = require("./instance");

const listAllTasks = async (foundIds) => {
  return await Promise.all(
    foundIds.map(async (id) => {
      const options = {
        url: `dealTasks`,
        params: {
          "filters[reltype]": "Deal",
          "filters[relid]": id,
          "filters[d_tasktypeid]": "5",
          "filters[status]": "0",
        },
      };
      const response = await instance.get(options.url, {
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
    .catch((e) => {
      throw new Error(e);
    });
};

const closeTasks = async (taskIds) => {
  return await Promise.all(
    taskIds.map(async (taskId) => {
      const options = {
        method: "PUT",
        url: `dealTasks/${taskId}`,
        data: { dealTask: { status: 1 } },
      };
      await instance.request(options);
    })
  ).catch((e) => {
    throw new Error(e);
  });
};

module.exports = { listAllTasks, closeTasks };
