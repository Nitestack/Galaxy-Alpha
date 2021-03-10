import Command, { CommandRunner } from '@root/Command';

export default class MuteRoleCommand extends Command {
    constructor(){
        super({
            name: "muterole",
            description: "mute role commands",
            category: "management",
            guildOnly: true,
            usage: "muterole create <mute role name> or muterole set <@Role/Role ID> or muterole remove",
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const createUsage = `${prefix}muterole create <mute role name>`;
        const setUsage = `${prefix}muterole set <@Role/Role ID>`;
        const deleteUsage = `${prefix}muterole remove`;
        
    };
};