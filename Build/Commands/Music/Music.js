"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Queue_1 = __importDefault(require("@commands/Music/Queue"));
const yt_search_1 = __importDefault(require("yt-search"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
class Music {
    constructor(client) {
        this.client = client;
    }
    ;
    /**
     * Plays an audio
     * @param {Message} message The message sent from the guild
     */
    async play(message) {
        const serverQueue = this.getServerQueue(message);
        if (serverQueue.stream)
            serverQueue.stream.destroy();
        const videoInfos = this.getQueue(message)[0];
        try {
            if (!serverQueue.connection)
                serverQueue.connection = await serverQueue.message.member.voice.channel.join();
            serverQueue.stream = ytdl_core_1.default(videoInfos.url, {
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
                if (!this.getServerQueue(message).panel)
                    message.channel.send(this.client.createEmbed()
                        .setTitle(`🎧 Connected to \`${serverQueue.message.guild.me.voice.channel.name}\`!`)
                        .setDescription(`**<:youtube:786675436733857793> [${videoInfos.title}](${videoInfos.url})**
                    *uploaded by [${videoInfos.author.name}](${videoInfos.author.url}) on ${videoInfos.uploadDate} (${videoInfos.ago})*
                    
                    **Duration:** ${this.client.util.getDuration(videoInfos.duration.seconds * 1000)} (${humanize_duration_1.default(videoInfos.duration.seconds * 1000, {
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
                if (serverQueue.loopMode == 2)
                    serverQueue.songs.push(serverQueue.songs[0]);
                serverQueue.songs.shift();
                if (serverQueue.shuffle)
                    serverQueue.songs = this.shuffle(serverQueue.message);
                if (serverQueue.autoPlay)
                    this.addRelatedVideo(serverQueue.message);
                if (serverQueue.isEmpty) {
                    this.client.queue.delete(message.guild.id);
                    return this.disconnect(message);
                }
                else
                    this.play(message);
            });
        }
        catch (error) {
            console.log(error);
        }
        ;
    }
    ;
    /**
     * Set's the loop mode
     * @param {number} mode The mode (`0` = disabled, `1` = song loop, `2` = queue loop)
     */
    setLoop(message, mode) {
        return this.getServerQueue(message).loopMode = mode;
    }
    ;
    /**
     * Returns the server queue
     * @param {Message} message The message sent from the guild
     */
    getServerQueue(message) {
        if (!this.client.queue.has(message.guild.id))
            this.client.queue.set(message.guild.id, new Queue_1.default(message));
        return this.client.queue.get(message.guild.id);
    }
    ;
    /**
     * Returns the server songs
     * @param {Message} message The message sent from the guild
     */
    getQueue(message) {
        return this.getServerQueue(message).songs;
    }
    ;
    /**
     * Disconnects the client from the voice channel
     * @param {Message} message The message sent from the guild
     */
    disconnect(message) {
        return message.guild.me.voice.channel.leave();
    }
    ;
    /**
     * Stops the dispatcher
     * @param {Message} message The message sent from the guild
     */
    stop(message) {
        return this.getServerQueue(message).dispatcher.pause();
    }
    ;
    /**
     * Resumes the dispatcher
     * @param {Message} message The message sent from the guild
     */
    resume(message) {
        return this.getServerQueue(message).dispatcher.resume();
    }
    ;
    /**
     * Set's the volume of the dispatcher
     * @param {Message} message The message sent from the guild
     * @param {number} volume The volume (`0` - `100`)
     */
    setVolume(message, volume) {
        this.getServerQueue(message).volume = volume;
        return this.getServerQueue(message).dispatcher.setVolume(volume / 100);
    }
    ;
    /**
     * Returns a new shuffled queue
     * @param {Message} message The message sent from the guild
     */
    shuffle(message) {
        const newShuffledQueue = this.getQueue(message);
        let newPos;
        let temp;
        for (let i = newShuffledQueue.length - 1; i > 0; i--) {
            newPos = Math.floor(Math.random() * (i + 1));
            temp = newShuffledQueue[i];
            newShuffledQueue[i] = newShuffledQueue[newPos];
            newShuffledQueue[newPos] = temp;
        }
        ;
        return this.getServerQueue(message).songs = newShuffledQueue;
    }
    ;
    /**
     * Set's the seek of the current track
     * @param {Message} message The message sent from the guild
     * @param {number} time The seek in milliseconds
     */
    seek(message, time) {
        this.getServerQueue(message).beginAt = time;
        return this.play(message);
    }
    ;
    /**
     * Set's the auto play mode
     * @param {Message} message The message sent from the guild
     * @param {number} mode The number (`0` - disabled, `1` - enabled)
     */
    setAutoPlay(message, mode) {
        return this.getServerQueue(message).autoPlay = mode == 0 ? false : true;
    }
    ;
    /**
     * Adds a video related to the current track
     * @param {Message} message
     */
    async addRelatedVideo(message) {
        const queue = this.getQueue(message);
        if (queue.length < 1)
            return;
        const song = queue[0];
        const relatedVideos = (await ytdl_core_1.default.getBasicInfo(song.url)).related_videos;
        if (relatedVideos.length == 0)
            return;
        return this.addToQueue(message, relatedVideos[0].id);
    }
    ;
    /**
     * Searches a video on YouTube
     * @param {string} query The query to search for
     */
    async videoFinder(query) {
        const videoResult = await yt_search_1.default(query);
        return videoResult.videos.length > 0 ? videoResult.videos[0] : null;
    }
    ;
    /**
     * Searches a playlist on YouTube
     * @param {string} query The query to search for
     */
    async playlistFinder(query) {
        const videoResult = await yt_search_1.default(query);
        return videoResult.playlists.length > 0 ? videoResult.playlists[0] : null;
    }
    ;
    /**
     * Adds a song to the queue
     * @param {Message} message The message sent from the guild
     * @param {string} videoID The ID of the YouTube video
     */
    async addToQueue(message, videoID) {
        const video = await yt_search_1.default({ videoId: videoID }).catch(err => console.log(err));
        if (!video)
            return;
        this.getQueue(message).push({
            ...video,
            user: message.author
        });
    }
    ;
}
exports.default = Music;
;
//# sourceMappingURL=Music.js.map