import Command, { CommandRunner } from "@root/Command";
import { GuildMember } from "discord.js";
import { Profile } from "@models/profile";

export default class RobCommand extends Command {
    constructor(){
        super({
            name: "rob",
            description: "rob a user to get money or lose your money",
            category: "currency",
            cooldown: "5m"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const oldProfile = await client.cache.getCurrency(message.author.id);
        client.cache.currency.set(message.author.id, ({
            userID: message.author.id,
            bank: oldProfile.bank,
            wallet: oldProfile.wallet,
            messageCount: oldProfile.messageCount + 1,
            passive: oldProfile.passive
        } as Profile));
        const minimum = 1000;
        if (oldProfile.passive) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to disable passive mode to rob!"}, this.usage);
        if (oldProfile.wallet < minimum) return client.createArgumentError(message, { title: "Currency Manager", description:  `You must have atleast \`${minimum}\`$ in your wallet to rob!`}, this.usage);
        let member: GuildMember;
        if (message.mentions.users.first() && message.guild.members.cache.filter(member => !member.user.bot).has(message.mentions.users.first().id)) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).has(args[0])) member = message.guild.members.cache.get(args[0]);
        if (!member) return client.createArgumentError(message, { title: "Currency Manager", description: "You have to mention an user or provide an user ID!"}, this.usage);
        if (member.id == message.author.id) return client.createArgumentError(message, { title: "Currency Manager", description: "You cannot rob yourself!"}, this.usage);
        if ((await client.cache.getCurrency(member.id)).passive) return client.createArgumentError(message, { title: "Currency Manager", description: "This user is in passive mode!" }, this.usage);
        if ((await client.cache.getCurrency(member.id)).bank < minimum) return client.createArgumentError(message, { title: "Currency Manager", description: `The user must have atleast \`${minimum}\`$ in their bank!`}, this.usage);
        const shouldRob = Math.floor(client.util.getRandomArbitrary(0, 2));
        if (shouldRob == 1){
            const memberProfile = await client.cache.getCurrency(member.id);
            const winCoins = Math.floor(client.util.getRandomArbitrary(1, memberProfile.bank / 10));
            client.createSuccess(message, { title: "Currency Manager", description: `You won \`${winCoins.toLocaleString()}\`$!\n**Wallet:** \`${oldProfile.wallet.toLocaleString()}\` ${client.arrowEmoji} \`${(oldProfile.wallet + winCoins).toLocaleString()}\``});
            client.cache.currency.set(message.author.id, ({
                userID: message.author.id,
                bank: oldProfile.bank,
                wallet: oldProfile.wallet + winCoins,
                messageCount: oldProfile.messageCount,
                passive: oldProfile.passive
            } as Profile));
            const oldProfileOfMember = await client.cache.getCurrency(member.id);
            return client.cache.currency.set(member.id, ({
                userID: member.id,
                bank: oldProfileOfMember.bank - winCoins,
                wallet: oldProfileOfMember.wallet,
                messageCount: oldProfileOfMember.messageCount,
                passive: oldProfileOfMember.passive
            } as Profile));
        } else if (shouldRob == 2){
            return message.channel.send(client.createRedEmbed()
                .setTitle("Currency Manager")
                .setDescription("You got nothing!"));
        } else {
            const lostCoins = Math.ceil(client.util.getRandomArbitrary(1, oldProfile.wallet / 9));
            message.channel.send(client.createRedEmbed()
                .setTitle("Currency Manager")
                .setDescription(`You lost \`${lostCoins.toLocaleString()}\`$!\n**Wallet:** \`${oldProfile.wallet.toLocaleString()}\` ${client.arrowEmoji} \`${(oldProfile.wallet - lostCoins).toLocaleString()}\``));
            client.cache.currency.set(message.author.id, ({
                userID: message.author.id,
                bank: oldProfile.bank,
                wallet: oldProfile.wallet - lostCoins,
                messageCount: oldProfile.messageCount,
                passive: oldProfile.passive
            } as Profile));
            const oldProfileOfMember = await client.cache.getCurrency(member.id);
            return client.cache.currency.set(member.id, ({
                userID: member.id,
                bank: oldProfileOfMember.bank + lostCoins,
                wallet: oldProfileOfMember.wallet,
                messageCount: oldProfileOfMember.messageCount,
                passive: oldProfileOfMember.passive
            } as Profile));
        };
    };
};