import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";
import { getDuration } from "@root/util";

module.exports = class NowPlayingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "now",
            aliases: ["nowplaying", "np"],
            description: "shows some infos about the current track",
            category: "music",
            guildOnly: true
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        const dispatcher = client.queue.get(message.guild.id) ? (client.queue.get(message.guild.id).dispatcher ? client.queue.get(message.guild.id).dispatcher : null) : null;
        if (!dispatcher) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no voice connection!"));
        const video = client.queue.get(message.guild.id).queue[0];
        const duration = (message.createdTimestamp - client.queue.get(message.guild.id).beginningToPlay.getTime()) / 1000;
        const timeUsed = client.queue.get(message.guild.id).stopToPlay ? client.queue.get(message.guild.id).stopToPlay.getTime() - client.queue.get(message.guild.id).beginningToPlay.getTime() : null;
        return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription(`**<:youtube:786675436733857793> [${video.title}](${video.url})**
            *uploaded by [${video.author.name}](${video.author.url})*
            
            **${video.description}**
            
            **Duration:** ${video.duration}
            **Views:** ${video.views.toLocaleString()} views
            
            **Time left: ${client.queue.get(message.guild.id).stopToPlay ? getDuration(timeUsed / 1000) : getDuration(duration)} / ${video.duration.timestamp}**`));
    };
};