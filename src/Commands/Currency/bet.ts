//3 ARGS ERROR
import Command from "@root/Command";
import { MessageEmbed } from "discord.js";
import Profile from '@models/profile';
import { getRandomArbitrary } from "@root/util";

module.exports = class BetCommand extends Command {
	constructor(client) {
		super(client, {
			name: "bet",
			description: "win some coins or lose your bet",
			category: "currency",
			usage: "bet <amount of coins/\"max\"/\"all\">"
		});
	};
	async run(client, message, args, prefix) {
		const commandUsage: string = `${prefix}${this.usage}`;
		await Profile.findOneAndUpdate({
			profileID: message.author.id
		}, {
			$inc: {
				messageCount: 1,
				bank: 0,
				wallet: 0
			}
		}, {
			upsert: true
		});
		const minimum = 200;
		const userProfile = await Profile.findOne({
			profileID: message.author.id
		}, {}, {}, (err, userProfile) => {
			if (err) return console.log(err);
			if (!userProfile || (userProfile.wallet == 0 && userProfile.bank == 0)) {
				const newProfile = new Profile({
					profileID: message.author.id,
					bank: 0,
					wallet: 0,
					messageCount: 0
				});
				newProfile.save().catch(err => console.log(err));
				return message.channel.send(client.createRedEmbed(true, commandUsage)
					.setTitle("💰 Currency Manager")
					.setDescription("You cannot bet with an empty wallet and an empty bank!"));
			};
		});
		if (userProfile.wallet < minimum && userProfile.bank >= minimum) {
			return message.channel.send(client.createRedEmbed(true, commandUsage).setAuthor(`${message.author.username}`, message.author.displayAvatarURL()).setTitle("💰 Currency Manager").setDescription(`You must have atleast \`${minimum}\`$ in your wallet!`));
		}
		if (!args[0]) {
			return message.channel.send(client.createRedEmbed(true, commandUsage).setAuthor(`${message.author.username}`, message.author.displayAvatarURL()).setTitle("💰 Currency Manager").setDescription('You have to provide a bet!'));
		}
		if (isNaN(args[0]) && !args[0].toLowerCase() == 'all' && !args[0].toLowerCase() == 'max') {
			return message.channel.send(client.createRedEmbed(true, commandUsage).setAuthor(`${message.author.username}`, message.author.displayAvatarURL()).setTitle("💰 Currency Manager").setDescription('You have to provide a number, `max` or `all`!'));
		}
		if (parseInt(args[0]) < minimum) {
			return message.channel.send(client.createRedEmbed(true, commandUsage).setAuthor(`${message.author.username}`, message.author.displayAvatarURL()).setTitle("💰 Currency Manager").setDescription(`You have to bet atleast \`${minimum}\`$!`));
		}
		if (parseInt(args[0]) > userProfile.wallet) {
			return message.channel.send(client.createRedEmbed(true, commandUsage).setAuthor(`${message.author.username}`, message.author.displayAvatarURL()).setTitle("💰 Currency Manager").setDescription('You cannot bet more than you have in your wallet!'));
		}
		if (args[0] == 'all' || args[0] == 'max') {
			return bet(userProfile.wallet);
		} else {
			return bet(parseInt(args[0]));
		};
		async function bet(number: number) {
			let oldProfile: number;
			await Profile.findOne({
				profileID: message.author.id
			}, {}, {}, (err, userProfile) => {
				if (err) return console.log(err);
				if (!userProfile) return message.channel.send(client.createRedEmbed(true, commandUsage).setAuthor(`${message.author.username}`, message.author.displayAvatarURL()).setTitle("💰 Currency Manager").setDescription('An error occurred while you used this command! Please try again!'));
				oldProfile = userProfile.wallet;
			});
			const luckNumber: Boolean = Math.random() < 0.5;
			const embed: MessageEmbed = client.createGreenEmbed().setAuthor(`💰 ${message.author.username} bets some coins!`, message.author.displayAvatarURL());
			if (luckNumber) {
				const winNumber = getRandomArbitrary(30, 150);
				const win = Math.round(number * (winNumber / 100));
				await Profile.findOneAndUpdate({
					profileID: message.author.id,
				}, {
					$inc: {
						wallet: win
					}
				}, {
					upsert: false
				});
				await Profile.findOne({
					profileID: message.author.id
				}, {}, {}, (err, userProfile) => {
					if (err) return console.log(err);
					if (!userProfile) return;
					return message.channel.send(embed.setDescription(`You won \`${win.toLocaleString()}\`$\n**Percent Won:** \`${Math.round(winNumber)}\`%\n**Wallet:** \`${oldProfile.toLocaleString()}\` ${client.arrowEmoji} \`${(userProfile.wallet).toLocaleString()}\`$`));
				});
			} else {
				await Profile.findOneAndUpdate({
					profileID: message.author.id,
				}, {
					$inc: {
						wallet: -number
					}
				}, {
					upsert: false
				});
				await Profile.findOne({
					profileID: message.author.id
				}, {}, {}, (err, userProfile) => {
					if (err) return console.log(err);
					if (!userProfile) return;
					return message.channel.send(client.createRedEmbed().setAuthor(`💰 ${message.author.username} bets some coins!`, message.author.displayAvatarURL()).setDescription(`You lost \`${number.toLocaleString()}\`$!\n**Wallet:** \`${oldProfile.toLocaleString()}\` ${client.arrowEmoji} \`${(userProfile.wallet).toLocaleString()}\`$`));
				});
			};
		};
	};
};