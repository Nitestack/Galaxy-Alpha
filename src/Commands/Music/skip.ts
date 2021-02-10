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
            if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 1) {
                if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("You have to be in the same voice channel as me!"));
                if (parseInt(args[0]) == 0 || parseInt(args[0]) > client.queue.get(message.guild.id).queue.length) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("🎧 Music Manager")
                    .setDescription(`You can only the numbers \`0 - ${client.queue.get(message.guild.id).queue.length}\`!`));
                let queue = client.queue.get(message.guild.id).queue;
                if (!client.queue.get(message.guild.id).singleLoop) {
                    if (!client.queue.get(message.guild.id).multipleLoop) queue.slice(1);
                    if (client.queue.get(message.guild.id).shuffle) queue = client.music.shuffle(queue);
                };
                client.queue.set(message.guild.id, {
                    guildID: message.guild.id,
                    queue: queue,
                    nowPlaying: false,
                    dispatcher: client.queue.get(message.guild.id).dispatcher,
                    voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                    stopToPlay: null,
                    beginningToPlay: null,
                    multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                    singleLoop: client.queue.get(message.guild.id).singleLoop,
                    shuffle: client.queue.get(message.guild.id).shuffle
                });
                client.music.play(message, message.guild.me.voice.channel, client.queue.get(message.guild.id).queue[0].videoID, false);
            } else {
                return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("🎧 Music Manager")
                    .setDescription("There is no queue in this server!"));
            };
        } else {
            if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 1) {
                if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("You have to be in the same voice channel as me!"));
                client.queue.get(message.guild.id).dispatcher.emit("finish");
            } else {
                return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("🎧 Music Manager")
                    .setDescription("There is no queue in this server!"));
            };
        };
    };
};