import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: "queue",
            description: "shows the queue of the server",
            category: "music"
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        const queue = await client.music.getQueue(message.guild.id);
        if (!queue) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no queue in this server!"));
        if (args[0] && args[0].toLowerCase() == "clear") {
            client.queue.set(message.guild.id, {
                guildID: message.guild.id,
                queue: [],
                nowPlaying: false,
                dispatcher: null,
                voiceChannel: null,
                beginningToPlay: null,
                stopToPlay: null,
                multipleLoop: false,
                singleLoop: false
            });
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("Cleared the queue of this server!"));
        } else {
            const embed = client.createEmbed().setTitle("🎧 Queue");
            for (let i = 0; i < queue.length; i++) {
                const song = queue[i];
                if (i == 0) {
                    embed.addField("Now Playing", `\`${i + 1}. \` [${song.title}](${song.url})\n\`${song.duration}\` requested by ${message.guild.members.cache.get(song.requesterID).user}`);
                } else if (i == 1) {
                    embed.addField("Up next", `\`${i + 1}. \` [${song.title}](${song.url})\n\`${song.duration}\` requested by ${message.guild.members.cache.get(song.requesterID).user}`)
                } else {
                    embed.addField("•", `\`${i + 1}. \` [${song.title}](${song.url})\n\`${song.duration}\` requested by ${message.guild.members.cache.get(song.requesterID).user}`)
                };
            };
            return message.channel.send(embed);
        };
    };
};