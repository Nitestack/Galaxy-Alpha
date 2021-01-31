import Command from '@root/Command';

module.exports = class SnipeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "snipe",
            description: "get's the last deleted message of the channel",
            category: "utility"
        });
    };
    async run(client, message, args, prefix) {
        const snipes = client.snipes.get(message.channel.id);
        if (snipes) {
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