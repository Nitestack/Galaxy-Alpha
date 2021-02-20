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
        
    };
};