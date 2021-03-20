"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validateGuild = exports.updateMusicPlayer = exports.updateUser = exports.updateGuilds = void 0;
const sessions_1 = require("@modules/sessions");
const index_1 = __importDefault(require("@root/index"));
const api_utils_1 = require("@modules/api-utils");
async function updateGuilds(req, res, next) {
    try {
        const key = req.cookies.key ?? req.get("Authorization");
        if (key) {
            const { guilds } = await sessions_1.get(key);
            res.locals.guilds = guilds;
        }
        ;
    }
    finally {
        return next();
    }
    ;
}
exports.updateGuilds = updateGuilds;
;
async function updateUser(req, res, next) {
    try {
        const key = req.cookies.key ?? req.get("Authorization");
        if (key) {
            const { authUser } = await sessions_1.get(key);
            res.locals.user = authUser;
        }
        ;
    }
    finally {
        return next();
    }
    ;
}
exports.updateUser = updateUser;
;
async function updateMusicPlayer(req, res, next) {
    try {
        const requestor = index_1.default.guilds.cache.get(req.params.id)?.members.cache.get(res.locals.user.id);
        if (!requestor)
            throw new TypeError('You shall not pass!');
        res.locals.requestor = requestor;
        res.locals.player = index_1.default.queue.get(req.params.id);
        return next();
    }
    catch (error) {
        api_utils_1.sendError(res, { message: error?.message });
    }
    ;
}
exports.updateMusicPlayer = updateMusicPlayer;
;
async function validateGuild(req, res, next) {
    res.locals.guild = res.locals.guilds.find(g => g.id === req.params.id);
    return res.locals.guild ? next() : res.render('Errors/404', {
        client: index_1.default
    });
}
exports.validateGuild = validateGuild;
;
async function validateUser(req, res, next) {
    return res.locals.user ? next() : res.render('Errors/401', {
        client: index_1.default
    });
}
exports.validateUser = validateUser;
;
//# sourceMappingURL=middleware.js.map