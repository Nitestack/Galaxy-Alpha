import Command, { CommandRunner } from '@root/Command';
import { inspect } from 'util';
import { create } from "sourcebin";

export default class EvalCommand extends Command {
    constructor(){
        super({
            name: "eval",
            description: "evaluates JavaScript code",
            developerOnly: true,
            usage: "eval <to eval>",
            category: "developer",
            args: [{
                type: "text",
                errorTitle: "Eval Manager",
                errorMessage: "You have to provide valid JavaScript code, that I can evaluate!",
                required: true
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const evalChannel = '817379995102085140';
        if (message.channel.type == 'dm' ? message.author.id != client.ownerID : message.channel.id != evalChannel) return;
        try {
            const evaluation = eval(args[0]);
            let output = evaluation;
            const start = process.hrtime();
            const difference = process.hrtime(start);
            if (typeof output != 'string') output = inspect(output, { depth: 2 });
            return message.channel.send(client.createEmbed()
                .addFields([{
                    name: "Evaluated",
                    value: client.util.embedFormatter.passDescription(output) ? (await create([{
                        name: "",
                        content: output,
                        language: "javascript"
                    }], {
                        title: "Evaluation",
                        description: `This is the ouput of: "${args[0]}"`
                    })).url : `\`\`\`js\n${output}\`\`\``,
                    inline: false
                }, {
                    name: `${client.developerToolsEmoji} Type of`,
                    value: `\`\`\`${typeof evaluation}\`\`\``
                }, {
                    name: "🕐 Executed in",
                    value: `${difference[0] > 0 ? `${difference[0]}s` : ""}${difference[1] / 1000000}ms`,
                    inline: false
                }, {
                    name: `${client.memberEmoji} User`,
                    value: `${message.author}`,
                    inline: false
                }, {
                    name: "🗓️ Used on",
                    value: client.util.dateFormatter(message.createdAt),
                    inline: false
                }])
                .setTitle("Eval")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true })));
        } catch (error) {
            return client.createArgumentError(message, { title: "ERROR", description: `${error}`}, this.usage);
        };
    };
};

function clean(string: string): string {
    if (typeof string == "string") return string.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else return string;
};