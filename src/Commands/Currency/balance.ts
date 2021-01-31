import Command from '@root/Command';
import { User } from 'discord.js';
import Profile from '@models/profile';

module.exports = class BalanceCommand extends Command {
	constructor(client) {
		super(client, {
			name: "balance",
			aliases: ["bal"],
			description: "shows the current balance of an user",
			category: "currency",
			usage: "balance [@User/User ID]"
		});
	};
	async run(client, message, args, prefix) {
		let user: User = message.author;
		if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
		if (args[0] && client.users.cache.filter(user => !user.bot).get(args[0])) user = client.users.cache.filter(user => !user.bot).get(args[0]);
		await Profile.findOneAndUpdate({
			profileID: user.id
		}, {
			profileID: user.id,
			$inc: {
				bank: 0,
				wallet: 0,
				messageCount: user.id != message.author.id ? 0 : 1
			}
		}, {
			upsert: true
		});
		if (user.id != message.author.id) {
			await Profile.findOneAndUpdate({
				profileID: message.author.id
			}, {
				$inc: {
					bank: 0,
					wallet: 0,
					messageCount: 1
				}
			}, {
				upsert: true
			});
		};
		await Profile.findOne({
			profileID: user.id
		}, {}, {}, (err, userProfile) => {
			if (err) return console.log(err);
			if (!userProfile) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle('Balance Manager').setDescription('An error occurred while you used this command! Please try again!'));
			return message.channel.send(client.createEmbed()
				.setAuthor(`💰 ${user.username}'s Balance`, user.displayAvatarURL())
				.setThumbnail(user.displayAvatarURL())
				.setDescription(`**Wallet:** \`${userProfile.wallet.toLocaleString()}\`$\n**Bank:** \`${userProfile.bank.toLocaleString()}\`$`));
		});
	};
};