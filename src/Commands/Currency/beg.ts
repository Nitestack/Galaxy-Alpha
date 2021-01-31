import Command from '@root/Command';
import Profile from '@models/profile';
import { MessageEmbed } from 'discord.js';
import mongoose from 'mongoose';

module.exports = class BegCommand extends Command {
	constructor(client) {
		super(client, {
			name: "beg",
			description: "beg for some coins",
			category: "currency",
			cooldown: 15
		});
	};
	async run(client, message, args, prefix) {
		/*function getNumber(probabilities) {
		var rnd = Math.random();
		var total = 0;
		var hit;
		for (var i = 0; i < probabilities.length; i++) {
			if (rnd > total && rnd < total + probabilities[i][0]) {
				hit = probabilities[i]
			}
			total += probabilities[i][0];
		}
		return Number((hit[1] + (Math.random() * (hit[2] - hit[1]))).toFixed(2));
	}

	var number = getNumber(
		[
			//chance, min, max
			[0.35, 0],
			[0.2, 11, 20],
			[0.3, 21, 30],
			[0.1, 31, 35]
		]
	);*/
		const probabilityOfBeg = Math.round(getRandomArbitrary(1, 10));
		const list = ['HydraNhani', 'Dank Wario', 'Julien Bam', 'Mr. Krabs', 'Scrooge McDuck', 'TaiChampion', 'HydraNinjaX', 'MiTH_Löwe',];
		const noCoins = ['Here, take this non-existent coins!', 'Gave you NOTHING', "Don't beg!", "Go working!"];
		const embed: MessageEmbed = client.createEmbed().setAuthor(`💰 ${message.author.username} is begging for coins!`, message.author.displayAvatarURL());
		let oldProfile;
		await Profile.findOne({}, {}, {}, (err, userProfile) => {
			if (err) return console.log(err);
			if (!userProfile) {
				const newProfile = new Profile({
					_id: mongoose.Types.ObjectId(),
					profileID: message.author.id,
					bank: 0,
					wallet: 0,
					messageCount: 0
				});
				newProfile.save().catch(err => console.log(err));
				return oldProfile = newProfile.wallet;
			};
			return oldProfile = userProfile.wallet;
		});

		if (probabilityOfBeg >= 6) {
			const begCoins = Math.round(getRandomArbitrary(100, 400));
			const getCoins = [`Here, \`${begCoins}\`$ for you!`, `Gave you \`${begCoins}\`$`,];
			await Profile.findOneAndUpdate({
				profileID: message.author.id
			}, {
				profileID: message.author.id,
				$inc: {
					bank: 0,
					wallet: begCoins,
					messageCount: 1
				}
			}, {
				upsert: true
			});
			await Profile.findOne({
				profileID: message.author.id
			}, {}, {}, (err, userProfile) => {
				if (err) return console.log(err);
				embed.setDescription(`**${list[Math.round(getRandomArbitrary(0, list.length - 1))]}:** ${getCoins[Math.round(getRandomArbitrary(0, getCoins.length - 1))]}\n**Wallet:** \`${oldProfile.toLocaleString()}\`$ ${client.arrowEmoji} \`${userProfile.wallet.toLocaleString()}\`$`);
				return message.channel.send(embed);
			});
		} else {
			await Profile.findOneAndUpdate({
				profileID: message.author.id
			}, {
				profileID: message.author.id,
				$inc: {
					wallet: 0,
					bank: 0,
					messageCount: 1
				}
			}, {
				upsert: true
			});
			await Profile.findOne({
				profileID: message.author.id
			}, {}, {}, (err, userProfile) => {
				if (err) return console.log(err);
				embed.setDescription(`**${list[Math.round(getRandomArbitrary(0, list.length - 1))]}:** ${noCoins[Math.round(getRandomArbitrary(0, noCoins.length - 1))]}\n**Wallet:** \`${userProfile.wallet.toLocaleString()}\`$`);
				return message.channel.send(embed);
			});
		};
	};
};

function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
};