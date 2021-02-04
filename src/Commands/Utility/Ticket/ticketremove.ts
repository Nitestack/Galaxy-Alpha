import Command from '@root/Command';
import { ticketsManager } from '@commands/Utility/Ticket/Ticket';
import TicketSchema from '@models/ticket';
import { GuildMember } from 'discord.js';

export default class RemoveUserFromTicketCommand extends Command {
    constructor() {
        super({
            name: "ticketremove",
            description: "removes an user from the ticket",
            aliases: ["tremove"],
            category: "ticket",
            guildOnly: true,
            usage: "ticketremove <@User/User ID>"
        });
    };
    async run(client, message, args, prefix) {
        let member: GuildMember;
        if (message.mentions.users.first()) member = message.guild.members.cache.filter(member => !member.user.bot).get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).get(args[0])) member = message.guild.members.cache.filter(member => !member.user.bot).get(args[0]);
        if (!member) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketremove <@User/User ID>`)
            .setTitle(ticketsManager)
            .setDescription("You have to mention an user or provide an user ID"));
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketadd <@User/User ID>`)
            .setTitle(ticketsManager)
            .setDescription("You cannot remove yourself from the ticket!"));
        await TicketSchema.findOne({
            channelID: message.channel.id
        }, {}, {}, (err, ticket) => {
            if (err) return console.log(err);
            if (!ticket) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketremove <@User/User ID>`)
                .setTitle(ticketsManager)
                .setDescription("This is not a ticket channel!"));
            if (ticket.userID == member.id) return message.channel.send(client.createRedEmbed(true, `${prefix}ticketremove <@User/user ID>`)
                .setTitle(ticketsManager)
                .setDescription("Cannot remove the ticket author!"));
            return client.tickets.removeUser(member.id, message.channel.id, message);
        });
    };
};