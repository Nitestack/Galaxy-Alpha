import Command, { CommandRunner } from '@root/Command';
import TicketSchema from '@models/ticket';
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
            clientPermissions: ["MANAGE_CHANNELS"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        await TicketSchema.findOne({
            channelID: message.channel.id
        }, {}, {}, async (err, ticket) => {
            if (err) return console.log(err);
            if (!ticket) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketclose [reason]`)
                .setTitle(ticketsManager)
                .setDescription("This channel is not a ticket channel!"));
            if (!message.guild.channels.cache.get(ticket.channelID)) {
                await TicketSchema.findOneAndDelete({
                    channelID: ticket.channelID
                });
                return message.channel.send(client.createRedEmbed()
                    .setTitle(ticketsManager)
                    .setDescription("This channel no longer exist anymore!"));
            };
            return client.tickets.close(message.channel.id, prefix, ticket.userID, args.join(" ") ? args.join(" ") : "No reason provided!", message);
        });
    };
};