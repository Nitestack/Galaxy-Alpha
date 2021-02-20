import Command, { CommandRunner } from '@root/Command';

export default class CalculatorCommand extends Command {
    constructor() {
        super({
            name: "calculator",
            aliases: ["calc", "cal"],
            description: "a device that performs arithmetic operations on numbers",
            usage: "calculator <number> < + | - | * | / > <number> or calculator round/ceil/floor/sqrt <number> or calculator random [min number] [max number]",
            category: "utility"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (args[0]?.toLowerCase() == "sqrt") {
            if (!args[1] || isNaN(args[1] as unknown as number)) return client.createArgumentError(message, { title: "Calculator", description: "You have to provide a number to sqrt!" }, `${prefix}calculator sqrt <number>`);
            return message.channel.send(client.createEmbed()
                .setTitle("Calculator")
                .setDescription(`Math.sqrt(${args[1]})\n**${Math.sqrt(parseInt(args[1]))}**`));
        } else if (args[0]?.toLowerCase() == "ceil") {
            if (!args[1] || isNaN(args[1] as unknown as number)) return client.createArgumentError(message, { title: "Calculator", description: "You have to provide a number to ceil!" }, `${prefix}calculator ceil <number>`);
            return message.channel.send(client.createEmbed()
                .setTitle("Calculator")
                .setDescription(`Math.ceil(${args[1]})\n**${Math.ceil(parseInt(args[1]))}**`));
        } else if (args[0]?.toLowerCase() == "floor") {
            if (!args[1] || isNaN(args[1] as unknown as number)) return client.createArgumentError(message, { title: "Calculator", description: "You have to provide a number to floor!" }, `${prefix}calculator floor <number>`);
            return message.channel.send(client.createEmbed()
                .setTitle("Calculator")
                .setDescription(`Math.floor(${args[1]})\n**${Math.floor(parseInt(args[1]))}**`));
        } else if (args[0]?.toLowerCase() == "max" || args[0]?.toLowerCase() == "min") {
            if (!args[1] && !args[2]) return client.createArgumentError(message, { title: "Calculator", description: "You have to provide atleast two numbers" }, `${prefix}calculator <max/min> <numbers (trimmed with a space)>`);
        } else if (args[0]?.toLowerCase() == "random") {
            return message.channel.send(client.createEmbed()
                .setTitle("Calculator")
                .setDescription(`Random number from ${args[1] && !isNaN(args[1] as unknown as number) ? args[1] : 0} to ${args[2] && !isNaN(args[2] as unknown as number) ? args[2] : 100}
                **${Math.round(client.util.getRandomArbitrary(args[1] && !isNaN(args[1] as unknown as number) ? parseInt(args[1]) : 0, args[2] && !isNaN(args[2] as unknown as number) ? parseInt(args[2]) : 100))}**`));
        } else if (args[0]?.toLowerCase() == "round") {
            if (!args[1] || isNaN(args[1] as unknown as number)) return client.createArgumentError(message, { title: "Calculator", description: "You have to provide a number to round!" }, `${prefix}calculator round <number>`);
            return message.channel.send(client.createEmbed()
                .setTitle("Calculator")
                .setDescription(`Math.round(${args[1]})\n**${Math.round(parseInt(args[1]))}**`));
        } else {
            if (!args[0] || !args[1] || !args[2]) {
                const argsEmbed = client.createRedEmbed(true, `${prefix}calculator <number> < + | - | * | / > <number>`)
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
};