import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";
import { ReactionCollector } from "discord.js";
import duration from "humanize-duration";
import canvacord from "canvacord";

module.exports = class MusicPanelCommand extends Command {
    constructor(client) {
        super(client, {
            name: "panel",
            description: "sends a music panel to control the music",
            guildOnly: true,
            category: "music"
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        if (!message.member.voice.channel) return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && client.queue.get(message.guild.id).queue && client.queue.get(message.guild.id).queue.length > 0) {
            if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            let queue = client.queue.get(message.guild.id).queue;
            let song = 0;
            const panel = canvacord.Spotify();
            return message.channel.send(client.createEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`**<:youtube:786675436733857793> [${queue[0].title}](${queue[0].url})**
                *uploaded by [${queue[0].author.name}](${queue[0].author.url}) on ${queue[0].uploadDate} (${queue[0].ago})*
                
                **Duration:** ${client.util.getDuration(queue[0].duration.seconds * 1000)} (${duration(queue[0].duration.seconds * 1000, {
                    units: ["h", "m", "s"],
                    round: true
                })})
                **Views:** ${queue[0].views.toLocaleString()} views
                **Genre:** ${client.util.toUpperCaseBeginning(queue[0].genre)}
                
                ⏮️ ▶️ ⏭️`)
                .setImage(queue[0].image)).then(msg => {
                    client.queue.set(message.guild.id, {
                        beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                        dispatcher: client.queue.get(message.guild.id).dispatcher,
                        guildID: message.guild.id,
                        multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                        nowPlaying: client.queue.get(message.guild.id).nowPlaying,
                        panel: msg,
                        queue: client.queue.get(message.guild.id).queue,
                        shuffle: client.queue.get(message.guild.id).shuffle,
                        singleLoop: client.queue.get(message.guild.id).singleLoop,
                        stopToPlay: client.queue.get(message.guild.id).stopToPlay,
                        voiceChannel: client.queue.get(message.guild.id).voiceChannel
                    });
                    const reactionArray: Array<string> = ["⏮️", "⏯️", "⏭️", "🔁", "🔂"];
                    reactionArray.forEach(async reaction => await msg.react(reaction));
                    const Buttons: ReactionCollector = msg.createReactionCollector((reaction, user) => !user.bot && reactionArray.includes(reaction.emoji.name));
                    Buttons.on("collect", (reaction, user) => {
                        if (reaction.emoji.name == "⏮️") {
                            if (song == 0) song = queue.length - 1;
                            else song--;
                            if (client.queue.get(message.guild.id).shuffle) queue = client.music.shuffle(queue);
                            client.music.play(message, message.member.voice.channel, queue[song].videoID, false, prefix, null, false, true);
                            msg.edit(msg.embeds[0]
                                .setDescription(`**<:youtube:786675436733857793> [${queue[song].title}](${queue[song].url})**
                                *uploaded by [${queue[song].author.name}](${queue[song].author.url}) on ${queue[song].uploadDate} (${queue[song].ago})*
                                
                                **Duration:** ${client.util.getDuration(queue[song].duration.seconds * 1000)} (${duration(queue[song].duration.seconds * 1000, {
                                    units: ["h", "m", "s"],
                                    round: true
                                })})
                                **Views:** ${queue[song].views.toLocaleString()} views
                                **Genre:** ${client.util.toUpperCaseBeginning(queue[song].genre)}
                                
                                ⏮️ ▶️ ⏭️`)
                                .setImage(queue[song].image));
                        } else if (reaction.emoji.name == "⏭️") {
                            if (song == queue.length - 1) song = 0;
                            else song++;
                            if (client.queue.get(message.guild.id).shuffle) queue = client.music.shuffle(queue);
                            client.music.play(message, message.member.voice.channel, queue[song].videoID, false, prefix, null, false, true);
                            msg.edit(msg.embeds[0]
                                .setDescription(`**<:youtube:786675436733857793> [${queue[song].title}](${queue[song].url})**
                                *uploaded by [${queue[song].author.name}](${queue[song].author.url}) on ${queue[song].uploadDate} (${queue[song].ago})*
                                
                                **Duration:** ${client.util.getDuration(queue[song].duration.seconds * 1000)} (${duration(queue[song].duration.seconds * 1000, {
                                    units: ["h", "m", "s"],
                                    round: true
                                })})
                                **Views:** ${queue[song].views.toLocaleString()} views
                                **Genre:** ${client.util.toUpperCaseBeginning(queue[song].genre)}
                                
                                ⏮️ ▶️ ⏭️`)
                                .setImage(queue[song].image));
                        } else if (reaction.emoji.name == "⏯️") {
                            if (client.queue.get(message.guild.id).nowPlaying) {
                                client.music.stop(client.queue.get(message.guild.id).dispatcher);
                                client.queue.set(message.guild.id, {
                                    guildID: message.guild.id,
                                    queue: client.queue.get(message.guild.id).queue,
                                    nowPlaying: false,
                                    dispatcher: client.queue.get(message.guild.id).dispatcher,
                                    voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                                    beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                                    stopToPlay: new Date(),
                                    singleLoop: client.queue.get(message.guild.id).singleLoop,
                                    multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                                    shuffle: client.queue.get(message.guild.id).shuffle
                                });
                                msg.edit(msg.embeds[0].setDescription(msg.embeds[0].description.replace(/⏮️ ▶️ ⏭️/g, "⏮️ ⏸️ ⏭️")));
                            } else {
                                client.music.resume(client.queue.get(message.guild.id).dispatcher);
                                const timeUsed = client.queue.get(message.guild.id).stopToPlay.getTime() - client.queue.get(message.guild.id).beginningToPlay.getTime();
                                client.queue.set(message.guild.id, {
                                    guildID: message.guild.id,
                                    queue: client.queue.get(message.guild.id).queue,
                                    nowPlaying: true,
                                    dispatcher: client.queue.get(message.guild.id).dispatcher,
                                    voiceChannel: client.queue.get(message.guild.id).voiceChannel,
                                    beginningToPlay: new Date(Date.now() - timeUsed),
                                    stopToPlay: null,
                                    singleLoop: client.queue.get(message.guild.id).singleLoop,
                                    multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                                    shuffle: client.queue.get(message.guild.id).shuffle
                                });
                                msg.edit(msg.embeds[0].setDescription(msg.embeds[0].description.replace(/⏮️ ⏸️ ⏭️/g, "⏮️ ▶️ ⏭️")));
                            };
                        } else if (reaction.emoji.name == "🔁" && queue.length > 1) {
                            client.queue.set(message.guild.id, {
                                beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                                dispatcher: client.queue.get(message.guild.id).dispatcher,
                                guildID: message.guild.id,
                                multipleLoop: true,
                                nowPlaying: client.queue.get(message.guild.id).nowPlaying,
                                panel: client.queue.get(message.guild.id).panel,
                                queue: client.queue.get(message.guild.id).queue,
                                shuffle: client.queue.get(message.guild.id).shuffle,
                                singleLoop: false,
                                stopToPlay: client.queue.get(message.guild.id).stopToPlay,
                                voiceChannel: client.queue.get(message.guild.id).voiceChannel
                            });
                        } else if (reaction.emoji.name == "🔂") {
                            client.queue.set(message.guild.id, {
                                beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                                dispatcher: client.queue.get(message.guild.id).dispatcher,
                                guildID: message.guild.id,
                                multipleLoop: false,
                                nowPlaying: client.queue.get(message.guild.id).nowPlaying,
                                panel: client.queue.get(message.guild.id).panel,
                                queue: client.queue.get(message.guild.id).queue,
                                shuffle: false,
                                singleLoop: true,
                                stopToPlay: client.queue.get(message.guild.id).stopToPlay,
                                voiceChannel: client.queue.get(message.guild.id).voiceChannel
                            });
                        };
                        msg.reactions.cache.get(reaction.emoji.name).users.remove(user.id);
                    });
                    Buttons.on("end", (collected, reason) => {
                        Buttons.stop();
                        return client.queue.set(message.guild.id, {
                            beginningToPlay: client.queue.get(message.guild.id).beginningToPlay,
                            dispatcher: client.queue.get(message.guild.id).dispatcher,
                            guildID: message.guild.id,
                            multipleLoop: client.queue.get(message.guild.id).multipleLoop,
                            nowPlaying: client.queue.get(message.guild.id).nowPlaying,
                            panel: null,
                            queue: client.queue.get(message.guild.id).queue,
                            shuffle: client.queue.get(message.guild.id).shuffle,
                            singleLoop: client.queue.get(message.guild.id).singleLoop,
                            stopToPlay: client.queue.get(message.guild.id).stopToPlay,
                            voiceChannel: client.queue.get(message.guild.id).voiceChannel
                        });
                    });
                });
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        };
    };
};