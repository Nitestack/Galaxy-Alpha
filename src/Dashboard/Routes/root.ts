import express from 'express';
import client from "@root/index";
import LevelSchema, { Level } from "@models/level";
import ProfileSchema from "@models/profile";
const router = express.Router();
router.get("/", (req, res) => res.render("index", {
    subTitle: "A multipurpose bot",
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
router.get('/leaderboards/levels/:id', async (req, res) => {
    const guild = client.guilds.cache.get(req.params.id);
    if (!guild) return res.render('Errors/404', {
        client: client
    });
    let messages: Array<Level> = await LevelSchema.find({ guildID: req.params.id }).limit(100);
    if (messages) for (const user of messages) {
        if (!client.cache.levels.has(user.userID)) client.cache.levels.set(`${user.userID}-${req.params.id}`, {
            userID: user.userID,
            guildID: req.params.id,
            level: user.level,
            xp: user.xp,
            messages: user.messages,
            lastUpdated: user.lastUpdated
        });
    };
    const savedUsers = client.cache.levels.filter(level => level.guildID == guild.id && level.messages > 0).sort((a, b) => b.xp - a.xp).array().slice(0, 100);
    res.render('Dashboard/leaderboard', {
        client: client,
        leaderboardCategory: "level",
        guild: guild,
        savedUsers: savedUsers
    });
});
router.get('/leaderboards/currency/:id', async (req, res) => {
    const guild = client.guilds.cache.get(req.params.id);
    if (!guild) return res.render('Errors/404', {
        client: client
    });
    const currencies = await ProfileSchema.find({});
    if (currencies) for (const user of currencies) {
        if (!client.cache.currency.has(user.userID) && guild.members.cache.has(user.userID)) client.cache.currency.set(user.userID, {
            userID: user.userID,
            bank: user.bank,
            wallet: user.wallet,
            profileCreatedAt: user.profileCreatedAt,
            items: user.items,
            passive: user.passive,
            messageCount: user.messageCount
        });
    };
    const savedUsers = client.cache.currency.filter(currency => guild.members.cache.has(currency.userID) && (currency.bank > 0 || currency.wallet > 0)).sort((a, b) => (b.wallet + b.bank) - (a.wallet + a.bank)).array().slice(0, 100);
    res.render('Dashboard/leaderboard', {
        client: client,
        leaderboardCategory: "currency",
        guild: guild,
        savedUsers: savedUsers
    });
});
router.get("/premium", (req, res) => res.render("premium", {
    client: client,
    subTitle: "Premium"
}));
export default router;