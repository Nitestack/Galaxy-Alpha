import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";

module.exports = class ResumeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "resume",
            description: "resumes the current track",
            category: "music"
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        if (!message.member.voice.channel) return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && !client.queue.get(message.guild.id).nowPlaying) {
            if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            client.music.resume(client.queue.get(message.guild.id).dispatcher);
            client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: client.queue.get(message.guild.id).queue,
                nowPlaying: true,
                dispatcher: client.queue.get(message.guild.id).dispatcher,
                voiceChannel: client.queue.get(message.guild.id).voiceChannel
            });
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("Resumed the current track!"));
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no song stopped or there is no voice connection!"));
        };
    };
};