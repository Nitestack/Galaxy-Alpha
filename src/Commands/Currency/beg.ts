import Command from '@root/Command';
import Profile from '@models/profile';
import { MessageEmbed } from 'discord.js';
import GalaxyAlpha from '@root/Client';

export default class BegCommand extends Command {
	constructor() {
		super({
			name: "beg",
			description: "beg for some coins",
			category: "currency",
			cooldown: 15
		});
	};
	async run(client: GalaxyAlpha, message, args, prefix) {
		const probabilityOfBeg = Math.round(client.util.getRandomArbitrary(1, 10));
		const begCoins = Math.round(client.util.getRandomArbitrary(100, 400));
		const list = ['HydraNhani', 'Dank Wario', 'Julien Bam', 'Mr. Krabs', 'Scrooge McDuck', 'TaiChampion', 'HydraNinjaX', 'MiTH_Löwe',];
		const noCoins = ['Here, take this non-existent coins!', 'Gave you NOTHING', "Don't beg!", "Go working!"];
		const getCoins = [`Here, \`${begCoins}\`$ for you!`, `Gave you \`${begCoins}\`$`];
		const embed: MessageEmbed = client.createEmbed().setAuthor(`💰 ${message.author.username} is begging for coins!`, message.author.displayAvatarURL());
		if (!client.cache.currency.has(message.author.id)) {
			await Profile.findOne({
				profileID: message.author.id
			}, {}, {}, (err, userProfile) => {
				if (err) return console.log(err);
				if (!userProfile) client.cache.currency.set(message.author.id, {
					userID: message.author.id,
					messageCount: 0,
					bank: 0,
					wallet: 0
				});
				if (userProfile) client.cache.currency.set(message.author.id, {
					userID: message.author.id,
					bank: userProfile.bank,
					wallet: userProfile.wallet,
					messageCount: userProfile.messageCount
				});
			});
		};
		if (probabilityOfBeg >= 6) {
			message.channel.send(embed.setDescription(`**${list[Math.round(client.util.getRandomArbitrary(0, list.length - 1))]}:** ${getCoins[Math.round(client.util.getRandomArbitrary(0, getCoins.length - 1))]}\n**Wallet:** \`${client.cache.currency.get(message.author.id).wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(client.cache.currency.get(message.author.id).wallet + begCoins).toLocaleString()}\`$`));
		} else {
			message.channel.send(embed.setDescription(`**${list[Math.round(client.util.getRandomArbitrary(0, list.length - 1))]}:** ${noCoins[Math.round(client.util.getRandomArbitrary(0, noCoins.length - 1))]}\n**Wallet:** \`${client.cache.currency.get(message.author.id).wallet.toLocaleString()}\`$`));
		};
		client.cache.currency.set(message.author.id, {
			userID: message.author.id,
			messageCount: client.cache.currency.get(message.author.id).messageCount + 1,
			bank: client.cache.currency.get(message.author.id).bank,
			wallet: client.cache.currency.get(message.author.id).wallet + (probabilityOfBeg >= 6 ? begCoins : 0)
		});
	};
};