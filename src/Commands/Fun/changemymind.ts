import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { MessageAttachment, User } from "discord.js";

export default class ChangeMyMindCommand extends Command {
    constructor(){
        super({
            name: "changemymind",
            description: "changes my mind",
            category: "fun",
            usage: "changemymind <text>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: "🧠 Mind Manager", description: "You have to provide something to change my mind!"}, this.usage);
        return message.channel.send(new MessageAttachment(await canvacord.Canvas.changemymind(args.join(" "))));
    };
};