import Command, { CommandRunner } from "@root/Command";
import figlet from "figlet";

export default class AsciiCommand extends Command {
    constructor() {
        super({
            name: "ascii",
            description: "returns a letter written in ascii style",
            category: "miscellaneous",
            usage: "ascii <text>",
            args: [{
                type: "text",
                index: 1,
                errorMessage: "You need to provide a text to convert to ascii letters!",
                errorTitle: "Ascii Manager",
                required: true
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        return figlet(args[0], (err, res) => {
            if (err) return client.createArgumentError(message, { title: "Ascii Manager", description: `Cannot convert \`${args[0]}\`!`}, this.usage);
            if (res) return message.channel.send(client.createEmbed().setDescription(`\`\`\`${res}\`\`\``));
        });
    };
};
