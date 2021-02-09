import Command, { CommandRunner } from "@root/Command";

export default class GhostPingCommand extends Command {
    constructor(){
        super({
            name: "ghostping",
            description: "shows the last ghost ping",
            category: "utility",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!client.ghostPings.has(message.channel.id)) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("👻 Ghost Ping Manager")
            .setDescription("There is no ghost ping in this channel!"));
        
        const ghostPing = client.ghostPings.get(message.channel.id);
        return message.channel.send(client.createEmbed()
            .setAuthor(ghostPing.author.tag, ghostPing.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ghostPing.content)
            .setTimestamp(ghostPing.createdTimestamp));
    };
};