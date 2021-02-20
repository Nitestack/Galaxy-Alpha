import Command, { CommandRunner } from "@root/Command";
import { User } from "discord.js";

export default class ShareCommand extends Command {
    constructor(){
        super({
            name: "share",
            description: "share some coins",
            category: "currency",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const twoWeeksInMS = 1000 * 60 * 60 * 24 * 7 * 2;
        await client.cache.increaseCurrencyMessageCount(message.author.id);
        const userProfile = await client.cache.getCurrency(message.author.id);
        if (message.createdTimestamp < userProfile.profileCreatedAt.getTime() + twoWeeksInMS) return client.createArgumentError(message, { title: "Currency Manager", description: `Your account is too new to share coins! Please wait **${client.humanizer(userProfile.profileCreatedAt.getTime() + twoWeeksInMS - message.createdTimestamp, {
            round: true,
            units: ["w", "d", "h", "m", "s"]
        })}**!`}, this.usage);
        let user: User;
        if (message.mentions.users.first() && message.guild.members.cache.filter(member => !member.user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).has(args[0])) user = client.users.cache.get(args[0]);
        if (!user) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to mention an user or provide an user ID!" }, this.usage);
        let sharedCoins: number;
        if (!isNaN(args[0] as unknown as number)) sharedCoins = parseInt(args[1]);
        if (!sharedCoins) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to provide an amount of coins you want to share!" }, this.usage);
        if (sharedCoins > (await client.cache.getCurrency(message.author.id)).wallet) return client.createArgumentError(message, { title: "Currency Manager", description: "You provided a higher amount of coins than you have!" }, this.usage);
        const authorProfile = await client.cache.getCurrency(message.author.id);
        client.cache.currency.set(message.author.id, {
            ...authorProfile,
            wallet: authorProfile.wallet - sharedCoins
        });
        client.cache.currency.set(user.id, {
            ...userProfile,
            wallet: userProfile.wallet + sharedCoins
        });
        return client.createSuccess(message, { title: "Currency Manager", description: `You successfully gave ${user} \`${sharedCoins.toLocaleString()}\`$!
        **Wallet:** \`${authorProfile.wallet.toLocaleString()}\` ${client.arrowEmoji} \`${(authorProfile.wallet - sharedCoins).toLocaleString()}\``});
    };
};