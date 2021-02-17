import Command, { CommandRunner } from '@root/Command';
import { Profile } from "@models/profile";

export default class BegCommand extends Command {
	constructor() {
		super({
			name: "beg",
			description: "beg for some coins",
			category: "currency",
			cooldown: "15s"
		});
	};
	run: CommandRunner = async (client, message, args, prefix) => {
		const probabilityOfBeg = Math.round(client.util.getRandomArbitrary(1, 10));
		const begCoins = Math.round(client.util.getRandomArbitrary(100, 400));
		const list = ['HydraNhani', 'Dank Wario', 'Julien Bam', 'Mr. Krabs', 'Scrooge McDuck', 'TaiChampion', 'HydraNinjaX', 'MiTH_Löwe'];
		const noCoins = ['Here, take this non-existent coins!', 'Gave you NOTHING', "Don't beg!", "Go working!"];
		const getCoins = [`Here, \`${begCoins}\`$ for you!`, `Gave you \`${begCoins}\`$`];
		const embed = client.createEmbed().setAuthor(`💰 ${message.author.username} is begging for coins!`, message.author.displayAvatarURL());
		const userProfile = await client.cache.getCurrency(message.author.id);
		if (probabilityOfBeg >= 6) message.channel.send(embed.setDescription(`**${list[Math.round(client.util.getRandomArbitrary(0, list.length - 1))]}:** ${getCoins[Math.round(client.util.getRandomArbitrary(0, getCoins.length - 1))]}\n**Wallet:** \`${userProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.wallet + begCoins).toLocaleString()}\`$`));
		else message.channel.send(embed.setDescription(`**${list[Math.round(client.util.getRandomArbitrary(0, list.length - 1))]}:** ${noCoins[Math.round(client.util.getRandomArbitrary(0, noCoins.length - 1))]}\n**Wallet:** \`${userProfile.wallet.toLocaleString()}\`$`));
		client.cache.currency.set(message.author.id, ({
			...userProfile,
			messageCount: userProfile.messageCount + 1,
			wallet: userProfile.wallet + (probabilityOfBeg >= 6 ? begCoins : 0)
		} as Profile));
	};
};