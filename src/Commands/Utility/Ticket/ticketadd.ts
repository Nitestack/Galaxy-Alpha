import Command, { CommandRunner } from '@root/Command';
import { ticketsManager } from '@commands/Utility/Ticket/Ticket';

export default class AddUserToTicketCommand extends Command {
    constructor(){
        super({
            name: "ticketadd",
            description: "adds an user to the ticket",
            guildOnly: true,
            aliases: ["tadd"],
            category: "ticket",
            usage: "ticketadd <@User/User ID>",
            clientPermissions: ["MANAGE_CHANNELS"],
            requiredRoles: ["ticketManagerRoleID"],
            userPermissions: ["MANAGE_MESSAGES"],
            args: [{
                type: "realUser",
                index: 1,
                required: true
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const ticket = await client.cache.getTicket(message.channel.id);
        if (!ticket) return client.createArgumentError(message, { title: ticketsManager, description: "This is not a ticket channel!" }, this.usage);
        const user = args[0];
        if (user.id == ticket.userID) return client.createArgumentError(message, { title: ticketsManager, description: "The ticket author is already added to the ticket!" }, this.usage);
        await client.tickets.addUser(message, user.id);
    };
};