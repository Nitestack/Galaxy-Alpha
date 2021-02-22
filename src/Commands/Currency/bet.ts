import Command, { CommandRunner } from "@root/Command";

export default class BetCommand extends Command {
	constructor() {
		super({
			name: "bet",
			description: "win some coins or lose your bet",
			category: "currency",
			usage: "bet <amount of coins/\"max\"/\"all\"/\"half\">"
		});
	};
	run: CommandRunner = async (client, message, args, prefix) => {
		const commandUsage: string = `${prefix}${this.usage}`;
		const minimum = 200;
		const userProfile = await client.cache.getCurrency(message.author.id);
		await client.cache.increaseCurrencyMessageCount(message.author.id);
		const errorEmbed = client.createRedEmbed(true, commandUsage).setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })).setTitle("💰 Currency Manager");
		if (userProfile.wallet < minimum) return message.channel.send(errorEmbed.setDescription(`You must have atleast \`${minimum}\`$ in your wallet!`));
		if (!args[0]) return message.channel.send(errorEmbed.setDescription('You have to provide a bet!'));
		if (isNaN((args[0] as unknown as number)) && args[0].toLowerCase() != 'all' && args[0].toLowerCase() != 'max' && args[0].toLowerCase() != "half") return message.channel.send(errorEmbed.setDescription('You have to provide a number, `max` or `all`!'));
		if (parseInt(args[0]) < minimum) return message.channel.send(errorEmbed.setDescription(`You have to bet atleast \`${minimum}\`$!`));
		if (parseInt(args[0]) > userProfile.wallet) return message.channel.send(errorEmbed.setDescription('You cannot bet more than you have in your wallet!'));
		if (args[0].toLowerCase() == 'all' || args[0].toLowerCase() == 'max') return bet(userProfile.wallet);
		if (args[0].toLowerCase() == "half") return bet(userProfile.wallet / 2);
		else return bet(parseInt(args[0]));
		async function bet(number: number) {
			const oldProfile = await client.cache.getCurrency(message.author.id);
			const luckNumber: boolean = Math.random() < 0.5;
			const embed = client.createGreenEmbed().setAuthor(`💰 ${message.author.username} bets some coins!`, message.author.displayAvatarURL({ dynamic: true }));
			if (luckNumber) {
				const winNumber = Math.round(client.util.getRandomArbitrary(30, 150));
				const win = Math.round(number * (winNumber / 100));
				message.channel.send(embed.setDescription(`You won \`${win.toLocaleString()}\`$\n**Percent Won:** \`${winNumber}\`%\n**Wallet:** \`${oldProfile.wallet.toLocaleString()}\` ${client.arrowEmoji} \`${(oldProfile.wallet + win).toLocaleString()}\`$`));
				return client.cache.increaseBalance(message.author.id, "wallet", win);
			} else {
				message.channel.send(client.createRedEmbed().setAuthor(`💰 ${message.author.username} bets some coins!`, message.author.displayAvatarURL({ dynamic: true })).setDescription(`You lost \`${number.toLocaleString()}\`$!\n**Wallet:** \`${oldProfile.wallet.toLocaleString()}\` ${client.arrowEmoji} \`${(oldProfile.wallet - number).toLocaleString()}\`$`));
				return client.cache.increaseBalance(message.author.id, "wallet", -number);
			};
		};
	};
};