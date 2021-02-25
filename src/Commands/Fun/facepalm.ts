import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { MessageAttachment, User } from "discord.js";

export default class FacePalmCommand extends Command {
    constructor(){
        super({
            name: "facepalm",
            description: "facepalms a user",
            category: "fun",
            usage: "facepalm [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User = message.author;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        return message.channel.send(new MessageAttachment(await canvacord.Canvas.facepalm(user.displayAvatarURL({ dynamic: false, format: "png" })), "delete.png"));
    };
};