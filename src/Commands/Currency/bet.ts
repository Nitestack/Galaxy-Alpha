import Command, { CommandRunner } from "@root/Command";
import { Profile } from "@models/profile";

export default class BetCommand extends Command {
	constructor() {
		super({
			name: "bet",
			description: "win some coins or lose your bet",
			category: "currency",
			usage: "bet <amount of coins/\"max\"/\"all\">"
		});
	};
	run: CommandRunner = async (client, message, args, prefix) => {
		const commandUsage: string = `${prefix}${this.usage}`;
		const minimum = 200;
		const userProfile = await client.cache.getCurrency(message.author.id);
		client.cache.currency.set(message.author.id, ({
			userID: message.author.id,
			bank: userProfile.bank,
			wallet: userProfile.wallet,
			messageCount: userProfile.messageCount + 1
		} as Profile));
		const errorEmbed = client.createRedEmbed(true, commandUsage).setAuthor(`${message.author.username}`, message.author.displayAvatarURL()).setTitle("💰 Currency Manager");
		if (userProfile.wallet < minimum) return message.channel.send(errorEmbed.setDescription(`You must have atleast \`${minimum}\`$ in your wallet!`));
		if (!args[0]) return message.channel.send(errorEmbed.setDescription('You have to provide a bet!'));
		if (isNaN((args[0] as unknown as number)) && args[0].toLowerCase() != 'all' && args[0].toLowerCase() != 'max') return message.channel.send(errorEmbed.setDescription('You have to provide a number, `max` or `all`!'));
		if (parseInt(args[0]) < minimum) return message.channel.send(errorEmbed.setDescription(`You have to bet atleast \`${minimum}\`$!`));
		if (parseInt(args[0]) > userProfile.wallet) return message.channel.send(errorEmbed.setDescription('You cannot bet more than you have in your wallet!'));
		if (args[0].toLowerCase() == 'all' || args[0].toLowerCase() == 'max') return bet(userProfile.wallet);
		else return bet(parseInt(args[0]));
		async function bet(number: number) {
			const oldProfile = await client.cache.getCurrency(message.author.id);
			const luckNumber: Boolean = Math.random() < 0.5;
			const embed = client.createGreenEmbed().setAuthor(`💰 ${message.author.username} bets some coins!`, message.author.displayAvatarURL());
			if (luckNumber) {
				const winNumber = Math.round(client.util.getRandomArbitrary(30, 150));
				const win = Math.round(number * (winNumber / 100));
				message.channel.send(embed.setDescription(`You won \`${win.toLocaleString()}\`$\n**Percent Won:** \`${winNumber}\`%\n**Wallet:** \`${oldProfile.wallet.toLocaleString()}\` ${client.arrowEmoji} \`${(oldProfile.wallet + win).toLocaleString()}\`$`));
				client.cache.currency.set(message.author.id, ({
					userID: message.author.id,
					bank: oldProfile.bank,
					wallet: oldProfile.wallet + win,
					messageCount: oldProfile.messageCount
				} as Profile));
			} else {
				message.channel.send(client.createRedEmbed().setAuthor(`💰 ${message.author.username} bets some coins!`, message.author.displayAvatarURL()).setDescription(`You lost \`${number.toLocaleString()}\`$!\n**Wallet:** \`${oldProfile.wallet.toLocaleString()}\` ${client.arrowEmoji} \`${(oldProfile.wallet - number).toLocaleString()}\`$`));
				return client.cache.currency.set(message.author.id, ({
					userID: message.author.id,
					bank: oldProfile.bank,
					wallet: oldProfile.wallet - number,
					messageCount: oldProfile.messageCount
				} as Profile));
			};
		};
	};
};