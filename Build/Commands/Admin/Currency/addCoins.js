"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class AddCoinsCommand extends Command_1.default {
    constructor() {
        super({
            name: "addcoins",
            description: "add coins to the target user's wallet or bank",
            usage: "addcoins <@User/User ID> <wallet/bank> <amount of coins>",
            category: "developer",
            ownerOnly: true,
            args: [{
                    type: "realUser",
                    index: 1,
                    required: true,
                    errorTitle: "💰 Currency Manager",
                    errorMessage: "You need to mention an user or provide an user ID!",
                    default: (message) => message.author
                }, {
                    type: "certainString",
                    index: 2,
                    certainStrings: ["bank", "wallet"],
                    required: true,
                    errorTitle: "💰 Currency Manager",
                    errorMessage: "You have to specify, if you want to add coins to the bank or to the wallet!"
                }, {
                    type: "number",
                    index: 3,
                    required: true,
                    errorTitle: "💰 Currency Manager",
                    errorMessage: "You have to provide an amount of coins to add!",
                    filter: (message, arg) => arg > 0
                }]
        });
        this.run = async (client, message, args, prefix) => {
            console.log(args);
            const user = args[0];
            const oldProfile = await client.cache.getCurrency(user.id);
            let balance = false;
            if (args[1].toLowerCase() == 'bank')
                balance = true;
            const coins = args[2];
            client.createSuccess(message, {
                title: "Currency Manager",
                description: `You sucessfully added \`${coins.toLocaleString()}\`$ to ${user}'s ${balance ? 'bank' : 'wallet'}!
            **${balance ? 'Bank' : 'Wallet'}:** \`${balance ? oldProfile.bank.toLocaleString() : oldProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${balance ? (oldProfile.bank + coins).toLocaleString() : (oldProfile.wallet + coins).toLocaleString()}\`$`
            });
            await client.cache.increaseBalance(user.id, "bank", oldProfile.bank + (balance ? coins : 0));
            await client.cache.increaseBalance(user.id, "wallet", oldProfile.wallet + (balance ? 0 : coins));
        };
    }
    ;
}
exports.default = AddCoinsCommand;
;
//# sourceMappingURL=addCoins.js.map