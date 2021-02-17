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
        let text: string = `**Owner:**\n<@${client.ownerID}>\n`;
        if (client.developers.filter(developer => developer != client.ownerID).length != 0) text += `**Developers:**\n<@${client.developers.filter(developer => developer != client.ownerID).join("> <@")}>\n`;
        if (client.contributors.length != 0) text += `**Contributors:**\n<@${client.contributors.join("> <@")}>\n`;
        return message.channel.send(client.createEmbed()
            .setTitle(`🛠️ ${client.user.username}'s Developer`)
            .setDescription(text));
    };
};