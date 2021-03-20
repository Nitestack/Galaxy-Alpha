"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_client_1 = __importDefault(require("@modules/auth-client"));
const sessions_1 = require("@modules/sessions");
const index_1 = __importDefault(require("@root/index"));
const router = express_1.default.Router();
router.get('/invite', (req, res) => res.redirect(index_1.default.inviteLink));
router.get('/login', (req, res) => res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${index_1.default.user.id}&redirect_uri=${process.env.DASHBOARD_CALLBACK_URL.replace(/\//g, "%2F").replace(/:/g, "%3A")}/auth&response_type=code&scope=identify guilds&prompt=none`.replace(/ /g, "%20")));
router.get('/auth-guild', async (req, res) => {
    try {
        const key = req.cookies.key;
        await sessions_1.update(key);
    }
    finally {
        res.redirect('/dashboard');
    }
    ;
});
router.get('/auth', async (req, res) => {
    try {
        const code = req.query.code;
        const key = await auth_client_1.default.getAccess(code);
        res.cookie('key', key);
        res.redirect('/dashboard');
    }
    catch (error) {
        console.log(error);
        res.render("Errors/401", {
            client: index_1.default
        });
    }
    ;
});
router.get('/logout', (req, res) => {
    res.clearCookie("key");
    res.redirect('/');
});
exports.default = router;
//# sourceMappingURL=auth.js.map