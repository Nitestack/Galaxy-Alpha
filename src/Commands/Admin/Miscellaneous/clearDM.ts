import Command, { CommandRunner } from "@root/Command";
import { User } from "discord.js";

export default class ClearDMCommand extends Command {
    constructor(){
        super({
            name: "cleardm",
            description: "cleares all messages of the client's dm",
            category: "developer",
            developerOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User = message.author;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        return user.dmChannel?.delete();
    };
};