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
        const embed = client.createEmbed()
            .setTitle(`🛠️ ${client.user.username}'s Developer`)
            .addField("Owner:", `<@${client.ownerID}>`);
        if (client.developers.filter(developer => developer != client.ownerID).length != 0) embed.addField("Developers:", `<@${client.developers.filter(developer => developer != client.ownerID).join("> <@")}>`);
        if (client.contributors.length != 0) embed.addField("Contributors:", `<@${client.contributors.join("> <@")}>`);
        return message.channel.send(embed);
    };
};