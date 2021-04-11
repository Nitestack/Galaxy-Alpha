import GalaxyAlpha from "@root/Client";
import { Message, Snowflake, StreamDispatcher, User, VoiceChannel, VoiceConnection } from "discord.js";
import Queue, { Song } from "@commands/Music/Queue";
import ytSearch from "yt-search";
import ytdl from "ytdl-core";
import duration from "humanize-duration";
export default class Music {
    constructor(private client: GalaxyAlpha) { };
    /**
     * Plays an audio
     * @param {string} guildID The ID of the guild 
     */
    public async play(guildID: string, message?: Message) {
        const serverQueue = this.getServerQueue(guildID);
        if (serverQueue.stream) serverQueue.stream.destroy();
        const videoInfos = this.getQueue(guildID)[0];
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
                if (message && !this.getServerQueue(guildID).panel) message.channel.send(this.client.createEmbed()
                    .setTitle(`🎧 Connected to \`${message.guild.me.voice.channel.name}\`!`)
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
     * @param {Snowflake} guildID The ID of the guild
     * @param {number} mode The mode (`0` = disabled, `1` = song loop, `2` = queue loop) 
     */
    public setLoop(guildID: Snowflake, mode: 0 | 1 | 2) {
        return this.getServerQueue(guildID).loopMode = mode;
    };
    /**
     * Returns the server queue
     * @param {Snowflake} guildID The ID of the guild
     */
    public getServerQueue(guildID: Snowflake) {
        if (!this.client.queue.has(guildID)) this.client.queue.set(guildID, new Queue(guildID));
        return this.client.queue.get(guildID);
    };
    /**
     * Returns the server songs
     * @param {Snowflake} guildID The ID of the guild
     */
    public getQueue(guildID: Snowflake) {
        return this.getServerQueue(guildID).songs;
    };
    /**
     * Disconnects the client from the voice channel
     * @param {VoiceChannel | VoiceConnection} voiceChannel The voice channel of the client or the voice connection of the client
     */
    public disconnect(voiceChannel: VoiceChannel | VoiceConnection) {
        if (voiceChannel instanceof VoiceChannel) voiceChannel.leave();
        else if (voiceChannel instanceof VoiceConnection) voiceChannel.disconnect();
    };
    /**
     * Stops the dispatcher
     * @param {Snowflake} guildID The ID of the guild
     */
    public stop(guildID: Snowflake) {
        return this.getServerQueue(guildID).dispatcher.pause();
    };
    /**
     * Resumes the dispatcher
     * @param {Snowflake} guildID The ID of the guild
     */
    public resume(guildID: Snowflake) {
        return this.getServerQueue(guildID).dispatcher.resume();
    };
    /**
     * Set's the volume of the dispatcher
     * @param {Snowflake} guildID The ID of the guild
     * @param {number} volume The volume (`0` - `100`) 
     */
    public setVolume(guildID: Snowflake, volume: number) {
        this.getServerQueue(guildID).volume = volume;
        return this.getServerQueue(guildID).dispatcher.setVolume(volume / 100);
    };
    /**
     * Returns a new shuffled queue
     * @param {Snowflake} guildID The ID of the guild
     */
    public shuffle(guildID: Snowflake): Array<Song> {
        const newShuffledQueue = this.getQueue(guildID);
        let newPos: number;
        let temp: Song;
        for (let i = newShuffledQueue.length - 1; i > 0; i--) {
            newPos = Math.floor(Math.random() * (i + 1));
            temp = newShuffledQueue[i];
            newShuffledQueue[i] = newShuffledQueue[newPos];
            newShuffledQueue[newPos] = temp;
        };
        return this.getServerQueue(guildID).songs = newShuffledQueue;
    };
    /**
     * Set's the seek of the current track
     * @param {Snowflake} guildID The ID of the guild 
     * @param {number} time The seek in milliseconds 
     */
    public seek(guildID: string, time: number) {
        this.getServerQueue(guildID).beginAt = time;
        return this.play(guildID);
    };
    /**
     * Set's the auto play mode
     * @param {Snowflake} guildID The ID of the guild
     * @param {number} mode The number (`0` - disabled, `1` - enabled) 
     */
    public setAutoPlay(guildID: Snowflake, mode: 0 | 1) {
        return this.getServerQueue(guildID).autoPlay = mode == 0 ? false : true;
    };
    /**
     * Adds a video related to the current track
     * @param {Snowflake} guildID The ID of the guild 
     */
    public async addRelatedVideo(guildID: Snowflake) {
        const queue = this.getQueue(guildID);
        if (queue.length < 1) return;
        const song = queue[0];
        const relatedVideos = (await ytdl.getBasicInfo(song.url)).related_videos;
        if (relatedVideos.length == 0) return;
        return this.addToQueue(guildID, relatedVideos[0].id);
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
     * @param {Snowflake} guildID The ID of the guild
     * @param {string} videoID The ID of the YouTube video 
     * @param {User} user The user
     */
    public async addToQueue(guildID: Snowflake, videoID: string, user?: User) {
        const video = await ytSearch({ videoId: videoID }).catch(err => console.log(err));
        if (!video) return;
        this.getQueue(guildID).push({
            ...video,
            user: user
        });
    };
};