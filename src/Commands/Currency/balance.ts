import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';
import Profile from '@models/profile';

export default class BalanceCommand extends Command {
	constructor() {
		super({
			name: "balance",
			aliases: ["bal"],
			description: "shows the current balance of an user",
			category: "currency",
			usage: "balance [@User/User ID]"
		});
	};
	run: CommandRunner = async (client, message, args, prefix) => {
		let user: User = message.author;
		if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = message.mentions.users.first();
		if (args[0] && client.users.cache.filter(user => !user.bot).get(args[0])) user = client.users.cache.filter(user => !user.bot).get(args[0]);
		if (!client.cache.currency.has(user.id)) await Profile.findOne({
			profileID: user.id
		}, {}, {}, (err, profile) => {
			if (err) return console.log(err);
			if (!profile) client.cache.currency.set(user.id, {
				messageCount: user.id == message.author.id ? 1 : 0,
				bank: 0,
				wallet: 0,
				userID: user.id
			});
			if (profile) client.cache.currency.set(user.id, {
				messageCount: profile.messageCount + (user.id == message.author.id ? 1 : 0),
				bank: profile.bank,
				wallet: profile.wallet,
				userID: profile.profileID
			});
		});
		if (user.id != message.author.id){
			if (!client.cache.currency.has(message.author.id)) await Profile.findOne({
				profileID: message.author.id
			}, {}, {}, (err, profile) => {
				if (err) return console.log(err);
				client.cache.currency.set(message.author.id, {
					userID: message.author.id,
					bank: profile ? profile.bank : 0,
					wallet: profile ? profile.wallet : 0,
					messageCount: profile ? profile.messageCount + 1 : 1
				});
			});
			else client.cache.currency.set(message.author.id, {
				userID: message.author.id,
				bank: client.cache.currency.get(message.author.id).bank,
				wallet: client.cache.currency.get(message.author.id).wallet,
				messageCount: client.cache.currency.get(message.author.id).messageCount + 1
			});
		};
		return message.channel.send(client.createEmbed()
			.setAuthor(`💰 ${user.username}'s Balance`, user.displayAvatarURL())
			.setThumbnail(user.displayAvatarURL())
			.setDescription(`**Wallet:** \`${client.cache.currency.get(user.id).wallet.toLocaleString()}\`$\n**Bank:** \`${client.cache.currency.get(user.id).bank.toLocaleString()}\`$`));
	};
};