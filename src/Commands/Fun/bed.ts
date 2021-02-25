import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { MessageAttachment, User } from "discord.js";

export default class BedCommand extends Command {
    constructor(){
        super({
            name: "bed",
            description: "sleep with another one",
            category: "fun",
            usage: "bed <@User/User ID>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        if (!user) return client.createArgumentError(message, { title: "🛏️ Bed Manager", description: "You have to mention an user or provide an user ID to sleep with!" }, this.usage);
        return message.channel.send(new MessageAttachment(await canvacord.Canvas.bed(message.author.displayAvatarURL({ dynamic: false, format: "png" }), user.displayAvatarURL({ dynamic: false, format: "png" })), "delete.png"));
    };
};