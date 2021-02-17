import Command, { CommandRunner } from '@root/Command';
import { inspect } from 'util';

export default class EvalCommand extends Command {
    constructor(){
        super({
            name: "eval",
            description: "evaluates JavaScript code",
            developerOnly: true,
            usage: "eval <to eval>",
            category: "developer"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: "Eval Manager", description: 'You have to provide valid JavaScript code, that I can evaluate!'}, this.usage);
        const evalChannel = '789116457655992350';
        if (message.channel.type == 'dm' ? message.author.id != client.ownerID : message.channel.id != evalChannel) return;
        let output = eval(args.join(' '));
        try {
            const start = process.hrtime();
            const difference = process.hrtime(start);
            if (typeof output != 'string') output = inspect(output, { depth: 2 });
            return message.channel.send(client.createEmbed()
                .setTitle("Eval")
                .setDescription(`\`\`\`js\n${clean(output)}\`\`\`
                **Evaluated**
                \`\`\`js\n${output}\`\`\`
                **🕐 Executed in**
                ${difference[0] > 0 ? `${difference[0]}s` : ""}${difference[1] / 1000000}ms
                **${client.developerToolsEmoji} Type of**
                \`\`\`js\n${typeof output}\`\`\`
                ${client.memberEmoji} User
                ${message.author}
                **🗓️ Used on**
                ${client.util.dateFormatter(message.createdAt)}`)
                .setThumbnail(message.author.displayAvatarURL()));
        } catch (error) {
            return client.createArgumentError(message, { title: "ERROR", description: `${error}`}, this.usage);
        };
    };
};

function clean(string: string): string {
    if (typeof string == "string") return string.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else return string;
};