import Command, { CommandRunner } from '@root/Command';

export default class DepositCommand extends Command {
    constructor() {
        super({
            name: "deposit",
            aliases: ["dep"],
            description: "deposit money of your wallet into your bank",
            category: "currency",
            usage: "deposit <amount of coins/\"max\"/\"all\">"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const commandUsage: string = `${prefix}${this.usage}`;
        const userProfile = await client.cache.getCurrency(message.author.id);
        await client.cache.increaseCurrencyMessageCount(message.author.id);
        if (userProfile.wallet == 0) return message.channel.send(client.createRedEmbed(true, commandUsage)
            .setTitle("💰 Currency Manager")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('You cannot deposit any coins with an empty wallet!'));
        if ((isNaN((args[0] as unknown as number)) && args[0] != 'all' && args[0] != 'max') || !args[0]) return message.channel.send(client.createRedEmbed(true, commandUsage)
            .setTitle("💰 Currency Manager")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('You have to provide an amount of coins, `max` or `all`!'));
        if (userProfile.wallet < parseInt(args[0])) return message.channel.send(client.createRedEmbed(true, commandUsage)
            .setTitle("💰 Currency Manager")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('You cannot deposit more money in your wallet than your have!'));
        if (parseInt(args[0]) == 0) return message.channel.send(client.createRedEmbed(true, commandUsage)
            .setTitle("💰 Currency Manager")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('You have to deposit atleast `1`$!'));
        if (args[0] == 'all' || args[0] == 'max') return deposit(userProfile.wallet);
        if (!isNaN((args[0] as unknown as number))) return deposit(parseInt(args[0]));
        async function deposit(number: number) {
            message.channel.send(client.createGreenEmbed()
                .setDescription(`You deposited ${number == userProfile.wallet ? 'your' : `\`${number.toLocaleString()}\`$`} ${number == userProfile.wallet ? 'hole wallet' : 'of your wallet'} into your bank!
                **Wallet:** \`${userProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.wallet - number).toLocaleString()}\`$
                **Bank:** \`${userProfile.wallet.toLocaleString()}\`$ ${client.arrowEmoji} \`${(userProfile.bank + number).toLocaleString()}\`$`)
                .setAuthor(`💰 ${message.author.username} deposits money to their bank!`, message.author.displayAvatarURL({ dynamic: true })));
            await client.cache.increaseBalance(message.author.id, "wallet", -number);
            await client.cache.increaseBalance(message.author.id, "bank", number);
        };
    };
};