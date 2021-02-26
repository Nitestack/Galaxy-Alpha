import Command, { CommandRunner } from "@root/Command";

export default class SkipCommand extends Command {
    constructor() {
        super({
            name: "skip",
            description: "skips the song in the queue",
            category: "music",
            usage: "skip [position as number]",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!message.member.voice.channel) return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (args[0] && !isNaN((args[0] as unknown as number))) {
            if (client.queue.has(message.guild.id) && !client.music.getServerQueue(message).isEmpty) {
                const serverQueue = client.music.getServerQueue(message);
                if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("You have to be in the same voice channel as me!"));
                if (parseInt(args[0]) == 0 || parseInt(args[0]) > serverQueue.songs.length) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("🎧 Music Manager")
                    .setDescription(`You can only the numbers \`1 - ${serverQueue.songs.length}\`!`));
                const queueIndex = parseInt(args[0]);
                let queue = serverQueue.songs;
                if (serverQueue.loopMode == 1){
                    queue.slice(queueIndex - 1);
                } else {
                    if (serverQueue.shuffle) queue = client.music.shuffle(message);
                    if (serverQueue.loopMode == 2){
                        const oldElements = queue.splice(0, queueIndex);
                        queue.concat(oldElements);
                        queue.splice(0, queueIndex);
                    };
                };
                serverQueue.songs = queue;
                serverQueue.nowPlaying = false;
                serverQueue.stopToPlay = null;
                serverQueue.beginningToPlay = null;
                client.music.play(message);
            } else return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        } else {
            if (client.queue.has(message.guild.id) && !client.music.getServerQueue(message).isEmpty) {
                if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("You have to be in the same voice channel as me!"));
                client.queue.get(message.guild.id).dispatcher.emit("finish");
            } else return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        };
    };
};