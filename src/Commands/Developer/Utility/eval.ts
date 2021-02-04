import Command from '@root/Command';
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
    async run(client, message, args, prefix) {
        const evalChannel = '789116457655992350';
        const createdAt = new Date(message.createdAt);
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (message.channel.type == 'dm' ? message.author.id != client.ownerID : message.channel.id != evalChannel) return;
        let output = eval(args.join(' '));
        if (!args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle('Eval Manager')
            .setDescription('You have to provide valid JavaScript code, that I can evaluate!'));
        try {
            const start = process.hrtime();
            const difference = process.hrtime(start);
            if (typeof output != 'string') output = inspect(output, { depth: 2 });
            return message.channel.send(client.createEmbed()
                .setTitle("Eval")
                .setDescription(`\`\`\`js\n${clean(output)}\`\`\``)
                .addField("Evaluated", `\`\`\`js\n${output}\`\`\``)
                .addField("🕐 Executed in", `${difference[0] > 0 ? `${difference[0]}s` : ""}${difference[1] / 1000000}ms`)
                .addField(`${client.developerToolsEmoji} Type of`, `\`\`\`js\n${typeof output}\`\`\``)
                .addField(`${client.memberEmoji} User`, `${message.author}`)
                .addField("🗓️ Used on", `${weekDays[createdAt.getUTCDay()]}, ${monthNames[createdAt.getUTCMonth()]} ${createdAt.getUTCDate()}, ${createdAt.getUTCFullYear()}, ${createdAt.getUTCHours()}:${createdAt.getUTCMinutes()}:${createdAt.getUTCSeconds()} UTC`)
                .setThumbnail(message.author.displayAvatarURL()));
        } catch (error) {
            return message.channel.send(client.createRedEmbed()
                .setTitle('❌ Error')
                .setDescription(`${error}`));
        };
    };
};

function clean(string: string): string {
    if (typeof string == "string") return string.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else return string;
};