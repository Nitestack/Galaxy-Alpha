import Command, { CommandRunner } from "@root/Command";

export default class ReactionRolesAddCommand extends Command {
    constructor(){
        super({
            name: "reactionrolesadd",
            description: "adds a reaction role to a already existing reaction role table",
            category: "utility"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const messageID = args[0];
        if (!messageID) return client.createArgumentError(message, { title: "Reaction Roles Manager", description: "You have to provide the message ID of the reaction table!" }, this.usage);
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (!guildSettings.reactionRoles) return client.createArgumentError(message, { title: "Reaction Roles Manager", description: "There are no reactionrole tables!\nPlease create one!"}, this.usage);

    };
};