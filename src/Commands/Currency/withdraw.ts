import Command from '@root/Command';
import Profile from '@models/profile';
import mongoose from 'mongoose';

module.exports = class WithdrawCommand extends Command {
    constructor(client) {
        super(client, {
            name: "withdraw",
            description: "withdraw money of your bank",
            category: "currency",
            usage: "withdraw <amount of coins/\"max\"/\"all\">",
            aliases: ["with"]
        });
    };
    async run(client, message, args, prefix) {
        const commandUsage = `${prefix}${this.usage}`;
        let oldWallet: number;
        let oldBank: number;
        const userProfile = await Profile.findOne({
            profileID: message.author.id,
        }, {}, {}, (err, profile) => {
            if (err) return console.log(err);
            if (!profile) {
                const newProfile = new Profile({
                    _id: mongoose.Types.ObjectId(),
                    profileID: message.author.id,
                    wallet: 0,
                    bank: 0,
                    messageCount: 1,
                });
                newProfile.save().catch(err => console.error(err));
                oldWallet = 0;
                oldBank = 0;
                return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL()).setDescription("You don't have any coins to withdraw!"));
            }
            oldWallet = profile.wallet;
            oldBank = profile.bank;
        });
        await Profile.findOneAndUpdate(
            {
                profileID: message.author.id,
            },
            {
                $inc: {
                    messageCount: 1,
                }
            }
        ).catch(err => console.log(err));

        if (userProfile.bank == 0)
            return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription('You cannot withdraw any coins with an empty bank'));
        if ((isNaN(args[0]) && args[0] != 'all' && args[0] != 'max') || !args[0])
            return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription('You have to provide an amount of coins, `max` or `all`!'));
        if (userProfile.bank < parseInt(args[0]))
            return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription('You cannot withdraw more money of you bank than you have!'));
        if (parseInt(args[0]) == 0)
            return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription('You have to withdraw atleast `1`$!'));
        if (args[0] == 'all' || args[0] == 'max') return withdraw(userProfile.bank);
        if (!isNaN(args[0])) return withdraw(parseInt(args[0]));
        async function withdraw(number: number) {
            await Profile.findOneAndUpdate({
                profileID: message.author.id,
            }, {
                $inc: {
                    messageCount: 0,
                    bank: -number,
                    wallet: number,
                }
            }).catch(err => console.log(err));
            await Profile.findOne({
                profileID: message.author.id
            }, {}, {}, (err, userProfile) => {
                if (err) return console.log(err);
                return message.channel.send(client.createGreenEmbed()
                    .setDescription(`You withdrawed ${number == oldBank ? 'hole bank' : `\`${number.toLocaleString()}\`$ of you bank`}!
                **Bank:** \`${oldBank.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.bank).toLocaleString()}\`$
                **Wallet:** \`${oldWallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.wallet).toLocaleString()}\`$`)
                    .setAuthor(`💰 ${message.author.username} withdraws money of their bank!`, message.author.displayAvatarURL()));
            });
        };
    };
};