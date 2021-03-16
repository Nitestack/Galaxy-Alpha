import Command, { CommandRunner } from '@root/Command';
import { ticketsManager } from '@commands/Utility/Ticket/Ticket';
import { CategoryChannel } from "discord.js";

export default class CreateTicketCommand extends Command {
    constructor() {
        super({
            name: "ticketcreate",
            description: "creates a new ticket",
            aliases: ["tcreate"],
            usage: "ticketcreate [reason]",
            category: "ticket",
            guildOnly: true,
            clientPermissions: ["MANAGE_CHANNELS"],
            args: [{
                type: "text",
                index: 1
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const alreadyTicket = client.cache.tickets.find(ticket => ticket.userID == message.author.id);
        if (alreadyTicket) return client.createArgumentError(message, { title: ticketsManager, description: `You already have a ticket opened!\n=> <#${alreadyTicket.channelID}>` }, this.usage);
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (!guildSettings || !guildSettings.ticketManagerRoleID || !guildSettings.ticketCategoryID) return client.createArgumentError(message, { title: ticketsManager, description: `This server has no ticket category or no ticket manager role!\nAsk the server mods to run the command \`${client.globalPrefix}ticket-setup\`!`}, this.usage);
        await client.tickets.create(message.guild, message.guild.channels.cache.get(guildSettings.ticketCategoryID) as CategoryChannel, message.author, message.guild.roles.cache.get(guildSettings.ticketManagerRoleID), args[0]);
    };
};