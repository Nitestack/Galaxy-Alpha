import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";
import { getDuration } from "@root/util";
import { Queue } from "@root/Client";
import { MessageEmbed } from "discord.js";

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: "queue",
            description: "shows the queue of the server",
            category: "music",
            guildOnly: true
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
                singleLoop: false,
                shuffle: false
            });
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("Cleared the queue of this server!"));
        } else {
            return message.channel.send(generateQueueEmbed(client.queue.get(message.guild.id).queue)).then(msg => {
            });
        };

        function generateQueueEmbed(queue: Array<Queue>): Array<MessageEmbed> {
            const embeds = [];
            let k = 10;
            let position = 1;
            for (let i = 0; i < queue.length; i += 10) {
                const current = queue.slice(i, k);
                k += 10;
                const embed = client.createEmbed();
                current.forEach(song => {
                    if (position == 0) {
                        embed.addField("Now Playing", `\`${position++}. \` [${song.title}](${song.url})\n\`${getDuration(song.duration.seconds * 1000)}\` requested by ${message.guild.members.cache.get(song.requesterID).user}`);
                    } else if (position == 1) {
                        embed.addField("Up next", `\`${position++}. \` [${song.title}](${song.url})\n\`${getDuration(song.duration.seconds * 1000)}\` requested by ${message.guild.members.cache.get(song.requesterID).user}`)
                    } else {
                        embed.addField("•", `\`${position++}. \` [${song.title}](${song.url})\n\`${getDuration(song.duration.seconds * 1000)}\` requested by ${message.guild.members.cache.get(song.requesterID).user}`)
                    };
                });
                embeds.push(embed);
            };
            return embeds;
        };
    };
};