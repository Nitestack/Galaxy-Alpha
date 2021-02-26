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
            if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            client.music.stop(message);
            client.music.getServerQueue(message).stopToPlay = message.createdTimestamp;
            client.music.getServerQueue(message).nowPlaying = false;
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("⏸️ Stopped the current track!"));
        } else return message.channel.send(client.createRedEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("There there is no song played in the voice channel or the song was already stopped!"));
    };
};