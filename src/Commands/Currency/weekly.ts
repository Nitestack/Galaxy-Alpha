import Command from '@root/Command';
import Profile from '@models/profile';

module.exports = class WeeklyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "weekly",
            description: "claim your weekly coins",
            category: "currency",
            cooldown: 60 * 60 * 24 * 7
        });
    };
    async run(client, message, args, prefix) {
        const embed = client.createGreenEmbed().setAuthor(`💰 ${message.author.username} redeemed their weekly reward!`, message.author.displayAvatarURL());
        const weeklyBonus = 20000; //define a weekly reward here
        let oldProfile: number;
        await Profile.findOne({
            profileID: message.author.id
        }, {}, {}, (err, userProfile) => {
            if (err) return console.log(err);
            if (!userProfile) {
                return oldProfile = 0;
            };
            return oldProfile = userProfile.wallet;
        });
        await Profile.findOneAndUpdate({
            profileID: message.author.id,
        }, {
            profileID: message.author.id,
            $inc: {
                wallet: weeklyBonus,
                messageCount: 1,
                bank: 0
            }
        }, {
            upsert: true
        });
        await Profile.findOne({
            profileID: message.author.id
        }, (err, userProfile) => {
            if (err) return console.log(err);
            if (!userProfile) return;
            return message.channel.send(embed.setDescription(`You redeemed your weekly coins of \`${weeklyBonus.toLocaleString()}\`$\n**Wallet:** \`${oldProfile.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.wallet).toLocaleString()}\`$`));
        });
    };
};