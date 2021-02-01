import GalaxyAlpha from "@root/Client";
import { Message, MessageEmbed, VoiceChannel } from "discord.js";
import ytSearch from "yt-search";
import ytdl from "ytdl-core";

export default class Music {
    private client: GalaxyAlpha;
    constructor(client: GalaxyAlpha) {
        this.client = client;
    };
    async play(message: Message, voiceChannel: VoiceChannel, keywordOrURL: string, noSkip: boolean = true, prefix?: string, usage?: string) {
        if (!this.client.queue.has(message.guild.id) || !this.client.queue.get(message.guild.id).queue) this.client.queue.set(message.guild.id, {
            guildID: message.guild.id,
            queue: [],
            nowPlaying: false
        });
        const connection = await voiceChannel.join();
        async function playSong(MusicManager: Music, keywordOrURLToPlay: string) {
            const videoInfos = await videoFinder(keywordOrURLToPlay);
            if (!videoInfos) return message.channel.send(MusicManager.client.createRedEmbed(true, `${prefix}${usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription(`Cannot find any results, that includes \`${keywordOrURLToPlay}\``));
            const dispatcher = connection.play(ytdl(videoInfos.url, { filter: 'audioonly' }), { seek: 0, volume: 1 });
            dispatcher.on("finish", () => {
                if (noSkip) {
                    const queue = MusicManager.client.queue.get(message.guild.id).queue;
                    queue.shift();
                    MusicManager.client.queue.set(message.guild.id, {
                        guildID: message.guild.id,
                        queue: queue || [],
                        nowPlaying: false
                    });
                    if (MusicManager.client.queue.get(message.guild.id).queue.length > 0) {
                        playSong(MusicManager, MusicManager.client.queue.get(message.guild.id).queue[0].title);
                    } else {
                        MusicManager.client.queue.delete(message.guild.id);
                        return voiceChannel.leave();
                    };
                };
            });
            dispatcher.on("close", () => MusicManager.client.queue.delete(message.guild.id));
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
                guildID: message.guild.id
            });
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
};

export async function videoFinder(query: string) {
    const videoResult = await ytSearch(query);
    return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
};