import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { MessageAttachment, User } from "discord.js";

export default class ClydeCommand extends Command {
    constructor(){
        super({
            name: "clyde",
            description: "sends a message by Clyde",
            category: "fun",
            usage: "clyde <message>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: "Clyde Manager", description: "You have to provide a content, that Clyde has to say!" }, this.usage);
        return message.channel.send(new MessageAttachment(await canvacord.Canvas.clyde(args.join(" "))));
    };
};