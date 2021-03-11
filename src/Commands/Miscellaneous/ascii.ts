import Command, { CommandRunner } from "@root/Command";
import figlet from "figlet";

export default class AsciiCommand extends Command {
    constructor() {
        super({
            name: "ascii",
            description: "returns a letter written in ascii style",
            category: "miscellaneous",
            usage: "ascii <text>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: "Ascii Manager", description: "You need to provide a text to convert!" }, this.usage);
        return figlet(args.join(" "), (err, res) => {
            if (err) return client.createArgumentError(message, { title: "Ascii Manager", description: `Cannot convert \`${args.join(" ")}\`!`}, this.usage);
            if (res) return message.channel.send(client.createEmbed().setDescription(`\`\`\`${res}\`\`\``));
        });
    };
};
