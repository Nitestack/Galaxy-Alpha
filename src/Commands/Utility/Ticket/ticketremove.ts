import Command, { CommandRunner } from '@root/Command';
import { ticketsManager } from '@commands/Utility/Ticket/Ticket';

export default class RemoveUserFromTicketCommand extends Command {
    constructor() {
        super({
            name: "ticketremove",
            description: "removes an user from the ticket",
            aliases: ["tremove"],
            category: "ticket",
            guildOnly: true,
            usage: "ticketremove <@User/User ID>",
            clientPermissions: ["MANAGE_CHANNELS"],
            requiredRoles: ["ticketManagerRoleID"],
            args: [{
                type: "realUser",
                index: 1,
                required: true,
                errorTitle: ticketsManager,
                errorMessage: "You have to mention an user or provide an user ID!"
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const ticket = await client.cache.getTicket(message.channel.id);
        if (!ticket) return client.createArgumentError(message, { title: ticketsManager, description: "This is not a ticket channel!" }, this.usage);
        const user = args[0];
        if (user.id == ticket.userID) return client.createArgumentError(message, { title: ticketsManager, description: "You cannot remove the ticket author from the ticket!" }, this.usage);
        await client.tickets.removeUser(message, user.id);
    };
};