import Command, { CommandRunner } from "@root/Command";

export default class ResumeCommand extends Command {
    constructor() {
        super({
            name: "resume",
            description: "resumes the current track",
            category: "music",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!message.member.voice.channel) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && !client.queue.get(message.guild.id).nowPlaying) {
            if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            client.music.resume(client.queue.get(message.guild.id).dispatcher);
            const timeUsed = client.queue.get(message.guild.id).stopToPlay.getTime() - client.queue.get(message.guild.id).beginningToPlay.getTime();
            client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: client.queue.get(message.guild.id).queue,
                nowPlaying: true,
                dispatcher: client.queue.get(message.guild.id).dispatcher,
                voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                beginningToPlay: new Date(Date.now() - timeUsed),
                stopToPlay: null,
                singleLoop: client.queue.get(message.guild.id).singleLoop,
                multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                shuffle: client.queue.get(message.guild.id).shuffle
            });
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("▶️ Resumed the current track!"));
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no song stopped or there is no voice connection!"));
        };
    };
};