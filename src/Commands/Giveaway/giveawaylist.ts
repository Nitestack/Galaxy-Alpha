import Command, { CommandRunner } from '@root/Command';
import { giveawayManager } from '@commands/Giveaway/Giveaway';
import { Role } from "discord.js";

export default class GiveawayListCommand extends Command {
    constructor() {
        super({
            name: "giveawaylist",
            description: "lists all giveaways in the server",
            category: "giveaway",
            aliases: ["glist"],
            guildOnly: true,
            requiredRoles: ["giveawayManagerRoleID"],
            userPermissions: ["MANAGE_GUILD"],
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const list = await client.giveaways.list(message.guild.id);
        if (!list) return message.channel.send(client.createRedEmbed(true, `${prefix}giveawaylist`)
            .setTitle(giveawayManager)
            .setDescription("There are no active giveaways!"));
        return message.channel.send(client.createEmbed()
            .setTitle(giveawayManager)
            .setDescription(`${list.map(i => `🎁 **__${i.prize}__**\n**🕐 Time remaining:** ${client.ms(i.timeRemaining)}\n**${client.arrowEmoji} Channel:** ${i.channel}\n**🏅 Winners:** \`${i.winners}\`\n**${client.memberEmoji} Host:** **${i.hostedBy}**`).join('\n\n')}`));
    };
};