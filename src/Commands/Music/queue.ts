import { Message, StreamDispatcher, User, VoiceConnection } from "discord.js";
import { VideoMetadataResult } from "yt-search";
import { Readable } from "stream";

export interface Song extends VideoMetadataResult {
    user: User;
};

export default class Queue {
    constructor(public message: Message) { };
    public songs: Array<Song> = [];
    public nowPlaying: boolean = false;
    public dispatcher: StreamDispatcher = null;
    public connection: VoiceConnection = null;
    public volume: number = 50;
    /**
     * `0` = disabled, `1` = song loop, `2` = queue loop
     */
    public loopMode: 0 | 1 | 2 = 0;
    public beginningToPlay: number = null;
    public beginAt: number = 0;
    public stopToPlay: number = null;
    public stream: Readable = null;
    public shuffle: boolean = false;
    public autoPlay: boolean = false;
    public panel?: Message = null;
    public get isEmpty() {
        return this.songs.length > 0 ? false : true;
    };
    public get queueDurationTimestamp() {
        return this.songs.reduce((prev, next) => prev + next.duration.seconds * 1000, 0);
    };
    public get queueDurationAt() {
        return new Date(this.queueDurationTimestamp);
    };
    public get currentAt() {
        return new Date(this.currentTimestamp);
    };
    public get currentTimestamp() {
        return this.dispatcher.streamTime + this.beginAt;
    };
    public clearQueue() {
        return this.songs = [];
    };
};