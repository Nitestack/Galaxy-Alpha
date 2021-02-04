import GalaxyAlpha, { Queue } from "@root/Client";
import { Message, StreamDispatcher, VoiceChannel } from "discord.js";
import ytSearch from "yt-search";
import ytdl from "ytdl-core";
import duration from "humanize-duration";

export default class Music {
    private client: GalaxyAlpha;
    constructor(client){
        this.client = client;
    };
    async play(message: Message, voiceChannel: VoiceChannel, videoID: string, noSkip: boolean = true, prefix?: string, usage?: string, newSong: boolean = false, panel: boolean = false) {
        const connection = await voiceChannel.join();
        async function playSong(MusicManager: Music, videoID: string) {
            const videoInfos = await ytSearch({ videoId: videoID });
            const dispatcher = connection.play(ytdl(videoInfos.url, {
                filter: 'audioonly',
                highWaterMark: 1,
                quality: "highestaudio"
            }), {
                seek: 0,
                volume: MusicManager.client.queue.has(message.guild.id) && MusicManager.client.queue.get(message.guild.id).dispatcher ? MusicManager.client.queue.get(message.guild.id).dispatcher.volume : 0.5,
                highWaterMark: 1,
                bitrate: "auto"
            });
            if (!MusicManager.client.queue.has(message.guild.id) || !MusicManager.client.queue.get(message.guild.id).queue) MusicManager.client.queue.set(message.guild.id, {
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
            dispatcher.on("finish", () => {
                if (MusicManager.client.queue.get(message.guild.id).singleLoop) {
                    playSong(MusicManager, MusicManager.client.queue.get(message.guild.id).queue[0].videoID);
                } else if (MusicManager.client.queue.get(message.guild.id).multipleLoop) {
                    let queue = MusicManager.client.queue.get(message.guild.id).queue;
                    queue.push(queue[0]);
                    queue.slice(1);
                    if (MusicManager.client.queue.get(message.guild.id).shuffle) queue = MusicManager.shuffle(queue); 
                    MusicManager.client.queue.set(message.guild.id, {
                        guildID: message.guild.id,
                        queue: queue,
                        nowPlaying: false,
                        dispatcher: MusicManager.client.queue.get(message.guild.id).dispatcher,
                        beginningToPlay: null,
                        stopToPlay: null,
                        voiceChannel: MusicManager.client.queue.get(message.guild.id).voiceChannel,
                        multipleLoop: true,
                        singleLoop: false,
                        shuffle: MusicManager.client.queue.get(message.guild.id).shuffle
                    });
                    playSong(MusicManager, MusicManager.client.queue.get(message.guild.id).queue[0].videoID);
                } else if (noSkip) {
                    let queue = MusicManager.client.queue.get(message.guild.id).queue;
                    queue.slice(1)
                    if (MusicManager.client.queue.get(message.guild.id).shuffle) queue = MusicManager.shuffle(queue); 
                    MusicManager.client.queue.set(message.guild.id, {
                        guildID: message.guild.id,
                        queue: queue,
                        nowPlaying: false,
                        dispatcher: MusicManager.client.queue.get(message.guild.id).dispatcher,
                        voiceChannel: MusicManager.client.queue.get(message.guild.id).voiceChannel,
                        beginningToPlay: null,
                        stopToPlay: null,
                        multipleLoop: false,
                        singleLoop: false,
                        shuffle: MusicManager.client.queue.get(message.guild.id).shuffle
                    });
                    if (MusicManager.client.queue.get(message.guild.id).queue.length > 0) {
                        playSong(MusicManager, MusicManager.client.queue.get(message.guild.id).queue[0].videoID);
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
                    duration: videoInfos.duration,
                    views: videoInfos.views,
                    image: videoInfos.image,
                    author: videoInfos.author,
                    videoID: videoID,
                    genre: videoInfos.genre,
                    uploadDate: videoInfos.uploadDate,
                    ago: videoInfos.ago
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
                    singleLoop: false,
                    shuffle: false
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
                    singleLoop: true,
                    shuffle: false
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
                    singleLoop: false,
                    shuffle: MusicManager.client.queue.get(message.guild.id).shuffle
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
                    singleLoop: false,
                    shuffle: MusicManager.client.queue.get(message.guild.id).shuffle
                });
            };
            if (!panel) message.channel.send(MusicManager.client.createEmbed()
                .setTitle(`🎧 Connected to \`${voiceChannel.name}\`!`)
                .setDescription(`**<:youtube:786675436733857793> [${videoInfos.title}](${videoInfos.url})**
                *uploaded by [${videoInfos.author.name}](${videoInfos.author.url}) on ${videoInfos.uploadDate} (${videoInfos.ago})*
                
                **Duration:** ${MusicManager.client.util.getDuration(videoInfos.duration.seconds * 1000)} (${duration(videoInfos.duration.seconds * 1000, {
                    units: ["h", "m", "s"],
                    round: true
                })})
                **Views:** ${videoInfos.views.toLocaleString()} views
                **Genre:** ${MusicManager.client.util.toUpperCaseBeginning(videoInfos.genre)}`)
                .setImage(videoInfos.image));
        };
        if (this.client.queue.has(message.guild.id) && this.client.queue.get(message.guild.id).queue && this.client.queue.get(message.guild.id).queue.length > 0 && this.client.queue.get(message.guild.id).shuffle) {
            playSong(this, this.client.queue.get(message.guild.id).queue[Math.round(this.client.util.getRandomArbitrary(0, this.client.queue.get(message.guild.id).queue.length - 1))].url);
        } else {
            playSong(this, videoID);
        };
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
        return dispatcher.setVolume(volume);
    };
    shuffle(queue: Array<Queue>): Array<Queue>{
        const newShuffledQueue = queue;
        let newPos: number;
        let temp: Queue;
        for (let i = newShuffledQueue.length - 1; i > 0; i--){
            newPos = Math.floor(Math.random() * (i + 1));
            temp = newShuffledQueue[i];
            newShuffledQueue[i] = newShuffledQueue[newPos];
            newShuffledQueue[newPos] = temp;
        };
        return newShuffledQueue;
    };
};

export async function videoFinder(query: string) {
    const videoResult = await ytSearch(query);
    return videoResult.videos.length > 0 ? videoResult.videos[0] : null;
};

export async function playlistFinder(query: string) {
    const videoResult = await ytSearch(query);
    return videoResult.playlists.length > 0 ? videoResult.playlists[0] : null;
};