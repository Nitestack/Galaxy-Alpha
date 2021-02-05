import Command, { CommandRunner } from "@root/Command";

export default class StopCommand extends Command {
    constructor() {
        super({
            name: "stop",
            description: "stops the current track",
            category: "music",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!message.member.voice.channel) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).nowPlaying) {
            if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            client.music.stop(client.queue.get(message.guild.id).dispatcher);
            client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: client.queue.get(message.guild.id).queue,
                nowPlaying: false,
                dispatcher: client.queue.get(message.guild.id).dispatcher,
                voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                stopToPlay: new Date(),
                singleLoop: client.queue.get(message.guild.id).singleLoop,
                multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                shuffle: client.queue.get(message.guild.id).shuffle
            });
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("⏸️ Stopped the current track!"));
        } else {
            return message.channel.send(client.createRedEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("There there is no song played in the voice channel or the song was already stopped!"));
        };
    };
};