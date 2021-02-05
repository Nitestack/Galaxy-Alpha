import Command, { CommandRunner } from '@root/Command';

export default class DeveloperCommand extends Command {
    constructor() {
        super({
            name: 'developer',
            description: 'shows all developers and contributors of this bot',
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message) => {
        return message.channel.send(client.createEmbed()
            .setTitle(`🛠️ ${client.user.username}'s Developer`)
            .addField("Developers", `<@${client.developers.join(">\n<@")}>`)
            .addField("Contributors", `<@${client.contributors.join(">\n<@")}>`));
    };
};