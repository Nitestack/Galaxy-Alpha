import Command from '@root/Command';
import Profile from '@models/profile';

module.exports = class WorkCommand extends Command {
    constructor(client) {
        super(client, {
            name: "work",
            description: "work to get payed for money",
            category: "currency",
            cooldown: 3600
        });
    };
    async run(client, message, args, prefix) {
        const embed = client.createGreenEmbed().setAuthor(`💰 ${message.author.username} was working!`, message.author.displayAvatarURL());
        const wage = Math.round(client.util.getRandomArbitrary(1000, 1500));
        let oldWallet: number;
        const jobs: Array<string> = ['Cosplayer', 'YouTuber', 'Twitch Streamer', 'Programmer', 'Teacher', 'Game Developer', 'Software Developer', 'Police Officer', 'Cleainig Staff'];

        await Profile.findOne({}, {}, {}, (err, userProfile) => {
            if (err) return console.log(err);
            if (!userProfile) {
                return oldWallet = 0;
            };
            return oldWallet = userProfile.wallet;
        });
        await Profile.findOneAndUpdate({
            profileID: message.author.id
        }, {
            $inc: {
                bank: 0,
                wallet: wage,
                messageCount: 1
            }
        }, {
            upsert: true
        });
        await Profile.findOne({
            profileID: message.author.id
        }, {}, {}, (err, userProfile) => {
            if (err) return console.log(err);
            return message.channel.send(embed.setDescription(`You worked as **${jobs[Math.round(client.util.getRandomArbitrary(0, jobs.length - 1))]}** and got payed \`${wage.toLocaleString()}\`$!
            **Wallet:** \`${oldWallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${userProfile.wallet.toLocaleString()}\`$`));
        });
    };
};