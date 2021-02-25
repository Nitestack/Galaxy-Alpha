import Command, { CommandRunner } from "@root/Command";
import { NewsChannel, TextChannel, User, Webhook } from "discord.js";

export default class EmbarrassCommand extends Command {
    constructor(){
        super({
            name: "embarrass",
            description: "embarrasses a user",
            category: "fun",
            guildOnly: true,
            clientPermissions: ["MANAGE_WEBHOOKS"],
            usage: "embarrass [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User = message.author;
        if (message.mentions.users.first() && message.guild.members.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && message.guild.members.cache.has(args[0])) user = message.guild.members.cache.get(args[0]).user;
        let webhook: Webhook = (await (message.channel as TextChannel | NewsChannel).fetchWebhooks()).find(webhook => webhook.name == user.username);
        if (!webhook) webhook = await (message.channel as TextChannel | NewsChannel).createWebhook(`${user.username}`, {
            avatar: user.displayAvatarURL({ dynamic: false, format: "png"})
        });
        const array: Array<string> = [];
        webhook.send(array[Math.round(client.util.getRandomArbitrary(0, array.length - 1))]);
    };
};