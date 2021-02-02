import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";

module.exports = class StopCommand extends Command {
    constructor(client) {
        super(client, {
            name: "stop",
            description: "stops the current track",
            category: "music"
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        if (!message.member.voice.channel) return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).nowPlaying) {
            client.music.stop(client.queue.get(message.guild.id).dispatcher);
            client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: client.queue.get(message.guild.id).queue,
                nowPlaying: false,
                dispatcher: client.queue.get(message.guild.id).dispatcher,
                voiceChannel: client.queue.get(message.guild.id).voiceChannel
            });
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("Stopped the current track!"));
        } else {
            return message.channel.send(client.createRedEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("There there is no song played in the voice channel or the song was already stopped!"));
        };
    };
};