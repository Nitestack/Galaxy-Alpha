import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';
import { Profile } from "@models/profile";

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
    run: CommandRunner = async (client, message, args, prefix) => {
        const commandUsage: string = `${prefix}${this.usage}`;
        let user: User;
        if (!args[0]) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to mention an user or provide an user ID!"}, this.usage);
        if (args[1].toLowerCase() != 'bank' && args[1].toLowerCase() != 'wallet') return client.createArgumentError(message, { title: "Currency Manager", description: "You have to specify, if you want to remove coins from the bank or from the wallet!"}, this.usage);
        if (!args[2] || (isNaN((args[2] as unknown as number)) && args[2].toLowerCase() != 'all' && args[2].toLowerCase() != 'max')) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to provide" }, this.usage);
        if (parseInt(args[2]) <= 0) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to remove atleast `1`$!" }, this.usage);
        if (message.mentions.users.first()) user = message.mentions.users.first();
        if (args[0] && client.users.cache.filter(user => !user.bot).get(args[0])) user = client.users.cache.filter(user => !user.bot).get(args[0]);
        const oldProfile = await client.cache.getCurrency(user.id);
        let balance: boolean = false;
        if (args[1].toLowerCase() == 'bank') balance = true;
        const coins = args[2].toLowerCase() == "all" || args[2].toLowerCase() == "max" ? (balance ? oldProfile.bank : oldProfile.wallet) : parseInt(args[2]);
        if (balance ? coins > oldProfile.bank : coins > oldProfile.wallet) return client.createArgumentError(message, { title: "Currency Manager", description: `The ${balance ? "bank" : "wallet"} is smaller then the amount of coins you want to remove!` }, this.usage);
        client.createSuccess(message, { 
            title: "Currency Manager",
            description: `You sucessfully removed \`${coins.toLocaleString()}\`$ from ${user}'s ${balance ? 'bank' : 'wallet'}!
            **${balance ? 'Bank' : 'Wallet'}:** \`${balance ? oldProfile.bank.toLocaleString() : oldProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${balance ? (oldProfile.bank - coins).toLocaleString() : (oldProfile.wallet - coins).toLocaleString()}\`$`
        });
        client.cache.currency.set(user.id, ({
            userID: user.id,
            bank: oldProfile.bank - (balance ? coins : 0),
            wallet: oldProfile.wallet - (balance ? 0 : coins),
            messageCount: 0,
            passive: oldProfile.passive
        } as Profile));
    };
};