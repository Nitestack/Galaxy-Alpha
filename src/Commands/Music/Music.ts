import GalaxyAlpha from "@root/Client";
import { Message, StreamDispatcher, VoiceChannel } from "discord.js";
import ytSearch from "yt-search";
import ytdl from "ytdl-core";

export default class Music {
    private client: GalaxyAlpha;
    constructor(client: GalaxyAlpha) {
        this.client = client;
    };
    async play(message: Message, voiceChannel: VoiceChannel, keywordOrURL: string, noSkip: boolean = true, prefix?: string, usage?: string, newSong: boolean = false) {
        const connection = await voiceChannel.join();
        connection.on("disconnect", () => {
            return this.client.queue.delete(connection.channel.guild.id);
        });
        async function playSong(MusicManager: Music, keywordOrURLToPlay: string) {
            const videoInfos = await videoFinder(keywordOrURLToPlay);
            if (!videoInfos) return message.channel.send(MusicManager.client.createRedEmbed(true, `${prefix}${usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription(`Cannot find any results, that includes \`${keywordOrURLToPlay}\``));
            const dispatcher = connection.play(ytdl(videoInfos.url, { filter: 'audioonly' }), { seek: 0, volume: 1 });
            if (!MusicManager.client.queue.has(message.guild.id) || !MusicManager.client.queue.get(message.guild.id).queue) MusicManager.client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: [],
                nowPlaying: false,
                dispatcher: null,
                voiceChannel: null,
                beginningToPlay: null,
                stopToPlay: null,
                multipleLoop: false,
                singleLoop: false
            });
            dispatcher.on("finish", () => {
                if (MusicManager.client.queue.get(message.guild.id).singleLoop) {
                    playSong(MusicManager, MusicManager.client.queue.get(message.guild.id).queue[0].url);
                } else if (MusicManager.client.queue.get(message.guild.id).multipleLoop) {
                    const queue = MusicManager.client.queue.get(message.guild.id).queue;
                    queue.push(queue[0]);
                    queue.slice(1);
                    MusicManager.client.queue.set(message.guild.id, {
                        guildID: message.guild.id,
                        queue: queue,
                        nowPlaying: false,
                        dispatcher: MusicManager.client.queue.get(message.guild.id).dispatcher,
                        beginningToPlay: null,
                        stopToPlay: null,
                        voiceChannel: MusicManager.client.queue.get(message.guild.id).voiceChannel,
                        multipleLoop: true,
                        singleLoop: false
                    });
                    playSong(MusicManager, MusicManager.client.queue.get(message.guild.id).queue[0].url);
                } else if (noSkip) {
                    MusicManager.client.queue.set(message.guild.id, {
                        guildID: message.guild.id,
                        queue: MusicManager.client.queue.get(message.guild.id).queue.slice(1),
                        nowPlaying: false,
                        dispatcher: MusicManager.client.queue.get(message.guild.id).dispatcher,
                        voiceChannel: MusicManager.client.queue.get(message.guild.id).voiceChannel,
                        beginningToPlay: null,
                        stopToPlay: null,
                        multipleLoop: false,
                        singleLoop: false
                    });
                    if (MusicManager.client.queue.get(message.guild.id).queue.length > 0) {
                        playSong(MusicManager, MusicManager.client.queue.get(message.guild.id).queue[0].url);
                    } else {
                        MusicManager.client.queue.delete(message.guild.id);
                        return voiceChannel.leave();
                    };
                };
            });
            if (newSong) {
                const queue = MusicManager.client.queue.get(message.guild.id).queue;
                queue.push({
                    title: videoInfos.title,
                    url: videoInfos.url,
                    requesterID: message.author.id,
                    description: videoInfos.description,
                    duration: videoInfos.duration,
                    views: videoInfos.views,
                    image: videoInfos.image,
                    author: videoInfos.author
                });
                MusicManager.client.queue.set(message.guild.id, {
                    queue: queue,
                    nowPlaying: true,
                    guildID: message.guild.id,
                    dispatcher: dispatcher,
                    voiceChannel: voiceChannel,
                    beginningToPlay: new Date(),
                    stopToPlay: null,
                    multipleLoop: false,
                    singleLoop: false
                });
            } else if (MusicManager.client.queue.get(message.guild.id).singleLoop) {
                MusicManager.client.queue.set(message.guild.id, {
                    queue: MusicManager.client.queue.get(message.guild.id).queue,
                    nowPlaying: true,
                    guildID: message.guild.id,
                    dispatcher: dispatcher,
                    voiceChannel: voiceChannel,
                    beginningToPlay: new Date(),
                    stopToPlay: null,
                    multipleLoop: false,
                    singleLoop: true
                });
            } else if (MusicManager.client.queue.get(message.guild.id).multipleLoop) {
                MusicManager.client.queue.set(message.guild.id, {
                    queue: MusicManager.client.queue.get(message.guild.id).queue,
                    nowPlaying: true,
                    guildID: message.guild.id,
                    dispatcher: dispatcher,
                    voiceChannel: voiceChannel,
                    beginningToPlay: new Date(),
                    stopToPlay: null,
                    multipleLoop: true,
                    singleLoop: false
                });
            } else {
                MusicManager.client.queue.set(message.guild.id, {
                    queue: MusicManager.client.queue.get(message.guild.id).queue,
                    nowPlaying: true,
                    guildID: message.guild.id,
                    dispatcher: dispatcher,
                    voiceChannel: voiceChannel,
                    beginningToPlay: new Date(),
                    stopToPlay: null,
                    multipleLoop: false,
                    singleLoop: false
                });
            };
            message.channel.send(MusicManager.client.createEmbed()
                .setTitle(`🎧 Connected to \`${voiceChannel.name}\`!`)
                .setDescription(`**<:youtube:786675436733857793> [${videoInfos.title}](${videoInfos.url})**
                *uploaded by [${videoInfos.author.name}](${videoInfos.author.url})*
                
                **${videoInfos.description}**
                
                **Duration:** ${videoInfos.duration}
                **Views:** ${videoInfos.views.toLocaleString()} views`)
                .setImage(videoInfos.image));
        };
        playSong(this, keywordOrURL);
    };
    async getQueue(guildID: string) {
        if (this.client.queue.has(guildID) && this.client.queue.get(guildID).queue.length > 0) {
            return this.client.queue.get(guildID).queue;
        } else {
            return null;
        };
    };
    disconnect(voiceChannel: VoiceChannel): VoiceChannel {
        voiceChannel.leave();
        return voiceChannel;
    };
    stop(dispatcher: StreamDispatcher) {
        return dispatcher.pause();
    };
    resume(dispatcher: StreamDispatcher) {
        return dispatcher.resume();
    };
    volume(dispatcher: StreamDispatcher, volume: number) {
        if (volume > 2 || volume < 1) throw new Error("The number has to be between 1 and 2");
        return dispatcher.setVolume(volume);
    };
};

export async function videoFinder(query: string) {
    const videoResult = await ytSearch(query);
    return videoResult.videos.length > 0 ? videoResult.videos[0] : null;
};