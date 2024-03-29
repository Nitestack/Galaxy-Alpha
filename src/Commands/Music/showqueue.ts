import Command, { CommandRunner } from "@root/Command";
import { MessageEmbed } from "discord.js";
import { Song } from "./Queue";

export default class QueueCommand extends Command {
    constructor() {
        super({
            name: "queue",
            description: "shows the queue of the server",
            category: "music",
            guildOnly: true,
            usage: "queue [clear]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const queue = client.music.getQueue(message);
        if (!queue) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no queue in this server!"));
        if (args[0] && args[0].toLowerCase() == "clear") {
            client.music.getServerQueue(message).clearQueue();
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription("Cleared the queue of this server!"));
        } else {
            let page: number = 0;
            const embedArray: Array<MessageEmbed> = generateQueueEmbed(client.music.getQueue(message));
            const msg = await message.channel.send(embedArray[0]);
            if (embedArray.length > 1) {
                await msg.react('ℹ️');
                await msg.react('◀️');
                await msg.react('▶️');
                const filter = (reaction, user) => (reaction.emoji.name == '◀️' || reaction.emoji.name == '▶️' || reaction.emoji.name == 'ℹ️') && user.id == message.author.id;
                const Buttons = msg.createReactionCollector(filter, { time: 24 * 60 * 60 * 1000 });
                Buttons.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name == '◀️') {
                        if (page == 0) {
                            if (message.channel.type != "dm") {
                                msg.reactions.cache.get("◀️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[embedArray.length - 1]);
                            page = embedArray.length - 1;
                        } else {
                            page--;
                            if (message.channel.type != "dm") {
                                msg.reactions.cache.get("◀️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[page]);
                        };
                    } else if (reaction.emoji.name == '▶️') {//TO FIX
                        if (page > embedArray.length + 1) {
                            if (message.channel.type != "dm") {
                                msg.reactions.cache.get("▶️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[0]);
                            page = 0;
                        } else {
                            page++;
                            if (message.channel.type != "dm") {
                                msg.reactions.cache.get("▶️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[page]);
                        };
                    } else {
                        if (page == 0) {
                            if (message.channel.type != "dm") {
                                msg.reactions.cache.get("ℹ️").users.remove(user.id);
                            };
                        } else {
                            if (message.channel.type != "dm") {
                                msg.reactions.cache.get("ℹ️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[0]);
                            page = 0;
                        };
                    };
                });
            };
        };

        function generateQueueEmbed(queue: Array<Song>): Array<MessageEmbed> {
            const embeds = [];
            let k = 5;
            let position = 1;
            for (let i = 0; i < queue.length; i += 5) {
                const current = queue.slice(i, k);
                k += 5;
                const embed = client.createEmbed().setTitle("🎧 Music Manager");
                current.forEach(song => {
                    if (position == 1) {
                        embed.addField("Now Playing", `\`${position++}. \` [${song.title}](${song.url})\n\`${client.util.getDuration(song.duration.seconds * 1000)}\` requested by ${song.user}`);
                    } else if (position == 2) {
                        embed.addField("Up next", `\`${position++}. \` [${song.title}](${song.url})\n\`${client.util.getDuration(song.duration.seconds * 1000)}\` requested by ${song.user}`)
                    } else {
                        embed.addField("•", `\`${position++}. \` [${song.title}](${song.url})\n\`${client.util.getDuration(song.duration.seconds * 1000)}\` requested by ${song.user}`)
                    };
                });
                embeds.push(embed);
            };
            return embeds;
        };
    };
};