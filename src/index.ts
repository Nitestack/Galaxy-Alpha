import 'module-alias/register';
import dotenv from 'dotenv';
import GalaxyAlpha from '@root/Client';

dotenv.config();
const token = process.env.TOKEN;
const betaToken = process.env.BETA_TOKEN;
new GalaxyAlpha({
    ownerID: "700277649347575870",
    globalPrefix: "!!",
    token: betaToken,
    commandsDir: "Commands",
    eventsDir: "Events",
    featuresDir: "Features",
    mongoDBUrl: process.env.MONGOPATH,
    contributors: ['694162762020159539'],
    supportGuildID: "783440776285651024",
    defaultEmbedColor: "#365b88"
});