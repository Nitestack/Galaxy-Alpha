import Command, { CommandRunner } from "@root/Command";
import { GuildMember } from "discord.js";

export default class RobCommand extends Command {
    constructor() {
        super({
            name: "rob",
            aliases: ["bankrob"],
            description: "rob a user to get money or lose your money",
            category: "currency",
            cooldown: "5m",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const oldProfile = await client.cache.getCurrency(message.author.id);
        await client.cache.increaseCurrencyMessageCount(message.author.id);
        const minimum = 1000;
        if (oldProfile.passive) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to disable passive mode to rob!" }, this.usage);
        if (oldProfile.wallet < minimum) return client.createArgumentError(message, { title: "Currency Manager", description: `You must have atleast \`${minimum}\`$ in your wallet to rob!` }, this.usage);
        let member: GuildMember;
        if (message.mentions.users.first() && message.guild.members.cache.filter(member => !member.user.bot).has(message.mentions.users.first().id)) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).has(args[0])) member = message.guild.members.cache.get(args[0]);
        if (!member) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to mention an user or provide an user ID!" }, this.usage);
        if (member.id == message.author.id) return client.createArgumentError(message, { title: "Currency Manager", description: "You cannot rob yourself!" }, this.usage);
        if ((await client.cache.getCurrency(member.id)).passive) return client.createArgumentError(message, { title: "Currency Manager", description: "This user is in passive mode!" }, this.usage);
        if ((await client.cache.getCurrency(member.id)).bank < minimum) return client.createArgumentError(message, { title: "Currency Manager", description: `The user must have atleast \`${minimum}\`$ in their bank!` }, this.usage);
        const shouldRob = Math.floor(client.util.getRandomArbitrary(0, 2));
        const profile = await client.cache.getCurrency(message.author.id);
        if (shouldRob == 1) {
            const memberProfile = await client.cache.getCurrency(member.id);
            const winCoins = Math.floor(client.util.getRandomArbitrary(1, memberProfile.bank / 10));
            client.createSuccess(message, { title: "Currency Manager", description: `You won \`${winCoins.toLocaleString()}\`$!\n**Wallet:** \`${profile.wallet.toLocaleString()}\` ${client.arrowEmoji} \`${(profile.wallet + winCoins).toLocaleString()}\`` });
            await client.cache.increaseBalance(message.author.id, "wallet", winCoins);
            await client.cache.increaseBalance(member.id, "bank", -winCoins);
        } else if (shouldRob == 2) {
            return message.channel.send(client.createRedEmbed()
                .setTitle("Currency Manager")
                .setDescription("You got nothing!"));
        } else {
            const lostCoins = Math.ceil(client.util.getRandomArbitrary(1, profile.wallet / 9));
            message.channel.send(client.createRedEmbed()
                .setTitle("Currency Manager")
                .setDescription(`You lost \`${lostCoins.toLocaleString()}\`$!\n**Wallet:** \`${profile.wallet.toLocaleString()}\` ${client.arrowEmoji} \`${(profile.wallet - lostCoins).toLocaleString()}\``));
            await client.cache.increaseBalance(message.author.id, "wallet", -lostCoins);
            await client.cache.increaseBalance(member.id, "bank", lostCoins);
        };
    };
};