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
            if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            client.music.getServerQueue(message).nowPlaying = true;
            client.music.getServerQueue(message).stopToPlay = null;
            client.music.resume(message);
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