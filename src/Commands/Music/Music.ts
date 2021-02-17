import GalaxyAlpha, { Queue } from "@root/Client";
import { Message, StreamDispatcher, VoiceChannel } from "discord.js";
import ytSearch from "yt-search";
import ytdl from "ytdl-core";
import duration from "humanize-duration";

export default class Music {
    private client: GalaxyAlpha;
    constructor(client: GalaxyAlpha) {
        this.client = client;
    };
    async play(message: Message, voiceChannel: VoiceChannel, panel: boolean = false) {
        const videoInfos = this.client.queue.get(message.guild.id).queue[0];
        const dispatcher = (await voiceChannel.join()).play(ytdl(videoInfos.url, {
            filter: 'audioonly',
            highWaterMark: 1,
            quality: "highestaudio"
        }), {
            seek: 0,
            volume: this.client.queue.has(message.guild.id) && this.client.queue.get(message.guild.id).dispatcher ? this.client.queue.get(message.guild.id).dispatcher.volume : 0.5,
            highWaterMark: 1,
            bitrate: "auto"
        });
        dispatcher.on("finish", () => {
            const serverQueue = this.client.queue.get(message.guild.id);
            if (serverQueue.multipleLoop) {
                let queue = serverQueue.queue;
                queue.push(queue[0]);
                queue.shift();
                if (serverQueue.shuffle) queue = this.shuffle(queue);
                this.client.queue.set(message.guild.id, {
                    ...serverQueue,
                    queue: queue,
                    nowPlaying: false,
                    beginningToPlay: null,
                    stopToPlay: null
                });
            } else {
                let queue = serverQueue.queue;
                queue.shift();
                if (serverQueue.shuffle) queue = this.shuffle(queue);
                this.client.queue.set(message.guild.id, {
                    ...serverQueue,
                    queue: queue,
                    nowPlaying: false,
                    beginningToPlay: null,
                    stopToPlay: null
                });
            };
            if (this.getQueue(message.guild.id).length == 0) {
                this.client.queue.delete(message.guild.id);
                return voiceChannel.leave();
            } else {
                this.play(message, serverQueue.voiceChannel);
            };
        });
        this.client.queue.set(message.guild.id, {
            ...this.client.queue.get(message.guild.id),
            beginningToPlay: new Date(),
            dispatcher: dispatcher,
            voiceChannel: voiceChannel,
            nowPlaying: true
        });
        if (!panel) message.channel.send(this.client.createEmbed()
            .setTitle(`🎧 Connected to \`${voiceChannel.name}\`!`)
            .setDescription(`**<:youtube:786675436733857793> [${videoInfos.title}](${videoInfos.url})**
            *uploaded by [${videoInfos.author.name}](${videoInfos.author.url}) on ${videoInfos.uploadDate} (${videoInfos.ago})*
            
            **Duration:** ${this.client.util.getDuration(videoInfos.duration.seconds * 1000)} (${duration(videoInfos.duration.seconds * 1000, {
                units: ["h", "m", "s"],
                round: true
            })})
            **Views:** ${videoInfos.views.toLocaleString()} views
            **Genre:** ${this.client.util.toUpperCaseBeginning(videoInfos.genre)}`)
            .setImage(videoInfos.image));
    };
    getQueue(guildID: string) {
        if (!this.client.queue.has(guildID)){
            this.client.queue.set(guildID, {
                guildID: guildID,
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
        };
        return this.client.queue.get(guildID).queue;
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
    shuffle(queue: Array<Queue>): Array<Queue> {
        const newShuffledQueue = queue;
        let newPos: number;
        let temp: Queue;
        for (let i = newShuffledQueue.length - 1; i > 0; i--) {
            newPos = Math.floor(Math.random() * (i + 1));
            temp = newShuffledQueue[i];
            newShuffledQueue[i] = newShuffledQueue[newPos];
            newShuffledQueue[newPos] = temp;
        };
        return newShuffledQueue;
    };
    async addToQueue(client: GalaxyAlpha, message: Message, videoID: string) {
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
        const video = await ytSearch({ videoId: videoID });
        const queue = client.queue.get(message.guild.id).queue;
        queue.push({
            ...video,
            requesterID: message.author.id
        });
        const serverQueue = client.queue.get(message.guild.id);
        client.queue.set(message.guild.id, {
            ...serverQueue,
            queue: queue
        });
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