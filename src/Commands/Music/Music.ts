import GalaxyAlpha from "@root/Client";
import { Message } from "discord.js";
import Queue, { Song } from "@commands/Music/Queue";
import ytSearch from "yt-search";
import ytdl from "ytdl-core";
import duration from "humanize-duration";
export default class Music {
    constructor(private client: GalaxyAlpha) { };
    /**
     * Plays an audio
     * @param {Message} message The message sent from the guild 
     */
    public async play(message: Message) {
        const serverQueue = this.getServerQueue(message);
        if (serverQueue.stream) serverQueue.stream.destroy();
        const videoInfos = this.getQueue(message)[0];
        try {
            if (!serverQueue.connection) serverQueue.connection = await serverQueue.message.member.voice.channel.join();
            serverQueue.stream = ytdl(videoInfos.url, {
                filter: 'audioonly',
                highWaterMark: 1,
                quality: "highestaudio"
            });
            serverQueue.dispatcher = serverQueue.connection.play(serverQueue.stream, {
                seek: serverQueue.beginAt,
                volume: serverQueue.volume / 100,
                highWaterMark: 1,
                bitrate: "auto",
                type: "webm/opus"
            }).on("start", () => {
                serverQueue.beginningToPlay = Date.now();
                serverQueue.nowPlaying = true;
                if (!this.getServerQueue(message).panel) message.channel.send(this.client.createEmbed()
                    .setTitle(`🎧 Connected to \`${serverQueue.message.guild.me.voice.channel.name}\`!`)
                    .setDescription(`**<:youtube:786675436733857793> [${videoInfos.title}](${videoInfos.url})**
                    *uploaded by [${videoInfos.author.name}](${videoInfos.author.url}) on ${videoInfos.uploadDate} (${videoInfos.ago})*
                    
                    **Duration:** ${this.client.util.getDuration(videoInfos.duration.seconds * 1000)} (${duration(videoInfos.duration.seconds * 1000, {
                        units: ["h", "m", "s"],
                        round: true
                    })})
                    **Views:** ${videoInfos.views.toLocaleString()} views
                    **Genre:** ${this.client.util.toUpperCaseBeginning(videoInfos.genre)}`)
                    .setImage(videoInfos.image));
            }).on("finish", () => {
                serverQueue.nowPlaying = false;
                serverQueue.beginningToPlay = null;
                serverQueue.stopToPlay = null;
                if (serverQueue.loopMode == 2) serverQueue.songs.push(serverQueue.songs[0]);
                serverQueue.songs.shift();
                if (serverQueue.shuffle) serverQueue.songs = this.shuffle(serverQueue.message);
                if (serverQueue.autoPlay) this.addRelatedVideo(serverQueue.message);
                if (serverQueue.isEmpty) {
                    this.client.queue.delete(message.guild.id);
                    return this.disconnect(message);
                } else this.play(message);
            });
        } catch (error) {
            console.log(error);
        };
    };
    /**
     * Set's the loop mode
     * @param {number} mode The mode (`0` = disabled, `1` = song loop, `2` = queue loop) 
     */
    public setLoop(message: Message, mode: 0 | 1 | 2) {
        return this.getServerQueue(message).loopMode = mode;
    };
    /**
     * Returns the server queue
     * @param {Message} message The message sent from the guild 
     */
    public getServerQueue(message: Message) {
        if (!this.client.queue.has(message.guild.id)) this.client.queue.set(message.guild.id, new Queue(message));
        return this.client.queue.get(message.guild.id);
    };
    /**
     * Returns the server songs
     * @param {Message} message The message sent from the guild 
     */
    public getQueue(message: Message) {
        return this.getServerQueue(message).songs;
    };
    /**
     * Disconnects the client from the voice channel
     * @param {Message} message The message sent from the guild
     */
    public disconnect(message: Message) {
        return message.guild.me.voice.channel.leave();
    };
    /**
     * Stops the dispatcher
     * @param {Message} message The message sent from the guild
     */
    public stop(message: Message) {
        return this.getServerQueue(message).dispatcher.pause();
    };
    /**
     * Resumes the dispatcher
     * @param {Message} message The message sent from the guild 
     */
    public resume(message: Message) {
        return this.getServerQueue(message).dispatcher.resume();
    };
    /**
     * Set's the volume of the dispatcher
     * @param {Message} message The message sent from the guild 
     * @param {number} volume The volume (`0` - `100`) 
     */
    public setVolume(message: Message, volume: number) {
        this.getServerQueue(message).volume = volume;
        return this.getServerQueue(message).dispatcher.setVolume(volume / 100);
    };
    /**
     * Returns a new shuffled queue
     * @param {Message} message The message sent from the guild 
     */
    public shuffle(message: Message): Array<Song> {
        const newShuffledQueue = this.getQueue(message);
        let newPos: number;
        let temp: Song;
        for (let i = newShuffledQueue.length - 1; i > 0; i--) {
            newPos = Math.floor(Math.random() * (i + 1));
            temp = newShuffledQueue[i];
            newShuffledQueue[i] = newShuffledQueue[newPos];
            newShuffledQueue[newPos] = temp;
        };
        return this.getServerQueue(message).songs = newShuffledQueue;
    };
    /**
     * Set's the seek of the current track
     * @param {Message} message The message sent from the guild 
     * @param {number} time The seek in milliseconds 
     */
    public seek(message: Message, time: number) {
        this.getServerQueue(message).beginAt = time;
        return this.play(message);
    };
    /**
     * Set's the auto play mode
     * @param {Message} message The message sent from the guild
     * @param {number} mode The number (`0` - disabled, `1` - enabled) 
     */
    public setAutoPlay(message: Message, mode: 0 | 1) {
        return this.getServerQueue(message).autoPlay = mode == 0 ? false : true;
    };
    /**
     * Adds a video related to the current track
     * @param {Message} message 
     */
    public async addRelatedVideo(message: Message) {
        const queue = this.getQueue(message);
        if (queue.length < 1) return;
        const song = queue[0];
        const relatedVideos = (await ytdl.getBasicInfo(song.url)).related_videos;
        if (relatedVideos.length == 0) return;
        return this.addToQueue(message, relatedVideos[0].id);
    };
    /**
     * Searches a video on YouTube
     * @param {string} query The query to search for
     */
    public async videoFinder(query: string) {
        const videoResult = await ytSearch(query);
        return videoResult.videos.length > 0 ? videoResult.videos[0] : null;
    };
    /**
     * Searches a playlist on YouTube
     * @param {string} query The query to search for
     */
    public async playlistFinder(query: string) {
        const videoResult = await ytSearch(query);
        return videoResult.playlists.length > 0 ? videoResult.playlists[0] : null;
    };
    /**
     * Adds a song to the queue
     * @param {Message} message The message sent from the guild 
     * @param {string} videoID The ID of the YouTube video 
     */
    public async addToQueue(message: Message, videoID: string) {
        const video = await ytSearch({ videoId: videoID }).catch(err => console.log(err));
        if (!video) return;
        this.getQueue(message).push({
            ...video,
            user: message.author
        });
    };
};