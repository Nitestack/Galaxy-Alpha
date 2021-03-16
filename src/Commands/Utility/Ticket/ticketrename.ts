import Command, { CommandRunner } from '@root/Command';
import { ticketsManager } from '@commands/Utility/Ticket/Ticket';
import { NewsChannel, TextChannel } from 'discord.js';

export default class RenameTicketChannelCommand extends Command {
    constructor() {
        super({
            name: "ticketrename",
            description: "renames the ticket channel",
            usage: "ticketrename <new name>",
            category: "ticket",
            aliases: ["trename"],
            guildOnly: true,
            requiredRoles: ["ticketManagerRoleID"],
            userPermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
            clientPermissions: ["MANAGE_CHANNELS"],
            args: [{
                type: "text",
                required: true,
                index: 1
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const ticket = await client.cache.getTicket(message.channel.id);
        if (!ticket) return client.createArgumentError(message, { title: ticketsManager, description: "This is not a ticket channel!" }, this.usage);
        await (message.channel as TextChannel | NewsChannel).setName(args[0]);
        return client.createSuccess(message, { title: ticketsManager, description: `Renamed the ticket channel name to: **${args[0]}**!`});
    };
};