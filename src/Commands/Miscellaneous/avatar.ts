import Command from '@root/Command';
import { User } from 'discord.js';

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            category: "miscellaneous",
            description: "sends the avatar image of the user",
            usage: "avatar [@User/User ID]"
        });
    };
    async run(client, message, args, prefix) {
        let user: User = message.member;
        if (message.mentions.users.first()) user = client.users.cache.get(message.mentions.users.first().id);
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        return message.channel.send(client.createEmbed()
            .setTitle(`${user.username}'s Avatar`)
            .setURL(user.displayAvatarURL())
            .setImage(user.displayAvatarURL({ dynamic: true })));
    };
};