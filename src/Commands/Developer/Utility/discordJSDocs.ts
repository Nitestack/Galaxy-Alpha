import Command from '@root/Command';
import axios from 'axios';

module.exports = class DiscordJSDocumentationCommand extends Command {
    constructor(client){
        super(client, {
            name: "discordjsdocs",
            description: "sends an embed help message with the keywords",
            category: "developer",
            usage: "discordjsdocs <keywords>",
            aliases: ["docs"],
            developerOnly: true
        });
    };
    async run(client, message, args, prefix) {
        if (!client.developers.includes(message.author.id)) return;
        if (!args[0]) return;
        axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.join(" "))}`).then(embed => {
            const { data } = embed;
            if (data && !data.error) {
                return message.channel.send({ embed: data });
            } else {
                const embed = client
                    .createRedEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("🔖 DiscordJS Documentation Manager")
                    .setDescription(`Cannot find any results, that includes\n\`${args.join(" ")}\`!`);
                return message.channel.send(embed);
            }
        }).catch(err => {
            return console.error(err);
        });
    };
};