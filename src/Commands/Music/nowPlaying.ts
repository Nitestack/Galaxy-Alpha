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
        const dispatcher = client.queue.get(message.guild.id) ? (client.queue.get(message.guild.id).dispatcher ? client.queue.get(message.guild.id).dispatcher : null) : null;
        if (!dispatcher) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no voice connection!"));
        const video = client.queue.get(message.guild.id).queue[0];
        const duration = (message.createdTimestamp - client.queue.get(message.guild.id).beginningToPlay.getTime());
        const timeUsed = client.queue.get(message.guild.id).stopToPlay ? client.queue.get(message.guild.id).stopToPlay.getTime() - client.queue.get(message.guild.id).beginningToPlay.getTime() : null;
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

            **Time left: ${client.queue.get(message.guild.id).stopToPlay ? client.util.getDuration(timeUsed) : client.util.getDuration(duration)} / ${client.util.getDuration(video.duration.seconds * 1000)}**`));
    };
};