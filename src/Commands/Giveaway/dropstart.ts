import Command, { CommandRunner } from '@root/Command';
import { dropManager } from '@commands/Giveaway/Drop';

export default class DropStartCommand extends Command {
    constructor() {
        super({
            name: "dropstart",
            description: "starts a drop",
            category: "giveaway",
            usage: "dropstart <prize>",
            aliases: ["dstart"],
            requiredRoles: ["giveawayManagerRoleID"],
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const prize: string = args.join(" ");
        if (!args[0]) return client.createArgumentError(message, { title: dropManager, description: "You have to provide a prize!" }, this.usage);
        return client.drop.create({
            prize: prize,
            guildID: message.guild.id,
            channelID: message.channel.id,
            createdBy: message.author
        }, message);
    };
};