import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";

module.exports = class SkipCommand extends Command {
    constructor(client) {
        super(client, {
            name: "skip",
            description: "skips the song in the queue",
            category: "music"
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        if (!message.member.voice.channel) return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 1) {
            if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: client.queue.get(message.guild.id).queue.slice(1),
                nowPlaying: false,
                dispatcher: client.queue.get(message.guild.id).dispatcher,
                voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                stopToPlay: null,
                beginningToPlay: null,
                multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                singleLoop: client.queue.get(message.guild.id).singleLoop
            });
            client.music.play(message, message.guild.me.voice.channel, client.queue.get(message.guild.id).queue[0].url, false);
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        };
    };
};