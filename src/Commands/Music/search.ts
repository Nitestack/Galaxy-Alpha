import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";
import { videoFinder } from "@commands/Music/Music";
import ytSearch from "yt-search";
import duration from "humanize-duration";

module.exports = class SearchCommand extends Command {
    constructor(client) {
        super(client, {
            name: "search",
            description: "searches a song on YouTube",
            category: "music",
            usage: "search <keywords/YouTube link>"
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        if (!args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You have to provide a link or keywords of the YouTube video!"));
        const videoSearching = await videoFinder(args.join(" "));
        if (!videoSearching) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription(`Cannot find any results, that includes \`${args.join(" ")}\`! Please try again!`));
        const video = await ytSearch({
            videoId: videoSearching.videoId
        });
        return message.channel.send(client.createEmbed()
            .setTitle(`<:youtube:786675436733857793> ${video.title}`)
            .setURL(video.url)
            .setDescription(`*uploaded by [${video.author.name}](${video.author.url}) on ${video.uploadDate} (${video.ago})*
                    
            **Duration:** ${client.util.getDuration(video.duration.seconds * 1000)} (${duration(video.duration.seconds * 1000, {
                round: true,
                units: ["h", "m", "s"]
            })})
            **Views:** ${video.views.toLocaleString()} views
            **Genre:** ${client.util.toUpperCaseBeginning(video.genre)}`)
            .setImage(video.image));
    };
};