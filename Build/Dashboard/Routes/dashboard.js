"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("@modules/middleware");
const index_1 = __importDefault(require("@root/index"));
const router = express_1.default.Router();
router.get('/dashboard', (req, res) => res.render('Dashboard/index', {
    subTitle: "Dashboard",
    client: index_1.default
}));
router.get('/servers/:id', middleware_1.validateGuild, async (req, res) => {
    if (index_1.default.guilds.cache.has(req.params.id))
        res.render('Dashboard/show', {
            savedGuild: await index_1.default.cache.getGuild(req.params.id),
            users: index_1.default.users.cache,
            player: res.locals.player,
            client: index_1.default,
            subTitle: index_1.default.guilds.cache.get(req.params.id).name,
            key: req.cookies.key
        });
    else
        res.render("Dashboard/invite", {
            client: index_1.default
        });
});
router.put('/servers/:id/:module', middleware_1.validateGuild, async (req, res) => {
    try {
        const { id, module } = req.params;
        const savedGuild = await index_1.default.cache.getGuild(id);
        savedGuild[module] = req.body;
        res.redirect(`/servers/${id}`);
    }
    catch {
        res.render('Errors/400', {
            client: index_1.default
        });
    }
    ;
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map