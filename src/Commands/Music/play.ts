import GalaxyAlpha from '@root/Client';
import Command from '@root/Command';
import { VoiceChannel } from 'discord.js';
import { videoFinder } from "@commands/Music/Music";

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "play",
            description: "plays an YouTube audio",
            usage: "play <YouTube link/keywords>",
            category: "music",
            guildOnly: true
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        const embed = client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🎧 Music Manager");
        const voiceChannel: VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(embed.setDescription('You need to be in a voice channel to use this command!'));
        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('SPEAK')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('VIEW_CHANNEL')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!args.length) return message.channel.send(embed.setDescription("You need to send keywords or an valid YouTube link to let me play music!"));
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 0 && client.queue.get(message.guild.id).nowPlaying) {
            const video = await videoFinder(args.join(' '));
            if (!video) return message.channel.send(embed.setDescription(`Cannot find any results, that includes \`${args.join(" ")}\`! Please try again!`));
            if (voiceChannel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(embed.setDescription("You need to be in the same voice channel, where I am!"));
            const queue = client.queue.get(message.guild.id).queue;
            queue.push({
                title: video.title,
                url: video.url,
                requesterID: message.author.id,
                description: video.description,
                duration: video.duration,
                views: video.views,
                image: video.image,
                author: video.author
            });
            client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: queue,
                nowPlaying: client.queue.get(message.guild.id).nowPlaying,
                dispatcher: client.queue.get(message.guild.id).dispatcher,
                voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                stopToPlay: null,
                multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                singleLoop: client.queue.get(message.guild.id).singleLoop
            });
            return message.channel.send(client.createEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`Added the song to the queue!
                    
                    **<:youtube:786675436733857793> [${video.title}](${video.url})**
                    *uploaded by [${video.author.name}](${video.author.url})*
                    
                    **${video.description}**
                    
                    **Duration:** ${video.duration}
                    **Views:** ${video.views.toLocaleString()} views`)
                .setImage(video.image));
        } else {
            return client.music.play(message, voiceChannel, args.join(" "), true, prefix, this.usage, true);
        };
    };
};