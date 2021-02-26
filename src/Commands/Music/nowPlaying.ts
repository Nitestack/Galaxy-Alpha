import Command, { CommandRunner } from "@root/Command";
import durationConverter from "humanize-duration";

export default class NowPlayingCommand extends Command {
    constructor() {
        super({
            name: "now",
            aliases: ["nowplaying", "np"],
            description: "shows some infos about the current track",
            category: "music",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (client.music.getServerQueue(message).isEmpty) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no queue in this server!"));
        const video = client.music.getQueue(message)[0];
        return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription(`**<:youtube:786675436733857793> [${video.title}](${video.url})**
            *uploaded by [${video.author.name}](${video.author.url}) on ${video.uploadDate} (${video.ago})*
            
            **Duration:** ${client.util.getDuration(video.duration.seconds * 1000)} (${durationConverter(video.duration.seconds * 1000, {
                units: ["h", "m", "s"],
                round: true
            })})
            **Views:** ${video.views.toLocaleString()} views
            **Genre:** ${client.util.toUpperCaseBeginning(video.genre)}

            **Time left:** ${client.util.getDuration(client.music.getServerQueue(message).currentTimestamp)}/${client.util.getDuration(video.duration.seconds * 1000)}`)
            .setThumbnail(video.thumbnail));
    };
};