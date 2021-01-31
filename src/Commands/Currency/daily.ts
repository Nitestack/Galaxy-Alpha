import Command from '@root/Command';
import Profile from '@models/profile';

module.exports = class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "daily",
            description: "claim your daily coins",
            category: "currency",
            cooldown: 60 * 60 * 24
        });
    };
    async run(client, message, args, prefix) {
        const embed = client.createGreenEmbed().setAuthor(`💰 ${message.author.username} redeemed their daily reward!`, message.author.displayAvatarURL());
        const dailyBonus = 2000; //define a daily reward here
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
                wallet: dailyBonus,
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
            return message.channel.send(embed.setDescription(`You redeemed your daily coins of \`${dailyBonus.toLocaleString()}\`$\n**Wallet:** \`${oldProfile.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.wallet).toLocaleString()}\`$`));
        });
    };
};