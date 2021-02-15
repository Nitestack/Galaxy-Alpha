import Command, { CommandRunner } from '@root/Command';
import { Profile } from "@models/profile";

export default class WeeklyCommand extends Command {
    constructor() {
        super({
            name: "weekly",
            description: "claim your weekly coins",
            category: "currency",
            cooldown: "1w"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const embed = client.createGreenEmbed().setAuthor(`💰 ${message.author.username} redeemed their daily reward!`, message.author.displayAvatarURL());
        const weeklyBonus = 20000; //define a weekly reward here
        const oldProfile = await client.cache.getCurrency(message.author.id);
        message.channel.send(embed.setDescription(`You redeemed your daily coins of \`${weeklyBonus.toLocaleString()}\`$\n**Wallet:** \`${oldProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(oldProfile.wallet + weeklyBonus).toLocaleString()}\`$`));
        return client.cache.currency.set(message.author.id, ({
            userID: message.author.id,
            bank: oldProfile.bank,
            wallet: oldProfile.wallet + weeklyBonus,
            messageCount: oldProfile.messageCount + 1,
            passive: oldProfile.passive
        } as Profile));
    };
};