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
            developerOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return;
        axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.join(" "))}`).then(result => {
            if (result.data && !result.data.error) return message.channel.send({ embed: result.data });
            else return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🔖 DiscordJS Documentation Manager")
                .setDescription(`Cannot find any results, that includes\n\`${args.join(" ")}\`!`));
        }).catch(err => console.log(err));
    };
};