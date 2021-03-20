"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
require("discord-reply");
const Client_1 = __importDefault(require("@root/Client"));
//ENVIROMENT VARIABLES\\
dotenv_1.default.config();
const token = process.env.TOKEN;
const betaToken = process.env.BETA_TOKEN;
exports.default = new Client_1.default({
    ownerID: "700277649347575870",
    globalPrefix: process.env.GLOBAL_PREFIX,
    token: token,
    commandsDir: "Commands",
    eventsDir: "Events",
    featuresDir: "Features",
    mongoDBUrl: process.env.MONGOPATH,
    contributors: ['694162762020159539'],
    supportGuildID: "783440776285651024",
    ignoreFiles: ["Giveaway.ts", "Music.ts", "Drop.ts", "Ticket.ts", "Constants.ts", "Queue.ts", "BrawlerData.ts"],
    slashCommandsDir: "SlashCommands"
});
//# sourceMappingURL=index.js.map