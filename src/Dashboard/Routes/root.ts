import express from 'express';
import client from "@root/index";
import { subTitle } from "@dashboard/server";
const router = express.Router();
router.get("/", (req, res) => res.render("index", {
    subTitle: subTitle,
    client: client
}));
router.get("/commands", (req, res) => res.render("commands", {
    subTitle: "Commands",
    client: client,
    categories: client.categories.filter((value, key) => key != "developer" && key != "private").sort((a, b) => {
        if (a[0].category < b[0].category) return -1;
        if (a[0].category > b[0].category) return 1;
        return 0;
    }).keyArray(),
    commands: client.commands.filter(command => command.category != "developer" && command.category != "private").array(),
    commandsString: JSON.stringify(client.commands.filter(command => command.category != "developer" && command.category != "private").array())
}));
router.get("/supportserver", (req, res) => res.redirect("https://discord.gg/qvbFn6bXQX"));
router.get("/stats", (req, res) => res.render("stats", {
    subTitle: "Stats",
    client: client,
    userGoal: 50,
    channelGoal: 50,
}));
export default router;