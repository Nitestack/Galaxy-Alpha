"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("@root/index"));
const level_1 = __importDefault(require("@models/level"));
const profile_1 = __importDefault(require("@models/profile"));
const router = express_1.default.Router();
router.get("/", (req, res) => res.render("index", {
    subTitle: "A multipurpose bot",
    client: index_1.default
}));
router.get("/commands", (req, res) => res.render("commands", {
    subTitle: "Commands",
    client: index_1.default,
    categories: index_1.default.categories.filter((value, key) => key != "developer" && key != "private").sort((a, b) => {
        if (a[0].category < b[0].category)
            return -1;
        if (a[0].category > b[0].category)
            return 1;
        return 0;
    }).keyArray(),
    commands: index_1.default.commands.filter(command => command.category != "developer" && command.category != "private").array(),
    commandsString: JSON.stringify(index_1.default.commands.filter(command => command.category != "developer" && command.category != "private").array())
}));
router.get("/supportserver", (req, res) => res.redirect("https://discord.gg/qvbFn6bXQX"));
router.get("/stats", (req, res) => res.render("stats", {
    subTitle: "Stats",
    client: index_1.default,
    userGoal: 50,
    channelGoal: 50,
}));
router.get('/leaderboards/levels/:id', async (req, res) => {
    const guild = index_1.default.guilds.cache.get(req.params.id);
    if (!guild)
        return res.render('Errors/404', {
            client: index_1.default
        });
    let messages = await level_1.default.find({ guildID: req.params.id }).limit(100);
    if (messages)
        for (const user of messages) {
            if (!index_1.default.cache.levels.has(user.userID))
                index_1.default.cache.levels.set(`${user.userID}-${req.params.id}`, {
                    userID: user.userID,
                    guildID: req.params.id,
                    level: user.level,
                    xp: user.xp,
                    messages: user.messages,
                    lastUpdated: user.lastUpdated
                });
        }
    ;
    const savedUsers = index_1.default.cache.levels.filter(level => level.guildID == guild.id && level.messages > 0).sort((a, b) => b.xp - a.xp).array().slice(0, 100);
    res.render('Dashboard/leaderboard', {
        client: index_1.default,
        leaderboardCategory: "level",
        guild: guild,
        savedUsers: savedUsers
    });
});
router.get('/leaderboards/currency/:id', async (req, res) => {
    const guild = index_1.default.guilds.cache.get(req.params.id);
    if (!guild)
        return res.render('Errors/404', {
            client: index_1.default
        });
    const currencies = await profile_1.default.find({});
    if (currencies)
        for (const user of currencies) {
            if (!index_1.default.cache.currency.has(user.userID) && guild.members.cache.has(user.userID))
                index_1.default.cache.currency.set(user.userID, {
                    userID: user.userID,
                    bank: user.bank,
                    wallet: user.wallet,
                    profileCreatedAt: user.profileCreatedAt,
                    items: user.items,
                    passive: user.passive,
                    messageCount: user.messageCount
                });
        }
    ;
    const savedUsers = index_1.default.cache.currency.filter(currency => guild.members.cache.has(currency.userID) && (currency.bank > 0 || currency.wallet > 0)).sort((a, b) => (b.wallet + b.bank) - (a.wallet + a.bank)).array().slice(0, 100);
    res.render('Dashboard/leaderboard', {
        client: index_1.default,
        leaderboardCategory: "currency",
        guild: guild,
        savedUsers: savedUsers
    });
});
router.get("/premium", (req, res) => res.render("premium", {
    client: index_1.default,
    subTitle: "Premium"
}));
exports.default = router;
//# sourceMappingURL=root.js.map