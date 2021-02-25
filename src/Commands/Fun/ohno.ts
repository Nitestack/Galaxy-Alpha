import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { MessageAttachment, User } from "discord.js";

export default class OhNoCommand extends Command {
    constructor(){
        super({
            name: "ohno",
            description: "shows an oh no text",
            category: "fun",
            usage: "ohno [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: "💬 Ohno Manager", description: "You have to provide a text!" }, this.usage);
        return message.channel.send(new MessageAttachment(await canvacord.Canvas.ohno(args.join(" "))));
    };
};