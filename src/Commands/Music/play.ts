import GalaxyAlpha from '@root/Client';
import Command from '@root/Command';
import { VoiceChannel } from 'discord.js';
import { videoFinder, playlistFinder } from "@commands/Music/Music";
import { getDuration } from '@root/util';
import ytSearch from "yt-search";

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
        const video = await (await playlistFinder(args.join(" ")) ? playlistFinder(args.join(" ")) : (await videoFinder(args.join(" ")) ? await videoFinder(args.join(" ")) : null));
        if (!video) return message.channel.send(embed.setDescription(`Cannot find any results, that includes \`${args.join(" ")}\`! Please try again!`));
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 0 && client.queue.get(message.guild.id).nowPlaying) {
            if (voiceChannel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(embed.setDescription("You need to be in the same voice channel, where I am!"));
            if (video.type == "list") {
                await (await ytSearch({ listId: video.listId })).videos.forEach(video => addToQueue(video.videoId));
                return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription(`Added the playlist with \`${video.videoCount}\` videos to the queue!
                    
                    **<:youtube:786675436733857793> [${video.title}](${video.url})**
                    *uploaded by [${video.author.name}](${video.author.url})*`)
                    .setImage(video.image));
            } else {
                addToQueue(video.videoId);
                return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription(`Added the song to the queue!
                    
                    **<:youtube:786675436733857793> [${video.title}](${video.url})**
                    *uploaded by [${video.author.name}](${video.author.url})*
                    
                    **${video.description}**
                    
                    **Duration:** ${getDuration(video.duration.seconds * 1000)}
                    **Views:** ${video.views.toLocaleString()} views`)
                    .setImage(video.image));
            };
        } else {
            if (video.type == "list") {
                const lists = await ytSearch({ listId: video.listId });
                lists.videos.forEach(video => addToQueue(video.videoId));
                return client.music.play(message, voiceChannel, lists.videos[0].videoId, true, prefix, this.usage, true);
            } else {
                return client.music.play(message, voiceChannel, video.videoId, true, prefix, this.usage, true);
            };
        };
        async function addToQueue(videoID: string) {
            if (!client.queue.has(message.guild.id)) client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: [],
                nowPlaying: false,
                dispatcher: null,
                voiceChannel: null,
                beginningToPlay: null,
                stopToPlay: null,
                multipleLoop: false,
                singleLoop: false,
                shuffle: false
            });
            await ytSearch({ videoId: videoID }, (err, video) => {
                if (err) return;
                if (!video) return;
                const queue = client.queue.get(message.guild.id).queue;
                if (client.queue.get(message.guild.id).queue.find(video => video.videoID == videoID )) return;
                queue.push({
                    title: video.title,
                    url: video.url,
                    requesterID: message.author.id,
                    description: video.description,
                    duration: video.duration,
                    views: video.views,
                    image: video.image,
                    author: video.author,
                    videoID: videoID
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
                    singleLoop: client.queue.get(message.guild.id).singleLoop,
                    shuffle: client.queue.get(message.guild.id).shuffle
                });
            });
        };
    };
};