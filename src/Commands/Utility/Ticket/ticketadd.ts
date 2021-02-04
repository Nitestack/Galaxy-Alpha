import Command from '@root/Command';
import { GuildMember } from 'discord.js';
import TicketSchema from '@models/ticket';
import { ticketsManager } from '@commands/Utility/Ticket/Ticket';

export default class AddUserToTicketCommand extends Command {
    constructor(){
        super({
            name: "ticketadd",
            description: "adds an user to the ticket",
            guildOnly: true,
            aliases: ["tadd"],
            category: "ticket",
            usage: "ticketadd <@User/User ID>"
        });
    };
    async run(client, message, args, prefix) {
        let member: GuildMember;
        if (message.mentions.users.first()) member = message.guild.members.cache.filter(member => !member.user.bot).get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).get(args[0])) member = message.guild.members.cache.filter(member => !member.user.bot).get(args[0]);
        if (!member) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketadd <@User/User ID>`)
            .setTitle(ticketsManager)
            .setDescription("You have to mention an user or provide an user ID"));
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketadd <@User/User ID>`)
            .setTitle(ticketsManager)
            .setDescription("You are already in the ticket!"));
        await TicketSchema.findOne({
            channelID: message.channel.id
        }, {}, {}, (err, ticket) => {
            if (err) return console.log(err);
            if (!ticket) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketadd <@User/User ID>`)
                .setTitle(ticketsManager)
                .setDescription("This is not a ticket channel!"));
            if (ticket.userID == member.id) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketadd <@User/User ID>`)
                .setTitle(ticketsManager)
                .setDescription("Cannot add the ticket author itself!"));
            return client.tickets.addUser(member.id, message.channel.id, message);
        });
    };
};