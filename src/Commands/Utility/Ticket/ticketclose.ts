import Command, { CommandRunner } from '@root/Command';
import { ticketsManager } from '@commands/Utility/Ticket/Ticket';

export default class CloseTicketCommand extends Command {
    constructor(){
        super({
            name: "ticketclose",
            description: "closes a ticket",
            aliases: ["tclose"],
            guildOnly: true,
            usage: "ticketclose [reason]",
            category: "ticket",
            clientPermissions: ["MANAGE_CHANNELS"],
            requiredRoles: ["ticketManagerRoleID"],
            args: [{
                type: "text",
                index: 1
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const ticket = await client.cache.getTicket(message.channel.id);
        if (!ticket) return client.createArgumentError(message, { title: ticketsManager, description: "This channel is not a ticket channel!"}, this.usage);
        return client.tickets.close(message, ticket.userID, args[0]);
    };
};