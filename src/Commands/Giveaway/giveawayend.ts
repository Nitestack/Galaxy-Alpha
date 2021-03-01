import Command, { CommandRunner } from '@root/Command';
import { giveawayManager } from '@root/Commands/Giveaway/Giveaway';
import { Role } from "discord.js";
export default class GiveawayEndCommand extends Command {
    constructor() {
        super({
            name: "giveawayend",
            description: "ends a giveaway",
            usage: "giveawayend <Message ID>",
            aliases: ["gend"],
            guildOnly: true,
            category: "giveaway"
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
        return await client.giveaways.end(messageID);
    };
};