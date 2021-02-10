import Command, { CommandRunner } from "@root/Command";
import { Guild } from "discord.js";

export default class GuildCreateCommand extends Command {
    constructor(){
        super({
            name: "guildcreate",
            description: "simulates a new guild",
            category: "developer",
            developerOnly: true,
            usage: "guildcreate [guild ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let guild: Guild = message.channel.type != "dm" ? message.guild : null;
        if (args[0] && client.guilds.cache.has(args[0])) guild = client.guilds.cache.get(args[0]);
        if (!guild) return client.createArgumentError(message, { title: "Simulation Manager", description: "You have to provide a valid guild ID!"}, this.usage);
        return client.emit("guildCreate", guild);
    };
};