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
            if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue?.length > 1) {
                const serverQueue = client.queue.get(message.guild.id);
                if (message.member.voice.channel.id != serverQueue.voiceChannel.id) return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("You have to be in the same voice channel as me!"));
                if (parseInt(args[0]) == 0 || parseInt(args[0]) > serverQueue.queue.length) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("🎧 Music Manager")
                    .setDescription(`You can only the numbers \`1 - ${serverQueue.queue.length}\`!`));
                const queueIndex = parseInt(args[0]);
                let queue = serverQueue.queue;
                if (serverQueue.singleLoop){
                    queue.slice(queueIndex - 1);
                } else {
                    if (serverQueue.shuffle) queue = client.music.shuffle(serverQueue.queue);
                    if (serverQueue.multipleLoop){
                        const oldElements = queue.splice(0, queueIndex);
                        queue.concat(oldElements);
                        queue.splice(0, queueIndex);
                    };
                };
                client.queue.set(message.guild.id, {
                    ...serverQueue,
                    queue: queue,
                    nowPlaying: false,
                    stopToPlay: null,
                    beginningToPlay: null
                });
                client.music.play(message, message.guild.me.voice.channel);
            } else return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        } else {
            if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue?.length > 1) {
                if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("You have to be in the same voice channel as me!"));
                client.queue.get(message.guild.id).dispatcher.emit("finish");
            } else return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        };
    };
};