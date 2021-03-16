import Command, { CommandRunner } from "@root/Command";

export default class extends Command {
    constructor() {
        super({
            name: "reset-level",
            description: "resets the level of an user",
            category: "miscellaneous",
            args: [{
                type: "realUser",
                index: 1,
                required: true,
                errorTitle: "🎚️ Level Manager",
                errorMessage: "You have to mention an user or provide an user ID!"
            }],
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const user = args[0];
        await client.cache.updateLevel(message.guild.id, user.id, {
            level: 0,
            messages: 0,
            xp: 0,
            lastUpdated: new Date()
        });
        return client.createSuccess(message, { title: "🎚️ Level Manager", description: `Successfully reseted ${user}'s level!`});
    };
};