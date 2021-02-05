import Command, { CommandRunner } from '@root/Command';
import { giveawayManager } from '@commands/Giveaway/Giveaway';
import Guild from '@models/guild';

export default class GiveawayDeleteCommand extends Command {
    constructor() {
        super({
            name: "giveawaydelete",
            description: "deletes a giveaway",
            category: "giveaway",
            aliases: ["gdelete"],
            guildOnly: true,
            usage: "giveawaydelete <Message ID>",
            userPermissions: ["MANAGE_GUILD"]
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
            if (!message.member.roles.cache.has(giveawayManagerRole.id) && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}giveawaydelete`)
                .setTitle(giveawayManager)
                .setDescription("You need the permission `Manage Server` or the giveaway creator role for this server!"));
        } else {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle(giveawayManager)
                .setDescription("You need the permission `Manage Server` or the giveaway creator role for this server!"));
        };
    };
};