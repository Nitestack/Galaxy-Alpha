import Command, { CommandRunner } from '@root/Command';

export default class WorkCommand extends Command {
    constructor() {
        super({
            name: "work",
            description: "work to get payed for money",
            category: "currency",
            cooldown: "1h"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        await client.cache.increaseCurrencyMessageCount(message.author.id);
        const wage = Math.round(client.util.getRandomArbitrary(1000, 1500));
        const userProfile = await client.cache.getCurrency(message.author.id);
        const jobs: Array<string> = ['Cosplayer', 'YouTuber', 'Twitch Streamer', 'Programmer', 'Teacher', 'Game Developer', 'Software Developer', 'Police Officer', 'Cleainig Staff'];
        message.channel.send(client.createGreenEmbed()
            .setAuthor(`💰 ${message.author.username} was working!`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`You worked as **${jobs[Math.round(client.util.getRandomArbitrary(0, jobs.length - 1))]}** and got payed \`${wage.toLocaleString()}\`$!
            **Wallet:** \`${userProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.wallet + wage).toLocaleString()}\`$`));
        await client.cache.increaseBalance(message.author.id, "wallet", wage);
    };
};