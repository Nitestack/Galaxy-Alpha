import Command, { CommandRunner } from "@root/Command";

export default class CoinFlipCommand extends Command {
    constructor(){
        super({
            name: "coinflip",
            description: "flips a coin",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const headOrNumberPercentage = Math.floor(Math.random() * 2) == 0;
        const headOrNumber = ["head", "number"];
        const flips = Math.round(client.util.getRandomArbitrary(10, 40));
        return message.channel.send(client.createEmbed()
            .setTitle(":coin: Coinflip")
            .setDescription(`Coin has flipped \`${flips}\` times!\nYou got **${headOrNumber[headOrNumberPercentage ? 0 : 1]}**!`));
    };
};