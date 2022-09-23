const express = require("express");
const app = express();
const axios = require("axios").default;
const { deals, contacts, tasks } = require("./services");
require("dotenv").config();

process.on("uncaughtException", () => {});
axios.defaults.headers.common["Api-Token"] = process.env.API_TOKEN;

app.get("/", async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) res.status(401).send("Email address required");
        const userCreds = await contacts.listAllContacts(email);
        const foundDeals = await deals.listAllDeals(userCreds);
        const taskIds = await tasks.listAllTasks(foundDeals);
        if (taskIds.length) await tasks.closeTasks(taskIds);
        return res.sendStatus(200);
    } catch (error) {
        res.send(404).send(error);
    }
});

app.listen(3000, () => console.log("works on 3000"));
