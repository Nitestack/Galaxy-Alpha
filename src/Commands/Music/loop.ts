import Command, { CommandRunner } from "@root/Command";

export default class LoopCommand extends Command {
    constructor() {
        super({
            name: "loop",
            description: "loops a single song or a queue",
            category: "music",
            usage: "loop <enable/disable> [queue]",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!client.queue.has(message.guild.id) || client.music.getServerQueue(message).isEmpty) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no queue in this server!"));
        if (!args[0] || (args[0].toLowerCase() != "disable" && args[0].toLowerCase() != "enable")) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You need to enable or disable the queue!"));
        if (args[0].toLowerCase() == "enable") {
            client.music.setLoop(message, args[1]?.toLowerCase() == "queue" ? 2 : 1);
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`Enabled ${args[1]?.toLowerCase() == "queue" ? "queue loop" : "song loop"}!`));
        } else if (args[0].toLowerCase() == "disable") {
            client.music.setLoop(message, 0);
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`Disabled ${args[1] && args[1].toLowerCase() == "queue" ? "queue loop" : "song loop"}!`));
        };
    };
};