import 'module-alias/register';
import dotenv from 'dotenv';
import 'discord-reply'; 
import GalaxyAlpha from '@root/Client';
import axios from 'axios';

//ENVIROMENT VARIABLES\\
dotenv.config();

const token: string = process.env.TOKEN;
const betaToken: string = process.env.BETA_TOKEN;
export default new GalaxyAlpha({
    ownerID: '700277649347575870',
    globalPrefix: process.env.GLOBAL_PREFIX,
    token: betaToken,
    commandsDir: 'Commands',
    eventsDir: 'Events',
    featuresDir: 'Features',
    mongoDBUrl: process.env.MONGOPATH,
    contributors: ['694162762020159539', '358303166845943808'],
    supportGuildID: '783440776285651024',
    ignoreFiles: ['Giveaway.ts', 'Music.ts', 'Drop.ts', 'Ticket.ts', 'Constants.ts', 'Queue.ts', 'BrawlerData.ts'],
    slashCommandsDir: 'SlashCommands'
});

setInterval(async () => {
    await axios.get("https://mixolydian-olive-salamander.glitch.me").then(() => console.log("Website is running!"));
});
