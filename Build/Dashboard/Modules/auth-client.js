"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const disco_oauth_1 = __importDefault(require("disco-oauth"));
const index_1 = __importDefault(require("@root/index"));
const bot = new disco_oauth_1.default(index_1.default.user.id, index_1.default.secret);
bot.setRedirect(`${process.env.DASHBOARD_CALLBACK_URL}/auth`);
bot.setScopes('identify', 'guilds');
exports.default = bot;
//# sourceMappingURL=auth-client.js.map