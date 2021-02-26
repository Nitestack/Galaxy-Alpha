import Command, { CommandRunner } from '@root/Command';
import { Message, VoiceChannel } from 'discord.js';
import ytSearch from "yt-search";
import duration from "humanize-duration";
import GalaxyAlpha from '@root/Client';
import Queue from './Queue';

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
        if (!args.length) return message.channel.send(embed.setDescription("You need to send keywords or an valid YouTube link to let me play music!"));
        const videoResults = await (await client.music.playlistFinder(args.join(" ")) ? client.music.playlistFinder(args.join(" ")) : (await client.music.videoFinder(args.join(" ")) ? await client.music.videoFinder(args.join(" ")) : null));
        if (!videoResults) return message.channel.send(embed.setDescription(`Cannot find any results, that includes \`${args.join(" ")}\`! Please try again!`));
        if (!client.music.getServerQueue(message).isEmpty) {
            if (voiceChannel.id != client.music.getServerQueue(message).message.guild.me.voice.channel.id) return message.channel.send(embed.setDescription("You need to be in the same voice channel, where I am!"));
            if (videoResults.type == "list") {
                const playList = await ytSearch({ listId: videoResults.listId });
                playList.videos.forEach(async video => await client.music.addToQueue(message, video.videoId));
                return message.channel.send(client.createEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription(`Added the playlist with \`${playList.videos.length > max ? max : playList.videos.length}\` videos to the queue!
                    
                    **<:youtube:786675436733857793> [${playList.title}](${playList.url})**
                    *uploaded by [${playList.author.name}](${playList.author.url})* on ${playList.date}`));
            } else {
                await client.music.addToQueue(message, videoResults.videoId);
                const video = await ytSearch({ videoId: videoResults.videoId });
                return message.channel.send(client.createEmbed()
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
        } else {
            client.queue.set(message.guild.id, new Queue(message));
            client.music.play(message);
            if (videoResults.type == "list") {
                const playList = await ytSearch({ listId: videoResults.listId });
                message.channel.send(client.createEmbed()
                    .setTitle(`🎧 Music Manager`)
                    .setDescription(`**<:youtube:786675436733857793> [${playList.title}](${playList.url})**
                    *uploaded by [${playList.author.name}](${playList.author.url})*`));
                const maxPlaylist = playList.videos.splice(0, max);
                for (const video of maxPlaylist) await client.music.addToQueue(message, video.videoId);
                return await client.music.play(message);
            } else if (videoResults.type == "video") {
                await client.music.addToQueue(message, videoResults.videoId);
                return await client.music.play(message);
            };
        };
    };
    
};