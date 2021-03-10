import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';

export default class AvatarCommand extends Command {
    constructor() {
        super({
            name: "avatar",
            category: "miscellaneous",
            description: "sends the avatar image of the user",
            usage: "avatar [@User/User ID]",
            aliases: ["av"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User = message.author;
        if (message.mentions.users.first()) user = client.users.cache.get(message.mentions.users.first().id);
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        return message.channel.send(client.createEmbed()
            .setTitle(`${user.username}'s Avatar`)
            .setURL(user.displayAvatarURL({ dynamic: true }))
            .setImage(user.displayAvatarURL({ dynamic: true })));
    };
};