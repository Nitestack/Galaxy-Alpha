import Command, { CommandRunner } from '@root/Command';
import Guild from '@models/guild';
import { Role } from 'discord.js';

export default class TicketRoleCommand extends Command {
    constructor(){
        super({
            name: "ticketrole",
            description: "ticket role commands",
            usage: "ticketrole set <@Role/Role ID> or ticketrole remove",
            category: "management",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        message.channel.send("COMING SOON")
    };
};