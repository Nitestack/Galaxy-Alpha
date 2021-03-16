import Command, { CommandRunner } from '@root/Command';
import { inspect } from 'util';

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
                index: 1,
                errorTitle: "Eval Manager",
                errorMessage: "You have to provide valid JavaScript code, that I can evaluate!",
                required: true
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const evalChannel = '789116457655992350';
        if (message.channel.type == 'dm' ? message.author.id != client.ownerID : message.channel.id != evalChannel) return;
        try {
            let output = eval(args[0]);
            const start = process.hrtime();
            const difference = process.hrtime(start);
            if (typeof output != 'string') output = inspect(output, { depth: 2 });
            return message.channel.send(client.createEmbed()
                .addFields([{
                    name: "Evaluated",
                    value: `\`\`\`js\n${output}\`\`\``,
                    inline: false
                }, {
                    name: "🕐 Executed in",
                    value: `${difference[0] > 0 ? `${difference[0]}s` : ""}${difference[1] / 1000000}ms`,
                    inline: false
                }, {
                    name: `**${client.developerToolsEmoji} Type of**`,
                    value: `\`\`\`js\n${typeof output}\`\`\``,
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