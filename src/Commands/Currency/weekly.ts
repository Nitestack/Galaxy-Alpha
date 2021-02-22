import Command, { CommandRunner } from '@root/Command';

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
        await client.cache.increaseCurrencyMessageCount(message.author.id);
        const embed = client.createGreenEmbed().setAuthor(`💰 ${message.author.username} redeemed their daily reward!`, message.author.displayAvatarURL({ dynamic: true }));
        const weeklyBonus = 20000; //define a weekly reward here
        const oldProfile = await client.cache.getCurrency(message.author.id);
        message.channel.send(embed.setDescription(`You redeemed your daily coins of \`${weeklyBonus.toLocaleString()}\`$\n**Wallet:** \`${oldProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(oldProfile.wallet + weeklyBonus).toLocaleString()}\`$`));
        await client.cache.increaseBalance(message.author.id, "wallet", weeklyBonus);
    };
};