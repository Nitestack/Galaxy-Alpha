import Command from '@root/Command';
import { VoiceChannel } from 'discord.js';
import ytSearch from 'yt-search';
import ytdl from 'ytdl-core';

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "play",
            description: "plays an YouTube audio",
            usage: "play <YouTube link/keywords>",
            category: "music",
            guildOnly: true
        });
    };
    async run(client, message, args, prefix) {
        const embed = client.createRedEmbed(true, `${prefix}play <YouTube link/keywords>`).setTitle("🎧 Music Manager");
        const voiceChannel: VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(embed.setDescription('You need to be in a voice channel to use this command!'));
        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('SPEAK')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('VIEW_CHANNEL')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!args.length) return message.channel.send(embed.setDescription("You need to send keywords or an valid YouTube link to let me play music!"));

        const video = await videoFinder(args.join(' '));
        if (validURL(args[0])) {
            const connection = await voiceChannel.join();
            const stream = ytdl(args[0], { filter: 'audioonly' });
            connection.play(stream, { seek: 0, volume: 1 }).on('finish', () => {
                voiceChannel.leave();
            });
            const playingEmbed = client.createEmbed()
                .setTitle(`🎧 Connected to \`${voiceChannel.name}\`!`)
                .setDescription(`**<:youtube:786675436733857793> [${video.title}](${validURL(args[0])})**
                *uploaded by [${video.author.name}](${video.author.url})*
                
                **${video.description}**
                
                **Duration:** ${video.duration}
                **Views:** ${video.views.toLocaleString()} views`)
                .setImage(video.image);
            return await message.channel.send(playingEmbed);
        };
        const connection = await voiceChannel.join();
        if (video) {
            const stream = ytdl(video.url, { filter: 'audioonly' });
            connection.play(stream, { seek: 0, volume: 1 }).on('finish', () => {
                voiceChannel.leave();
            });
            const playingEmbed = client.createEmbed()
                .setTitle(`🎧 Connected to \`${voiceChannel.name}\`!`)
                .setDescription(`**<:youtube:786675436733857793> [${video.title}](${video.url})**
                *uploaded by [${video.author.name}](${video.author.url})*
                
                **${video.description}**
                
                **Duration:** ${video.duration}
                **Views:** ${video.views.toLocaleString()} views`)
                .setImage(video.image);

            return await message.channel.send(playingEmbed);
        } else {
            return message.channel.send(embed.setDescription(`Cannot find any results, that includes \`${args.join(" ")}\`! Please try again!`));
        };
    };
};

function validURL(str: string): Boolean {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
        return false;
    } else {
        return true;
    }
};

async function videoFinder(query: string) {
    const videoResult = await ytSearch(query);
    return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
};