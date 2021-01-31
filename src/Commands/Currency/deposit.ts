//2 ARGS ERRORS
import Command from '@root/Command';
import Profile from '@models/profile';
import mongoose from 'mongoose';

module.exports = class DepositCommand extends Command {
    constructor(client) {
        super(client, {
            name: "deposit",
            aliases: ["dep"],
            description: "deposit money of your wallet into your bank",
            category: "currency",
            usage: "deposit <amount of coins/\"max\"/\"all\">"
        });
    };
    async run(client, message, args, prefix) {
        const commandUsage: string = `${prefix}${this.usage}`;
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
                return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL()).setDescription("You don't have any coins to deposit!"));
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

        if (userProfile.wallet == 0)
            return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL()).setDescription('You cannot deposit any coins with an empty wallet!'));
        if ((isNaN(args[0]) && args[0] != 'all' && args[0] != 'max') || !args[0])
            return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription('You have to provide an amount of coins, `max` or `all`!'));
        if (userProfile.wallet < parseInt(args[0]))
            return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription('You cannot deposit more money in your wallet than your have!'));
        if (parseInt(args[0]) == 0)
            return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle("💰 Currency Manager").setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription('You have to deposit atleast `1`$!'));
        if (args[0] == 'all' || args[0] == 'max')
            return deposit(userProfile.wallet);
        if (!isNaN(args[0])) return deposit(parseInt(args[0]));

        async function deposit(number: number) {
            await Profile.findOneAndUpdate({
                profileID: message.author.id,
            }, {
                $inc: {
                    messageCount: 0,
                    bank: number,
                    wallet: -number,
                }
            }).catch(err => console.log(err));
            await Profile.findOne({
                profileID: message.author.id
            }, {}, {}, (err, userProfile) => {
                if (err) return console.log(err);
                return message.channel.send(client.createGreenEmbed()
                    .setDescription(`You deposited ${number == oldWallet ? 'your' : `\`${number.toLocaleString()}\`$`} ${number == oldWallet ? 'hole wallet' : 'of your wallet'} into your bank!
                    **Wallet:** \`${oldWallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.wallet).toLocaleString()}\`$
                    **Bank:** \`${oldBank.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.bank).toLocaleString()}\`$`)
                    .setAuthor(`💰 ${message.author.username} deposits money to their bank!`, message.author.displayAvatarURL()));
            });
        };
    };
};