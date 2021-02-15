import Command, { CommandRunner } from "@root/Command";
import { Profile } from "@models/profile";

export default class PassiveCommand extends Command {
    constructor(){
        super({
            name: "passive",
            description: "enables passive mode or disable it",
            category: "currency",
            usage: "passive <enable/disable>",
            cooldown: "1d"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const oldProfile = await client.cache.getCurrency(message.author.id);
        client.cache.currency.set(message.author.id, ({
            userID: message.author.id, 
            wallet: oldProfile.wallet,
            bank: oldProfile.bank,
            messageCount: oldProfile.messageCount + 1,
            passive: oldProfile.passive
        } as Profile));
        if (args[0] && (args[0].toLowerCase() == "enable" || args[0].toLowerCase() == "disable")){
            const profile = await client.cache.getCurrency(message.author.id);
            if (args[0].toLowerCase() == "enable" && profile.passive) return client.createArgumentError(message, { title: "Currency Manager", description: "Passive mode is already enabled!"}, this.usage);
            if (args[0].toLowerCase() == "disable" && !profile.passive) return client.createArgumentError(message, { title: "Currency Manager", description: "Passive mode is already disabled!"}, this.usage);
            client.cache.currency.set(message.author.id, ({
                userID: message.author.id,
                bank: profile.bank,
                wallet: profile.wallet,
                messageCount: profile.messageCount,
                passive: args[0].toLowerCase() == "enable" ? true : false
            } as Profile));
            return client.createSuccess(message, { title: "Currency Manager", description: `Passive mode is ${!profile.passive ? "enabled" : "disabled"}!`});
        } else {
            return message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`)
                .setTitle("Currency Manager")
                .setDescription(`Passive mode is ${(await client.cache.getCurrency(message.author.id)).passive ? "enabled" : "disabled"}!`));
        };
    };
};