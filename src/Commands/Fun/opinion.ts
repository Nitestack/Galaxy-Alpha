import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { MessageAttachment, User } from "discord.js";

export default class OpinionCommand extends Command {
    constructor(){
        super({
            name: "opinion",
            description: "sends an opinion",
            category: "fun",
            usage: "opinion [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User;
        let opinion: string;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        if (user) opinion = args.slice(1).join(" ");
        else opinion = args.join(" ");
        if (!opinion) return client.createArgumentError(message, { title: "💬 Opinion Manager", description: "You have to provide an opinion!" }, this.usage);
        if (!user) user = message.author;
        return message.channel.send(new MessageAttachment(await canvacord.Canvas.opinion(user.displayAvatarURL({ dynamic: false, format: "png" }), opinion)));
    };
};