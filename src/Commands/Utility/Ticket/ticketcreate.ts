import Command, { CommandRunner } from '@root/Command';
import GuildSchema from '@models/guild';
import { CategoryChannel, Role } from 'discord.js';
import { ticketsManager } from '@commands/Utility/Ticket/Ticket';
import TicketSchema from '@models/ticket';

export default class CreateTicketCommand extends Command {
    constructor(){
        super({
            name: "ticketcreate",
            description: "creates a new ticket",
            aliases: ["tcreate"],
            usage: "ticketcreate [reason]",
            category: "ticket",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const usage: string = `${prefix}ticketcreate [reason]`;
        await TicketSchema.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        }, {}, {}, async (err, ticket) => {
            if (err) return console.log(err);
            if (ticket) {
                return message.channel.send(client.createRedEmbed(true, usage)
                    .setTitle(ticketsManager)
                    .setDescription(`You already have an opened ticket ${client.arrowEmoji} <#${ticket.channelID}>`));
            } else {
                let ticketManagerTrueOrFalse: boolean = false;
                let ticketRole: Role;
                let ticketCategory: CategoryChannel;
                let ticketCate: boolean = false;
                await GuildSchema.findOne({
                    guildID: message.guild.id
                }, {}, {}, (err, guild) => {
                    if (err) return console.log(err);
                    if (!guild) return message.channel.send(client.createRedEmbed(true, usage)
                        .setTitle(ticketsManager)
                        .setDescription("An error occurred while your used the command! Please try again!"));
                    if (guild.ticketRole) {
                        ticketRole = message.guild.roles.cache.get(guild.ticketRole);
                        if (ticketRole) {
                            ticketManagerTrueOrFalse = true;
                        } else {
                            return message.channel.send(client.createRedEmbed(true, usage)
                                .setTitle(ticketsManager)
                                .setDescription(`You have to setup a ticket manager role!
                                Do \`${prefix}ticketrole set <@Role/Role ID>\``));
                        };
                    };
                    if (!guild.ticketRole) {
                        return message.channel.send(client.createRedEmbed(true, usage)
                            .setTitle(ticketsManager)
                            .setDescription(`You have to setup a ticket manager role!
                            Do \`${prefix}ticketrole set <@Role/Role ID>\``));
                    };
                    if (guild.ticketCategoryID) {
                        ticketCategory = (message.guild.channels.cache.filter(channel => channel.type == 'category').get(guild.ticketCategoryID) as CategoryChannel);
                        if (ticketCategory) { 
                            ticketCate = true;
                        };
                    };
                    const reason: string = args.join(" ");
                    if (ticketCate) {
                        client.tickets.create(message.guild, ticketCategory, message.author, ticketRole, reason ? reason : 'No reason provided!');
                    } else {
                        message.guild.channels.create(`${message.guild.name} Tickets`, {
                            type: 'category',
                            permissionOverwrites: [{
                                id: message.guild.id,
                                deny: ["VIEW_CHANNEL"]
                            }, {
                                id: message.author.id,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "READ_MESSAGE_HISTORY"]
                            }, {
                                id: ticketRole.id,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "READ_MESSAGE_HISTORY"]
                            }]
                        }).then(async ticketCategoryChannel => {
                            await GuildSchema.findOneAndUpdate({
                                guildID: message.guild.id
                            }, {
                                ticketCategoryID: ticketCategoryChannel.id
                            }, {
                                upsert: false
                            });
                            client.tickets.create(message.guild, ticketCategoryChannel, message.author, ticketRole, reason ? reason : 'No reason provided!');
                        });
                    };
                });
            };
        });
    };
};