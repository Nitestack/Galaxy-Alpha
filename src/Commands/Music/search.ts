import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";
import { videoFinder, playlistFinder } from "@commands/Music/Music";
import ytSearch from "yt-search";
import duration from "humanize-duration";

export default class SearchCommand extends Command {
    constructor() {
        super({
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
        const videoResults = await (await playlistFinder(args.join(" ")) ? playlistFinder(args.join(" ")) : (await videoFinder(args.join(" ")) ? await videoFinder(args.join(" ")) : null));
        if (!videoResults) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription(`Cannot find any results, that includes \`${args.join(" ")}\`! Please try again!`));
        if (videoResults.type == "list") {
            const playList = await ytSearch({ listId: videoResults.listId });
            return message.channel.send(client.createEmbed()
                .setTitle(`<:youtube:786675436733857793> ${playList.title}`)
                .setURL(playList.url)
                .setDescription(`*uploaded by [${playList.author.name}](${playList.author.url})* on ${playList.date}
                
                **Videos:** ${playList.videos.length}`)
                .setImage(playList.image));
        } else {
            const video = await ytSearch({ videoId: videoResults.videoId });
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
};