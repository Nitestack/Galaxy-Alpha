import Command from '@root/Command';
import { giveawayManager } from '@commands/Giveaway/Giveaway';

module.exports = class DropListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'droplist',
            description: "lists all drops of the guild",
            category: "giveaway",
            usage: "droplist",
            aliases: ["dlist"],
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true
        });
    };
    async run(client, message, args, prefix) {
        const list = await client.drop.list(message.guild.id);
        if (!list) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription("There are no active drops!"));
        return message.channel.send(client.createEmbed()
            .setTitle(giveawayManager)
            .setDescription(`${list.map(i => `🎁 **__${i.prize}__**\n${client.arrowEmoji} Channel:** ${i.channel}\n**${client.memberEmoji} Host:** **${i.hostedBy}**`).join('\n\n')}`));
    };
};