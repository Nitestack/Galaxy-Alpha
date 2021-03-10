import Command, { CommandRunner } from '@root/Command';
import { dropManager } from '@commands/Giveaway/Drop';

export default class DropEndCommand extends Command {
    constructor() {
        super({
            name: "dropend",
            description: "ends a drop",
            category: "giveaway",
            aliases: ["dend"],
            requiredRoles: ["giveawayManagerRoleID"],
            userPermissions: ["MANAGE_GUILD"],
            usage: "dropend <Message ID>",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: dropManager, description: "You have to provide a message ID!" }, this.usage);
        const drop = await client.drop.end(args.join(" "));
        if (drop) return client.createSuccess(message, { title: dropManager, description: "Sucessfully ended the drop!" }, this.usage);
        else return client.createArgumentError(message, { title: dropManager, description: "Invalid message ID!" }, this.usage);
    };
};