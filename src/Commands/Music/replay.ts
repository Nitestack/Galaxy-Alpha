import Command, { CommandRunner } from "@root/Command";

export default class ReplayCommand extends Command {
    constructor() {
        super({
            name: "replay",
            description: "replays the current track",
            category: "music",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!message.member.voice.channel) return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && !client.music.getServerQueue(message).isEmpty) {
            if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.channel.send(client.createEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            client.music.getServerQueue(message).songs.unshift(client.music.getQueue(message)[0]);
            client.music.getServerQueue(message).dispatcher.emit("finish");
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("Replaying the current song!"));
        } else return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no queue in this server!"));
    };
};