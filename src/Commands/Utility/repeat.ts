import Command from '@root/Command';

module.exports = class RepeatCommand extends Command {
    constructor(client){
        super(client, {
            name: "repeat",
            description: "repeats a text",
            category: "utility",
            usage: "repeat [embed] <text>"
        });
    };
    async run(client, message, args, prefix) {
        if (!args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`));
        if (args[0].toLowerCase() === 'embed') {
            const embed = client.createEmbed()
                .setDescription(`${args.slice(1).join(' ')}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL());
            return message.channel.send(embed);
        } else {
            return message.channel.send(args.join(' '));
        };
    };
};