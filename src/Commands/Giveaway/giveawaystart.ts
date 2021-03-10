import Command, { CommandRunner } from '@root/Command';
import { giveawayManager } from '@root/Commands/Giveaway/Giveaway';
import { Role } from "discord.js";

export default class GiveawayStartCommand extends Command {
    constructor() {
        super({
            name: "giveawaystart",
            description: "starts a giveaway",
            aliases: ["gstart"],
            category: "giveaway",
            usage: "giveawaystart <duration> <winner(s)> <prize>",
            guildOnly: true,
            clientPermissions: ["MANAGE_MESSAGES"],
            requiredRoles: ["giveawayManagerRoleID"],
            userPermissions: ["MANAGE_GUILD"],
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const giveawayDuration = args[0];
        if (!giveawayDuration || !client.ms(args[0])) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription(("You have to provide a valid duration!\nYou can use seconds (s), minutes (m), hours (h), days (d), weeks (w) and years (y)!")));
        const giveawayNumberWinners = parseInt(args[1]);
        if (isNaN(giveawayNumberWinners) || giveawayNumberWinners <= 0) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription("You have to provide an amount of winners!"));
        const giveawayPrize = args.slice(2).join(' ');
        if (!giveawayPrize) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription("You have to provide a prize for this giveaway!"));
        return await client.giveaways.start({
            channelID: message.channel.id,
            duration: client.ms(giveawayDuration),
            guildID: message.guild.id,
            winners: giveawayNumberWinners,
            hostedBy: message.author,
            prize: giveawayPrize
        }, message, {
            roles: [],
            messages: 0,
            invites: 0,
            level: 0,
            guildReq: 'none'
        });
    };
};