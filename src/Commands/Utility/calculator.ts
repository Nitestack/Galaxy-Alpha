import Command, { CommandRunner } from '@root/Command';

export default class CalculatorCommand extends Command {
    constructor(){
        super({
            name: "calculator",
            aliases: ["calc", "cal"],
            description: "a device that performs arithmetic operations on numbers",
            usage: "calculator <number> < + | - | * | / > <number>",
            category: "utility"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0] || !args[1] || !args[2]) {
            const argsEmbed = client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle('Calculator')
                .setDescription("You have to provide two numbers and one operator!");
            return message.channel.send(argsEmbed);
        };
        if (args[1] == '+') {
            const result = parseInt(args[0]) + parseInt(args[2]);
            const plusEmbed = client.createEmbed()
                .setTitle(`Calculator`)
                .setDescription(`${args[0]} + ${args[2]} =\n**${result.toLocaleString()}**`);
            return message.channel.send(plusEmbed);
        } else if (args[1] == '-') {
            const result = parseInt(args[0]) - parseInt(args[2]);
            const minusEmbed = client.createEmbed()
                .setTitle(`Calculator`)
                .setDescription(`${args[0]} - ${args[2]} =\n**${result.toLocaleString()}**`);
            return message.channel.send(minusEmbed);
        } else if (args[1] == '*' || args[1] == 'x' || args[1] == '·') {
            const result = parseInt(args[0]) * parseInt(args[2]);
            const minusEmbed = client.createEmbed()
                .setTitle(`Calculator`)
                .setDescription(`${args[0]} x ${args[2]} =\n**${result.toLocaleString()}**`);
            return message.channel.send(minusEmbed);
        } else if (args[1] == '/' || args[1] == ':' || args[1] == '÷') {
            const result = parseInt(args[0]) / parseInt(args[2]);
            const minusEmbed = client.createEmbed()
                .setTitle(`Calculator`)
                .setDescription(`${args[0]} ÷ ${args[2]} =\n**${result.toLocaleString()}**`);
            return message.channel.send(minusEmbed);
        };
    };
};