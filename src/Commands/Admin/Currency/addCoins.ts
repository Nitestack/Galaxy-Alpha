import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';
import { Profile } from "@models/profile";

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
        let user: User;
        if (message.mentions.users.first() && client.users.cache.filter(user => !user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.filter(user => !user.bot).has(args[0])) user = client.users.cache.filter(user => !user.bot).get(args[0]);
        if (!user) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to mention an user or provide an user ID!" }, this.usage);
        if (args[1].toLowerCase() != 'bank' && args[1].toLowerCase() != 'wallet') return client.createArgumentError(message, { title: "Currency Manager", description: "You have to specify, if you want to add coins to the bank or to the wallet!" }, this.usage);
        if (!args[2] || isNaN((args[2] as unknown as number))) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to provide an amount of coins to add!" }, this.usage);
        if (parseInt(args[2]) <= 0) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to add atleast `1`$!" }, this.usage);
        const oldProfile = await client.cache.getCurrency(user.id);
        let balance: boolean = false;
        if (args[1].toLowerCase() == 'bank') balance = true;
        const coins = parseInt(args[2]);
        client.createSuccess(message, {
            title: "Currency Manager", 
            description: `You sucessfully added \`${coins.toLocaleString()}\`$ to ${user}'s ${balance ? 'bank' : 'wallet'}!
            **${balance ? 'Bank' : 'Wallet'}:** \`${balance ? oldProfile.bank.toLocaleString() : oldProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${balance ? (oldProfile.bank + coins).toLocaleString() : (oldProfile.wallet + coins).toLocaleString()}\`$`
        })
        client.cache.currency.set(user.id, ({
            userID: user.id,
            bank: oldProfile.bank + (balance ? coins : 0),
            wallet: oldProfile.wallet + (balance ? 0 : coins),
            messageCount: 0
        } as Profile));
    };
};