import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';

export default class ProfileCommand extends Command {
    constructor() {
        super({
            name: "profile",
            description: "deposit money to your bank",
            category: "currency",
            usage: "profile [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User = message.author;
        if (message.mentions.users.first() && client.users.cache.filter(user => !user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.filter(user => !user.bot).has(args[0])) user = client.users.cache.get(args[0]);
        if (!client.cache.currency.has(message.author.id)) client.cache.getCurrency(message.author.id);
        await client.cache.increaseCurrencyMessageCount(message.author.id);
        const userProfile = await client.cache.getCurrency(user.id);
        return message.channel.send(client.createEmbed()
            .setAuthor(`💰 ${user.username}'s Profile`, user.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`**Wallet**: \`${userProfile.wallet.toLocaleString()}\`$
            **Bank:** \`${userProfile.bank.toLocaleString()}\`$
            **Currency commands used:** \`${userProfile.messageCount.toLocaleString()}\``));
    };
};