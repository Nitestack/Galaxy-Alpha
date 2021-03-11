import Command, { CommandRunner } from "@root/Command";

export default class ChoiceCommand extends Command {
    constructor() {
        super({
            name: "choice",
            description: "picks one of the provided choices",
            category: "miscellaneous",
            usage: "choice <choice1, choice2, choice3, ...>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!message.content.toLowerCase().includes(",")) return client.createArgumentError(message, { title: "Choice Manager", description: "You have to provide two choices atleast!" }, this.usage);
        const choices = args.join(" ").split(/,/g).map(choice => choice.trim());
        console.log(choices);
        const choiceIndex = Math.round(client.util.getRandomArbitrary(0, choices.length - 1));
        return message.channel.send(client.createEmbed()
            .setTitle("Choice")
            .setDescription(`I picked the choice: \n\`${choices[choiceIndex]}\``));
    };
};
