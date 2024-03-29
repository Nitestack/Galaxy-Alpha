import Command, { CommandRunner } from '@root/Command';
import { Profile } from "@models/profile";

export default class RemoveCoinsCommand extends Command {
    constructor() {
        super({
            name: "removecoins",
            description: "remove coins from the target user's wallet or bank",
            category: "developer",
            ownerOnly: true,
            usage: "removecoins <@User/User ID> <wallet/bank> <amount of coins (limit: 1.000.000.000$)>",
            args: [{
                type: "realUser",
                required: true,
                errorTitle: "💰 Currency Manager",
                errorMessage: "You need to mention an user or provide an user ID!",
                default: (message) => message.author
            }, {
                type: "certainString",
                certainStrings: ["bank", "wallet"],
                required: true,
                errorTitle: "💰 Currency Manager",
                errorMessage: "You have to specify, if you want to add coins to the bank or to the wallet!"
            }, {
                required: true,
                errorTitle: "💰 Currency Manager",
                errorMessage: "You have to provide an amount of coins to remove!\nTo remove all coins simply type `all`",
                filter: (message, arg) => isNaN(arg) ? arg.toLowerCase() == "all" || arg.toLowerCase() == "max" : arg > 0
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const user = args[0];
        const oldProfile = await client.cache.getCurrency(user.id);
        let balance: boolean = false;
        if (args[1].toLowerCase() == 'bank') balance = true;
        const coins = isNaN(args[2]) && (args[2].toLowerCase() == "all" || args[2].toLowerCase() == "max") ? (balance ? oldProfile.bank : oldProfile.wallet) : args[2];
        if (balance ? coins > oldProfile.bank : coins > oldProfile.wallet) return client.createArgumentError(message, { title: "Currency Manager", description: `The ${balance ? "bank" : "wallet"} is smaller then the amount of coins you want to remove!` }, this.usage);
        client.createSuccess(message, { 
            title: "Currency Manager",
            description: `You sucessfully removed \`${coins.toLocaleString()}\`$ from ${user}'s ${balance ? 'bank' : 'wallet'}!
            **${balance ? 'Bank' : 'Wallet'}:** \`${balance ? oldProfile.bank.toLocaleString() : oldProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${balance ? (oldProfile.bank - coins).toLocaleString() : (oldProfile.wallet - coins).toLocaleString()}\`$`
        });
        client.cache.currency.set(user.id, ({
            ...oldProfile,
            bank: oldProfile.bank - (balance ? coins : 0),
            wallet: oldProfile.wallet - (balance ? 0 : coins)
        } as Profile));
    };
};