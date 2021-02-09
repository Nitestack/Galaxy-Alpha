import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';

export default class AddCoinsCommand extends Command {
    constructor() {
        super({
            name: "addcoins",
            description: "add coins to the target user's wallet or bank",
            usage: "addcoins <@User/User ID> <wallet/bank> <amount of coins>",
            category: "developer",
            ownerOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const commandUsage: string = `${prefix}${this.usage}`;
        let user: User;
        if (message.mentions.users.first()) user = message.mentions.users.first();
        if (!user) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle('Currency Manager').setDescription('You have mention a user or provide a user ID!'));
        if (args[0] && client.users.cache.filter(user => !user.bot).get(args[0])) user = client.users.cache.filter(user => !user.bot).get(args[0]);
        if (args[1].toLowerCase() != 'bank' && args[1].toLowerCase() != 'wallet') return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle('Currency Manager').setDescription('You have to specifiy, if you want to add the coins to the bank or to the wallet!'));
        if (!args[2] || isNaN((args[2] as unknown as number))) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle('Currency Manager').setDescription('You have to provide an amount of coins you want to add to the user!'));
        if (parseInt(args[2]) <= 0) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle('Currency Manager').setDescription('You have to add atleast `1`$!'));
        const oldProfile = await client.cache.getCurrency(user.id);
        let balance: boolean = false;
        if (args[1].toLowerCase() == 'bank') balance = true;
        const coins = args[2].toLowerCase() == "all" || args[2].toLowerCase() == "max" ? (balance ? oldProfile.bank : oldProfile.wallet) : parseInt(args[2]);
        message.channel.send(client.createGreenEmbed()
            .setDescription(`You sucessfully added \`${coins.toLocaleString()}\`$ to ${user}'s ${balance ? 'bank' : 'wallet'}!
            **${balance ? 'Bank' : 'Wallet'}:** \`${balance ? oldProfile.bank.toLocaleString() : oldProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${balance ? (oldProfile.bank + coins).toLocaleString() : (oldProfile.wallet + coins).toLocaleString()}\`$`)
            .setAuthor(`💰 ${message.author.username} adds coins to ${user.username}'s wallet!`, message.author.displayAvatarURL()));
        client.cache.currency.set(user.id, {
            userID: user.id,
            bank: oldProfile.bank + (balance ? coins : 0),
            wallet: oldProfile.wallet + (balance ? 0 : coins),
            messageCount: 0
        });
    };
};