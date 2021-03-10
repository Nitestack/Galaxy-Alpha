import Command, { CommandRunner } from '@root/Command';
import { giveawayManager } from '@commands/Giveaway/Giveaway';
import { Role } from 'discord.js';

export default class GiveawayRerollCommand extends Command {
    constructor() {
        super({
            name: "giveawayreroll",
            description: "rerolls a giveaway",
            category: "giveaway",
            guildOnly: true,
            usage: "giveawayreroll <Message ID>",
            aliases: ["greroll"],
            requiredRoles: ["giveawayManagerRoleID"],
            userPermissions: ["MANAGE_GUILD"],
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const messageID: string = args[0];
        if (!messageID) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription("You have to provide a message ID!"));
        return await client.giveaways.reroll(messageID, message, this.usage);
    };
};