import Command, { CommandRunner } from '@root/Command';
import axios from 'axios';

export default class DiscordJSDocumentationCommand extends Command {
    constructor() {
        super({
            name: "discordjsdocs",
            description: "sends an embed help message with the keywords",
            category: "developer",
            usage: "discordjsdocs <keywords>",
            aliases: ["docs"],
            developerOnly: true,
            args: [{
                type: "text",
                required: true,
                errorTitle: "🔖 DiscordJS Documentation Manager",
                errorMessage: "Please provide a query to search for!"
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const result = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args[0])}`);
        if (result.data && !result.data.error) return message.channel.send({ embed: result.data });
        else return client.createArgumentError(message, { title: "🔖 DiscordJS Documentation Manager", description: `Cannot find any results, that includes\n\`${args[0]}\`!` }, this.usage);
    };
};