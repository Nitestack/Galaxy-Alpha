import Profile from '@models/profile';
import Command from '@root/Command';
import { User } from 'discord.js';

export default class RemoveCoinsCommand extends Command {
    constructor() {
        super({
            name: "removecoins",
            description: "remove coins from the target user's wallet or bank",
            category: "developer",
            ownerOnly: true,
            usage: "removecoins <@User/User ID> <wallet/bank> <amount of coins (limit: 1.000.000.000$)>"
        });
    };
    async run(client, message, args, prefix) {
        const commandUsage: string = `${prefix}${this.usage}`;
        let user: User;
        if (!args[0]) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setDescription('You have mention a user or provide a user ID!'));
        if (args[1] != 'bank' && args[1] != 'wallet') return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setDescription('You have to specifiy, if you want to remove the coins to the bank or to the wallet!'));
        if (!args[2] || (isNaN(args[2]) && args[2] != 'all' && args[2] != 'max')) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setDescription('You have to provide an amount of coins you want to remove to the user!'));
        if (parseInt(args[2]) <= 0) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setDescription('You have to remove atleast `1`$!'));
        if (message.mentions.users.first()) user = message.mentions.users.first();
        if (args[0] && client.users.cache.filter(user => !user.bot).get(args[0])) user = client.users.cache.filter(user => !user.bot).get(args[0]);
        let coins = parseInt(args[2]);
        let balance: Boolean;
        if (args[1] == 'bank') {
            balance = true;
        } else {
            balance = false;
        };
        let oldProfile;
        let oldBank;
        let oldWallet;
        await Profile.findOne({
            profileID: user.id
        }, {}, {}, (err, userProfile) => {
            if (err) return console.log(err);
            if (!userProfile) {
                return oldProfile = 0;
            };
            oldBank = userProfile.bank;
            oldWallet = userProfile.wallet;
            return oldProfile = balance ? userProfile.bank : userProfile.wallet;
        });
        if (args[2] == 'max' || args[2] == 'all') coins = balance ? oldBank : oldWallet;
        if (coins > oldProfile) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setDescription(`The amount you want to remove is bigger then the user's balance!\n**Wallet:** \`${oldWallet}\`$\n**Bank:** \`${oldBank}\`$`));
        await Profile.findOneAndUpdate({
            profileID: user.id
        }, {
            profileID: user.id,
            $inc: {
                bank: balance ? -coins : 0,
                wallet: balance ? 0 : -coins,
                messageCount: message.author.id != user.id ? 0 : 1
            }
        }, {
            upsert: true
        });
        await Profile.findOne({
            profileID: user.id
        }, {}, {}, (err, userProfile) => {
            if (err) return console.log(err);
            if (userProfile) return message.channel.send(client.createGreenEmbed()
                .setDescription(`You sucessfully removed \`${coins.toLocaleString()}\`$ from ${user}'s ${balance ? 'bank' : 'wallet'}!
                **${balance ? 'Bank' : 'Wallet'}:** \`${oldProfile.toLocaleString()}\`$ ${client.arrowEmoji} \`${balance ? userProfile.bank.toLocaleString() : userProfile.wallet.toLocaleString()}\`$`)
                .setAuthor(`💰 ${message.author.username} removed coins to ${user.username}'s wallet!`, message.author.displayAvatarURL()));
        });
    };
};