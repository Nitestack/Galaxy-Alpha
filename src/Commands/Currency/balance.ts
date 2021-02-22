import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';

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
		if (message.mentions.users.first() && client.users.cache.filter(user => !user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
		if (args[0] && client.users.cache.filter(user => !user.bot).has(args[0])) user = client.users.cache.get(args[0]);
		await client.cache.increaseCurrencyMessageCount(message.author.id);
		const userProfile = await client.cache.getCurrency(user.id);
		return message.channel.send(client.createEmbed()
			.setAuthor(`💰 ${user.username}'s Balance`, user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setDescription(`**Wallet:** \`${userProfile.wallet.toLocaleString()}\`$\n**Bank:** \`${userProfile.bank.toLocaleString()}\`$`));
	};
};