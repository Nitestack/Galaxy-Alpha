import Command from '@root/Command';
import TicketSchema from '@models/ticket';
import { ticketsManager } from '@commands/Utility/Ticket/Ticket';

module.exports = class RenameTicketChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ticketrename",
            description: "renames the ticket channel",
            usage: "ticketrename <new name>",
            category: "ticket",
            aliases: ["trename"],
            guildOnly: true
        });
    };
    async run(client, message, args, prefix) {
        if (!args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketrename <new name>`)
            .setTitle(ticketsManager)
            .setDescription("You have to provide a new name for the ticket channel!"));
        await TicketSchema.findOne({
            channelID: message.channel.id
        }, {}, {}, (err, ticket) => {
            if (err) return console.log(err);
            if (!ticket) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketrename <new name>`)
                .setTitle(ticketsManager)
                .setDescription("This channel is not a ticket channel!"));
            message.channel.setName(args.join(" "));
            return message.channel.send(client.createGreenEmbed()
                .setTitle(ticketsManager)
                .setDescription(`**Renamed the ticket channel to:**\n\n${args.join(" ")}`));
        });
    };
};