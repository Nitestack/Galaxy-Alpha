import Command, { CommandRunner } from '@root/Command';
import { giveawayManager } from '@commands/Giveaway/Giveaway';
import { dropManager } from './Drop';

export default class DropListCommand extends Command {
    constructor() {
        super({
            name: 'droplist',
            description: "lists all drops of the guild",
            category: "giveaway",
            usage: "droplist",
            aliases: ["dlist"],
            requiredRoles: ["giveawayManagerRoleID"],
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const list = await client.drop.list(message.guild.id);
        if (!list) return client.createArgumentError(message, { title: dropManager, description: "There are no active giveaways!" }, this.usage);
        return message.channel.send(client.createEmbed()
            .setTitle(giveawayManager)
            .setDescription(`${list.map(i => `🎁 **__${i.prize}__**\n${client.arrowEmoji} Channel:** ${i.channel}\n**${client.memberEmoji} Host:** **${i.hostedBy}**`).join('\n\n')}`));
    };
};