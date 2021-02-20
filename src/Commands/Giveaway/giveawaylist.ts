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
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const guildSettings = await client.cache.getGuild(message.guild.id);
        let giveawayManagerRole: Role;
        if (guildSettings.giveawayManagerRoleID && message.guild.roles.cache.has(guildSettings.giveawayManagerRoleID)) giveawayManagerRole = message.guild.roles.cache.get(guildSettings.giveawayManagerRoleID);
        if (giveawayManagerRole && !message.member.roles.cache.has(giveawayManagerRole.id) && !message.member.hasPermission("MANAGE_GUILD")) return client.createArgumentError(message, { title: giveawayManager, description: "You need the permission `Manage Server` or the giveaway creator role for this server!"}, this.usage);
        else if (!message.member.hasPermission("MANAGE_GUILD")) return client.createArgumentError(message, { title: giveawayManager, description: "You need the permission `Manage Server` or the giveaway creator role for this server!" }, this.usage);
        if (giveawayManagerRole) {
            if (!message.member.roles.cache.has(giveawayManagerRole.id) && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}giveawaylist`)
                .setTitle(giveawayManager)
                .setDescription("You need the permission `Manage Server` or the giveaway creator role for this server!"));
        } else {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}giveawaylist`)
                .setTitle(giveawayManager)
                .setDescription("You need the permission `Manage Server` or the giveaway creator role for this server!"));
        };
        const list = await client.giveaways.list(message.guild.id);
        if (!list) return message.channel.send(client.createRedEmbed(true, `${prefix}giveawaylist`)
            .setTitle(giveawayManager)
            .setDescription("There are no active giveaways!"));
        return message.channel.send(client.createEmbed()
            .setTitle(giveawayManager)
            .setDescription(`${list.map(i => `🎁 **__${i.prize}__**\n**🕐 Time remaining:** ${client.ms(i.timeRemaining)}\n**${client.arrowEmoji} Channel:** ${i.channel}\n**🏅 Winners:** \`${i.winners}\`\n**${client.memberEmoji} Host:** **${i.hostedBy}**`).join('\n\n')}`));
    };
};