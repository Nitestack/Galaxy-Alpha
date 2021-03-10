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
            category: "giveaway",
            requiredRoles: ["giveawayManagerRoleID"],
            userPermissions: ["MANAGE_GUILD"],
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const messageID: string = args[0];
        if (!messageID) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription("You have to provide a message ID!"));
        return await client.giveaways.end(messageID);
    };
};