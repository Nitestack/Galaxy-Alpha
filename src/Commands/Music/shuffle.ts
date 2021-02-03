import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";

module.exports = class ShuffleCommand extends Command {
    constructor(client) {
        super(client, {
            name: "shuffle",
            description: "shuffles the current queue",
            category: "music",
            guildOnly: true,
            usage: "shuffle <enable/disable>"
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        if (!message.member.voice.channel) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 1) {
            if (args[0] && args[0].toLowerCase() == "enable") {
                client.queue.set(message.guild.id, {
                    guildID: message.guild.id,
                    voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                    beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                    stopToPlay: client.queue.get(message.guild.id).stopToPlay,
                    dispatcher: client.queue.get(message.guild.id).dispatcher,
                    multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                    singleLoop: false,
                    nowPlaying: client.queue.get(message.guild.id).nowPlaying,
                    shuffle: true,
                    queue: client.queue.get(message.guild.id).queue
                });
                return message.channel.send(client.createGreenEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("Enabled shuffle!"));
            } else if (args[0] && args[0].toLowerCase() == "disable") {
                client.queue.set(message.guild.id, {
                    guildID: message.guild.id,
                    voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                    beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                    stopToPlay: client.queue.get(message.guild.id).stopToPlay,
                    dispatcher: client.queue.get(message.guild.id).dispatcher,
                    multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                    singleLoop: client.queue.get(message.guild.id).singleLoop,
                    nowPlaying: client.queue.get(message.guild.id).nowPlaying,
                    shuffle: false,
                    queue: client.queue.get(message.guild.id).queue
                });
                return message.channel.send(client.createGreenEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("Disabled shuffle!"));
            } else {
                return message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("🎧 Music Manager")
                    .setDescription(`Shuffle is ${client.queue.get(message.guild.id).shuffle ? "enabled" : "disabled"}!`));
            };
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        };
    };
};