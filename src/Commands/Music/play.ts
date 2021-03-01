import Command, { CommandRunner } from '@root/Command';
import { VoiceChannel } from 'discord.js';
import ytSearch from "yt-search";
import duration from "humanize-duration";
import ytdl from "ytdl-core";

export default class PlayCommand extends Command {
    constructor() {
        super({
            name: "play",
            description: "plays an YouTube audio",
            usage: "play <YouTube link/keywords>",
            category: "music",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const max: number = 20;
        const embed = client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🎧 Music Manager");
        const voiceChannel: VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(embed.setDescription('You need to be in a voice channel to use this command!'));
        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('SPEAK')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('VIEW_CHANNEL')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (message.guild.me.voice.channel && voiceChannel.id != message.guild.me.voice.channel.id) return message.channel.send(embed.setDescription("You need to be in the same voice channel, where I am!"));
        if (!args.length) return message.channel.send(embed.setDescription("You need to send keywords or an valid YouTube link to let me play music!"));
        const query: string = args.join(" ");
        if (!message.guild.me.voice.channel) await voiceChannel.join();
        if (ytdl.validateURL(query)) {
            const videoInfos = await ytdl.getInfo(query, {
                lang: "en"
            });
            const video = await ytSearch({ videoId: videoInfos.videoDetails.videoId });
            if (!client.music.getServerQueue(message).isEmpty) message.channel.send(client.createEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`Added the song to the queue!
                
                **<:youtube:786675436733857793> [${video.title}](${video.url})**
                *uploaded by [${video.author.name}](${video.author.url}) on ${video.uploadDate} (${video.ago})*
                
                **Duration:** ${client.util.getDuration(video.duration.seconds * 1000)} (${duration(video.duration.seconds * 1000, {
                    units: ["h", "m", "s"],
                    round: true
                })})
                **Views:** ${video.views.toLocaleString()} views
                **Genre:** ${client.util.toUpperCaseBeginning(video.genre)}`)
                .setImage(video.image));
            client.music.addToQueue(message, video.videoId);
            if (client.music.getQueue(message).length <= 1) await client.music.play(message);
        } else {
            const videoResults = (await client.music.videoFinder(query)) ? (await client.music.videoFinder(query)) : ((await client.music.playlistFinder(query)) ? (await client.music.playlistFinder(query)) : null);
            if (!videoResults) return message.channel.send(embed.setDescription(`Cannot find any results, that includes \`${query}\`! Please try again!`));
            if (videoResults.type == "list") {
                const playList = await ytSearch({ listId: videoResults.listId });
                const maxPlaylist = playList.videos.splice(0, max);
                if (!client.music.getServerQueue(message).isEmpty) {
                    message.channel.send(client.createEmbed()
                        .setTitle("🎧 Music Manager")
                        .setDescription(`Added the playlist with \`${playList.videos.length > max ? max : playList.videos.length}\` videos to the queue!
                        
                        **<:youtube:786675436733857793> [${playList.title}](${playList.url})**
                        *uploaded by [${playList.author.name}](${playList.author.url})* on ${playList.date}`));
                };
                for (const video of maxPlaylist) await client.music.addToQueue(message, video.videoId);
                if (client.music.getQueue(message).length <= maxPlaylist.length) {
                    message.channel.send(client.createEmbed()
                        .setTitle(`🎧 Music Manager`)
                        .setDescription(`**<:youtube:786675436733857793> [${playList.title}](${playList.url})**
                        *uploaded by [${playList.author.name}](${playList.author.url})*`));
                    await client.music.play(message);
                };
            } else {
                const video = await ytSearch({ videoId: videoResults.videoId });
                if (!client.music.getServerQueue(message).isEmpty) {
                    message.channel.send(client.createEmbed()
                        .setTitle("🎧 Music Manager")
                        .setDescription(`Added the song to the queue!
                        
                        **<:youtube:786675436733857793> [${video.title}](${video.url})**
                        *uploaded by [${video.author.name}](${video.author.url}) on ${video.uploadDate} (${video.ago})*
                        
                        **Duration:** ${client.util.getDuration(video.duration.seconds * 1000)} (${duration(video.duration.seconds * 1000, {
                            units: ["h", "m", "s"],
                            round: true
                        })})
                        **Views:** ${video.views.toLocaleString()} views
                        **Genre:** ${client.util.toUpperCaseBeginning(video.genre)}`)
                        .setImage(video.image));
                };
                await client.music.addToQueue(message, videoResults.videoId);
                if (client.music.getQueue(message).length <= 1) await client.music.play(message);
            };
        };
    };
};