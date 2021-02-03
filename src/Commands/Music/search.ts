import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";
import { videoFinder } from "@commands/Music/Music";

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
        const video = await videoFinder(args.join(" "));
        if (!video) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription(`Cannot find any results, that includes \`${args.join(" ")}\`! Please try again!`));
        return message.channel.send(client.createEmbed()
            .setTitle(`<:youtube:786675436733857793> ${video.title}`)
            .setURL(video.url)
            .setDescription(`*uploaded by [${video.author.name}](${video.author.url})*
                    
            **${video.description}**
            
            **Duration:** ${video.duration}
            **Views:** ${video.views.toLocaleString()} views`)
            .setImage(video.image));
    };
};