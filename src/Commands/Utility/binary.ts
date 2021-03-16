import Command, { CommandRunner } from "@root/Command";
import axios from "axios";

export default class BinaryCommand extends Command {
    constructor() {
        super({
            name: "binary",
            description: "encodes or decodes a query",
            category: "miscellaneous",
            args: [{
                type: "certainString",
                required: true,
                errorTitle: "Binary Manager",
                errorMessage: "You have to say, if you want to encode or decode the query!",
                index: 1,
                certainStrings: ["decode", "encode"]
            }, {
                type: "text",
                required: true,
                errorTitle: "Binary Manager",
                errorMessage: "You have to provide a query!",
                index: 2
            }],
            usage: "binary <encode/decode> <query>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const result = await axios.get(`https://some-random-api.ml/binary?${args[0].toLowerCase() == "encode" ? "text" : "decode"}=${encodeURIComponent(args[1])}`);
        if (result.status != 200) return client.createArgumentError(message, { title: "Binary Manager", description: `Cannot ${args[0].toLowerCase() == "encode" ? "encode" : "decode"} the query!`}, this.usage);
        return message.channel.send(client.createEmbed()
            .setTitle("📟 Binary")
            .setDescription(`\`\`\`${args[0].toLowerCase() == "encode" ? result.data.binary : result.data.text}\`\`\``));
    };
};
