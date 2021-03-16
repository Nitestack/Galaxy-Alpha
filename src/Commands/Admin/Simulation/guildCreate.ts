import Command, { CommandRunner } from "@root/Command";

export default class GuildCreateCommand extends Command {
    constructor(){
        super({
            name: "guildcreate",
            description: "simulates a new guild",
            category: "developer",
            developerOnly: true,
            usage: "guildcreate [guild ID]",
            args: [{
                type: "guild",
                required: true,
                index: 1,
                errorTitle: "Simulation Manager",
                errorMessage: "You have to provide a valid guild ID!",
                default: (message) => message.channel.type == "dm" ? null : message.guild
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        return client.emit("guildCreate", args[0]);
    };
};