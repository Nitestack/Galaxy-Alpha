import Command from '@root/Command';

module.exports = class DeveloperCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'developer',
            description: 'shows all developers and contributors of this bot',
            category: "miscellaneous"
        });
    };
    async run(client, message) {
        return message.channel.send(client.createEmbed()
            .setTitle(`🛠️ ${client.user.username}'s Developer`)
            .addField("Developers", `<@${client.developers.join(">\n<@")}>`)
            .addField("Contributors", `<@${client.contributors.join(">\n<@")}>`));
    };
};