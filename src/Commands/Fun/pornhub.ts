import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { MessageAttachment, User } from "discord.js";

export default class PornhubCommand extends Command {
    constructor(){
        super({
            name: "pornhub",
            aliases: ["phub"],
            description: "sends an comment on Pornhub",
            category: "fun",
            usage: "pornhub [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User;
        let comment: string;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        if (user) comment = args.slice(1).join(" ");
        else comment = args.join(" ");
        if (!comment) return client.createArgumentError(message, { title: "💬 Pornhub Manager", description: "You have to provide a comment!" }, this.usage);
        if (!user) user = message.author;
        return message.channel.send(new MessageAttachment(await canvacord.Canvas.phub({
            username: message.author.username,
            message: comment,
            image: message.author.displayAvatarURL({ dynamic: false, format: "png" })
        })));
    };
};