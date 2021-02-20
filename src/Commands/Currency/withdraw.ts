import Command, { CommandRunner } from '@root/Command';

export default class WithdrawCommand extends Command {
    constructor() {
        super({
            name: "withdraw",
            description: "withdraw money of your bank",
            category: "currency",
            usage: "withdraw <amount of coins/\"max\"/\"all\">",
            aliases: ["with"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const commandUsage = `${prefix}${this.usage}`;
        const userProfile = await client.cache.getCurrency(message.author.id);
        await client.cache.increaseCurrencyMessageCount(message.author.id);
        if (userProfile.bank == 0) return message.channel.send(client.createRedEmbed(true, commandUsage)
            .setTitle("💰 Currency Manager")
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription('You cannot withdraw any coins with an empty bank'));
        if ((isNaN((args[0] as unknown as number)) && args[0] != 'all' && args[0] != 'max') || !args[0]) return message.channel.send(client.createRedEmbed(true, commandUsage)
            .setTitle("💰 Currency Manager")
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription('You have to provide an amount of coins, `max` or `all`!'));
        if (userProfile.bank < parseInt(args[0])) return message.channel.send(client.createRedEmbed(true, commandUsage)
            .setTitle("💰 Currency Manager")
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription('You cannot withdraw more money of you bank than you have!'));
        if (parseInt(args[0]) == 0) return message.channel.send(client.createRedEmbed(true, commandUsage)
            .setTitle("💰 Currency Manager")
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription('You have to withdraw atleast `1`$!'));
        const newProfile = await client.cache.getCurrency(message.author.id);
        if (args[0] == 'all' || args[0] == 'max') return withdraw(newProfile.bank);
        if (!isNaN((args[0] as unknown as number))) return withdraw(parseInt(args[0]));
        async function withdraw(number: number) {
            message.channel.send(client.createGreenEmbed()
                .setDescription(`You withdrawed ${number == newProfile.bank ? 'hole bank' : `\`${number.toLocaleString()}\`$ of you bank`}!
                **Wallet:** \`${newProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(newProfile.wallet + number).toLocaleString()}\`$
                **Bank:** \`${newProfile.bank.toLocaleString()}\`$ ${client.arrowEmoji} \`${(newProfile.bank - number).toLocaleString()}\`$`)
                .setAuthor(`💰 ${message.author.username} withdraws money of their bank!`, message.author.displayAvatarURL()));
            await client.cache.increaseBalance(message.author.id, "bank", -number);
            await client.cache.increaseBalance(message.author.id, "wallet", number);
        };
    };
};