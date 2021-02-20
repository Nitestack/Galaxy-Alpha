import Command, { CommandRunner } from '@root/Command';
import { giveawayManager } from '@commands/Giveaway/Giveaway';
import { NewsChannel, TextChannel, Role } from 'discord.js';

export default class GiveawayRerollCommand extends Command {
    constructor() {
        super({
            name: "giveawayreroll",
            description: "rerolls a giveaway",
            category: "giveaway",
            guildOnly: true,
            usage: "giveawayreroll <Message ID>",
            aliases: ["greroll"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const guildSettings = await client.cache.getGuild(message.guild.id);
        let giveawayManagerRole: Role;
        if (guildSettings.giveawayManagerRoleID && message.guild.roles.cache.has(guildSettings.giveawayManagerRoleID)) giveawayManagerRole = message.guild.roles.cache.get(guildSettings.giveawayManagerRoleID);
        if (giveawayManagerRole && !message.member.roles.cache.has(giveawayManagerRole.id) && !message.member.hasPermission("MANAGE_GUILD")) return client.createArgumentError(message, { title: giveawayManager, description: "You need the permission `Manage Server` or the giveaway creator role for this server!"}, this.usage);
        else if (!message.member.hasPermission("MANAGE_GUILD")) return client.createArgumentError(message, { title: giveawayManager, description: "You need the permission `Manage Server` or the giveaway creator role for this server!" }, this.usage);
        const messageID: string = args[0];
        if (!messageID) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription("You have to provide a message ID!"));

        const reroll = client.giveaways.reroll(messageID, message.channel as TextChannel | NewsChannel, `${prefix}${this.usage}`);
        if (!reroll) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription("This giveaway has not ended yet!"));
    };
};