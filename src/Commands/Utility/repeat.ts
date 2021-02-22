import Command, { CommandRunner } from '@root/Command';

export default class RepeatCommand extends Command {
    constructor(){
        super({
            name: "repeat",
            description: "repeats a text",
            category: "utility",
            usage: "repeat [embed] <text>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`));
        if (args[0].toLowerCase() === 'embed') {
            const embed = client.createEmbed()
                .setDescription(`${args.slice(1).join(' ')}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
            return message.channel.send(embed);
        } else {
            return message.channel.send(args.join(' '));
        };
    };
};