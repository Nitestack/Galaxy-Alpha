import Command, { CommandRunner } from '@root/Command';
import { giveawayManager } from '@commands/Giveaway/Giveaway';
import Guild from '@models/guild';

export default class GiveawayListCommand extends Command {
    constructor() {
        super({
            name: "giveawaylist",
            description: "lists all giveaways in the server",
            category: "giveaway",
            aliases: ["glist"],
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let giveawayManagerRole;
        await Guild.findOne({
            guildID: message.guild.id
        }, {}, {}, (err, guild) => {
            if (err) return console.log(err);
            if (!guild.giveawayManager) return;
            if (guild.giveawayManager) giveawayManagerRole = message.guild.roles.cache.get(guild.giveawayManager);
        });
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