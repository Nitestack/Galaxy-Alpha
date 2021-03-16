import Command, { CommandRunner } from '@root/Command';

export default class RepeatCommand extends Command {
    constructor(){
        super({
            name: "repeat",
            description: "repeats a text",
            category: "utility",
            usage: "repeat <text> [embed]",
            args: [{
                type: "text",
                index: 1,
                required: true,
                errorTitle: "Repeat Manager",
                errorMessage: "You have to provide a text to repeat!"
            }, {
                type: "certainString",
                index: 2,
                default: (message) => null
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (args[1].toLowerCase() == 'embed') {
            const embed = client.createEmbed()
                .setDescription(`${args[0]}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
            return message.channel.send(embed);
        } else return message.channel.send(args[0]);
    };
};