import 'module-alias/register';
import dotenv from 'dotenv';
import GalaxyAlpha from '@root/Client';

//ENVIROMENT VARIABLES\\
dotenv.config();

const token: string = process.env.TOKEN;
const betaToken: string = process.env.BETA_TOKEN;
export default new GalaxyAlpha({
    ownerID: "700277649347575870",
    globalPrefix: process.env.GLOBAL_PREFIX,
    token: token,
    commandsDir: "Commands",
    eventsDir: "Events",
    featuresDir: "Features",
    mongoDBUrl: process.env.MONGOPATH,
    contributors: ['694162762020159539'],
    supportGuildID: "783440776285651024",
    ignoreFiles: ["Giveaway.ts", "Music.ts", "Drop.ts", "Ticket.ts", "Constants.ts", "Queue.ts"],
    slashCommandsDir: "SlashCommands"
});