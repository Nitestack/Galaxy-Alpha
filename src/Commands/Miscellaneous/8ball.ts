import Command from '@root/Command';

module.exports = class EightBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: "8ball",
            description: "ask a question and the magic 8 ball will answer you",
            usage: "8ball <question>",
            category: "miscellaneous"
        });
    };
    async run(client, message, args, prefix) {
        let question = args.slice().join(' ');
        if (!question) return message.channel.send(client.createRedEmbed(true, `${prefix}8ball <question>`)
            .setTitle('🎱 Manager')
            .setDescription('You have to provide a question for me to answer!'));
        let responses = ['Yes', 'No', 'Definetly', 'Absolutely', 'Not in a million years', 'Never Mind'];
        let response = responses[Math.floor(getRandomArbitrary(0, responses.length - 1))];
        const answer = client.createEmbed()
            .setTitle('🎱 Manager')
            .setColor('RANDOM')
            .setDescription(`**Question:** ${question}
        **Answer:** ${response}`);
        return message.channel.send(answer);
    };
};

function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
};