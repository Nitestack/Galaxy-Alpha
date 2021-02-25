import Command, { CommandRunner } from "@root/Command";

export default class DicesCommand extends Command {
    constructor() {
        super({
            name: "dices",
            description: "rolles some dices",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const dices: number = args[0] && !isNaN(args[0] as unknown as number) ? parseInt(args[0]) : 2;
        for (let i = 0; i < dices; i++) {
            const number: number = Math.floor(client.util.getRandomArbitrary(1, 6));
            let picture: string;
            switch (number) {
                case 1:
                    picture = "https://cdn.discordapp.com/attachments/813791647799967764/813792986265681970/dice-black-white-flat-illustration-outline-numbers-one-to-six-vector-image-159489872_2.jpg";
                    break;
                case 2:
                    picture = "https://cdn.discordapp.com/attachments/813791647799967764/813792987456339998/dice-black-white-flat-illustration-outline-numbers-one-to-six-vector-image-159489872_3.jpg";
                    break;
                case 3:
                    picture = "https://cdn.discordapp.com/attachments/813791647799967764/813792988689203280/dice-black-white-flat-illustration-outline-numbers-one-to-six-vector-image-159489872_4.jpg";
                    break;
                case 4:
                    picture = "https://cdn.discordapp.com/attachments/813791647799967764/813792991554437220/dice-black-white-flat-illustration-outline-numbers-one-to-six-vector-image-159489872.jpg";
                    break;
                case 5:
                    picture = "https://cdn.discordapp.com/attachments/813791647799967764/813792990442815528/dice-black-white-flat-illustration-outline-numbers-one-to-six-vector-image-159489872_5.jpg";
                    break;
                case 6:
                    picture = "https://cdn.discordapp.com/attachments/813791647799967764/813792985145409536/dice-black-white-flat-illustration-outline-numbers-one-to-six-vector-image-159489872_1.jpg";
                    break;
            };
            message.channel.send(client.createEmbed()
                .setTitle("Dice")
                .setDescription(`You got \`${number}\`!`)
                .setThumbnail(picture));
        };
    };
};