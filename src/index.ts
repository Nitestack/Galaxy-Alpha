import 'module-alias/register';
import dotenv from 'dotenv';
import GalaxyAlpha from '@root/Client';
import { Intents } from "discord.js";

dotenv.config();
const token = process.env.TOKEN;
const betaToken = process.env.BETA_TOKEN;
export const Bot = new GalaxyAlpha({
    ownerID: "700277649347575870",
    globalPrefix: process.env.GLOBAL_PREFIX,
    token: betaToken,
    commandsDir: "Commands",
    eventsDir: "Events",
    featuresDir: "Features",
    mongoDBUrl: process.env.MONGOPATH,
    contributors: ['694162762020159539'],
    supportGuildID: "783440776285651024",
    defaultEmbedColor: "#365b88",
    ignoreFiles: ["Giveaway.ts", "Music.ts", "Drop.ts", "Ticket.ts"]
});