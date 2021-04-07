import Command, { CommandRunner } from "@root/Command";
import translate from "@iamtraction/google-translate";

export default class extends Command {
    constructor() {
        super({
            name: "translate",
            description: "translates a query",
            category: "utility",
            args: [{
                type: "text",
                errorMessage: "📝 Translator Manager",
                errorTitle: "You have to provide a query to translate!"
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const results = await translate(args[0], {
            to: "en"
        });
        console.log(results);
        return message.channel.send(client.createEmbed()
            .setTitle("📝 Translator")
            .addField("Input", `Language: \`${results.from.language.iso.toUpperCase()}\`
            To Translate: \`${args[0]}\`
            Autocorrection: \`${results.from.text.autoCorrected ? results.from.text.value.split("[")[1].split("]")[0] : "No auto correction"}\``)
            .addField("Output into EN", `${results.text}`));
    };
};