import Command, { CommandRunner } from "@root/Command";
import { MessageAttachment, ReactionCollector } from "discord.js";
import duration from "humanize-duration";
import canvacord from "canvacord";

export default class MusicPanelCommand extends Command {
    constructor() {
        super({
            name: "panel",
            description: "sends a music panel to control the music",
            guildOnly: true,
            category: "music",
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!message.member.voice.channel) return message.channel.send(client.createEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.music.getQueue(message.guild.id).length > 0) {
            if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            let song = 0;
            let queue = client.music.getQueue(message.guild.id);
            const panel = new canvacord.Spotify()
                .setAuthor(queue[0].author.name)
                .setBackground("IMAGE", "https://www.mobilebeat.com/wp-content/uploads/2016/07/Background-Music-768x576-1280x720.jpg")
                .setEndTimestamp(queue[0].duration.seconds * 1000)
                .setStartTimestamp(Date.now() - client.queue.get(message.guild.id).beginningToPlay.getTime())
                .setTitle(queue[0].title);
            const buffer = await panel.build();
            const attachment = new MessageAttachment(buffer, "song.png");
            const msg = await message.channel.send(attachment);
            client.queue.set(message.guild.id, {
                ...client.queue.get(message.guild.id),
                guildID: message.guild.id,
                panel: msg,
            });
            const reactionArray: Array<string> = ["⏮️", "⏯️", "⏭️", "🔁", "🔂"];
            reactionArray.forEach(async reaction => await msg.react(reaction));
            const Buttons: ReactionCollector = msg.createReactionCollector((reaction, user) => !user.bot && reactionArray.includes(reaction.emoji.name));
            Buttons.on("collect", (reaction, user) => {
                const serverQueue = client.queue.get(message.guild.id);
                if (reaction.emoji.name == "⏮️") {
                    if (song == 0) song = queue.length - 1;
                    else song--;
                    if (client.queue.get(message.guild.id).shuffle) queue = client.music.shuffle(queue);
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
                    client.queue.get(message.guild.id).dispatcher.emit("finish");
                    msg.edit(msg.embeds[0].setDescription(`**<:youtube:786675436733857793> [${queue[song].title}](${queue[song].url})**
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
                            ...serverQueue,
                            nowPlaying: false,
                            stopToPlay: new Date()
                        });
                        msg.edit(msg.embeds[0].setDescription(msg.embeds[0].description.replace(/⏮️ ▶️ ⏭️/g, "⏮️ ⏸️ ⏭️")));
                    } else {
                        client.music.resume(client.queue.get(message.guild.id).dispatcher);
                        const timeUsed = client.queue.get(message.guild.id).stopToPlay.getTime() - client.queue.get(message.guild.id).beginningToPlay.getTime();
                        client.queue.set(message.guild.id, {
                            ...serverQueue,
                            nowPlaying: true,
                            beginningToPlay: new Date(Date.now() - timeUsed),
                            stopToPlay: null
                        });
                        msg.edit(msg.embeds[0].setDescription(msg.embeds[0].description.replace(/⏮️ ⏸️ ⏭️/g, "⏮️ ▶️ ⏭️")));
                    };
                } else if (reaction.emoji.name == "🔁" && queue.length > 1) {
                    client.queue.set(message.guild.id, {
                        ...serverQueue,
                        multipleLoop: true,
                        singleLoop: false
                    });
                } else if (reaction.emoji.name == "🔂") {
                    client.queue.set(message.guild.id, {
                        ...serverQueue,
                        multipleLoop: false,
                        shuffle: false,
                        singleLoop: true
                    });
                };
                msg.reactions.cache.get(reaction.emoji.name).users.remove(user.id);
            });
            Buttons.on("end", (collected, reason) => {
                Buttons.stop();
                const serverQueue = client.queue.get(message.guild.id);
                return client.queue.set(message.guild.id, {
                    ...serverQueue,
                    panel: null
                });
            });
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
        };
    };
};