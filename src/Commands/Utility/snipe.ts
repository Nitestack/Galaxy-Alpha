import Command, { CommandRunner } from '@root/Command';

export default class SnipeCommand extends Command {
    constructor() {
        super({
            name: "snipe",
            description: "get's the last deleted message of the channel",
            category: "utility"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (client.snipes.has(message.channel.id)) {
            const snipes = client.snipes.get(message.channel.id);
            const embed = client.createEmbed()
                .setAuthor(snipes.author.tag, snipes.author.displayAvatarURL({ dynamic: true }))
                .setDescription(snipes.content)
                .setTimestamp(snipes.createdTimestamp);
            if (snipes.attachments.first()) embed.setImage(snipes.attachments.first().proxyURL);
            return message.channel.send(embed);
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}snipe`)
                .setTitle("🔫 Snipe Manager")
                .setDescription("There is nothing to snipe!"));
        };
    };
};