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
        if (!client.queue.has(message.guild.id) || !client.queue.get(message.guild.id).queue || client.queue.get(message.guild.id).queue.length < 1) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no queue in this server!"));
        if (!args[0] || (args[0].toLowerCase() != "disable" && args[0].toLowerCase() != "enable")) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You need to enable or disable the queue!"));
        const serverQueue = client.queue.get(message.guild.id);
        if (args[0].toLowerCase() == "enable") {
            if ((args[1] && args[1].toLowerCase() == "queue" && !client.queue.get(message.guild.id).singleLoop) || (!args[1] && !client.queue.get(message.guild.id).multipleLoop)) {
                client.queue.set(message.guild.id, {
                    ...serverQueue,
                    singleLoop: args[1] && args[1].toLowerCase() == "queue" ? false : true,
                    multipleLoop: args[1] && args[1].toLowerCase() == "queue" ? true : false
                });
                return message.channel.send(client.createGreenEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription(`Enabled ${args[1] && args[1].toLowerCase() == "queue" ? "queue loop" : "song loop"}!`));
            } else {
                return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("🎧 Music Manager")
                    .setDescription("Cannot enable single or queue loop because there is a loop already active!"));
            };
        } else if (args[0].toLowerCase() == "disable") {
            client.queue.set(message.guild.id, {
                ...serverQueue,
                singleLoop: args[1]?.toLowerCase() == "queue" ? serverQueue.singleLoop : false,
                multipleLoop: args[1]?.toLowerCase() == "queue" ? false : serverQueue.multipleLoop
            });
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`Disabled ${args[1] && args[1].toLowerCase() == "queue" ? "queue loop" : "song loop"}!`));
        };
    };
};