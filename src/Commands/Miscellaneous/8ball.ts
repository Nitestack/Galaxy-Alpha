import Command, { CommandRunner } from '@root/Command';

export default class EightBallCommand extends Command {
    constructor() {
        super({
            name: "eight-ball",
            description: "ask a question and the magic 8 ball will answer you",
            aliases: ["8ball", "eightball"],
            usage: "8ball <question>",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let question = args.join(' ');
        if (!question) return message.channel.send(client.createRedEmbed(true, `${prefix}8ball <question>`)
            .setTitle('🎱 Manager')
            .setDescription('You have to provide a question for me to answer!'));
        let responses = ['Yes', 'No', 'Definetly', 'Absolutely', 'Not in a million years', 'Never Mind'];
        let response = responses[Math.floor(client.util.getRandomArbitrary(0, responses.length - 1))];
        const answer = client.createEmbed()
            .setTitle('🎱 Manager')
            .setColor('RANDOM')
            .setDescription(`**Question:** ${question}
        **Answer:** ${response}`);
        return message.channel.send(answer);
    };
};