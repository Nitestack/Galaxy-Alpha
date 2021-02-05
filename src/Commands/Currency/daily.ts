import Command, { CommandRunner } from '@root/Command';

export default class DailyCommand extends Command {
    constructor() {
        super({
            name: "daily",
            description: "claim your daily coins",
            category: "currency",
            cooldown: "1d"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const embed = client.createGreenEmbed().setAuthor(`💰 ${message.author.username} redeemed their daily reward!`, message.author.displayAvatarURL());
        const dailyBonus = 2000; //define a daily reward here
        let oldProfile = await client.cache.getCurrency(message.author.id);
        message.channel.send(embed.setDescription(`You redeemed your daily coins of \`${dailyBonus.toLocaleString()}\`$\n**Wallet:** \`${oldProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(oldProfile.wallet + dailyBonus).toLocaleString()}\`$`));
        return client.cache.currency.set(message.author.id, {
            userID: message.author.id,
            bank: oldProfile.bank,
            wallet: oldProfile.wallet + dailyBonus,
            messageCount: oldProfile.messageCount + 1
        });
    };
};