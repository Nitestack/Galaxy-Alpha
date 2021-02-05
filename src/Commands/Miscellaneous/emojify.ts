import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';

export default class EmojifyCommand extends Command {
    constructor(){
        super({
            name: "emojify",
            description: "converts an user's name into emojis",
            category: "miscellaneous",
            usage: "emojify [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User = message.author;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        const emojifiedName: string = user.username;
        alphabets.forEach(letter => {
            emojifiedName.replace(/HydraNhani/g, `:regional_indicator_${letter}:`)
        });
        return message.channel.send(`@${emojifiedName}`);
    };
};