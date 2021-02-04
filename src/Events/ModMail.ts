import Event from '@root/Event';
import { Guild, Message, NewsChannel, TextChannel } from 'discord.js';
import GuildSchema from '@models/guild';
import mongoose from 'mongoose';
import GalaxyAlpha from '@root/Client';

const openedTicket = new Map();

module.exports = class ModMail extends Event {
    constructor() {
        super({
            name: "modMail"
        });
    };
    async run(client: GalaxyAlpha, message: Message) {
        if (message.author.bot) return;
        const prefixRegex: RegExp = new RegExp(`^(<@!?${client.user.id}>|${client.globalPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`); //Regular Expression to check if their is a bot mention
        if (!openedTicket.has(message.author.id)) {
            const servers = client.guilds.cache.filter(guild => guild.members.cache.has(message.author.id)).array();
            servers.sort();
            const numbers: Array<string> = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
            const embed = client.createEmbed()
                .setTitle("Mod Mail Manager")
                .setDescription(`Welcome to ${client.user.username}'s Mod Mail Support!\nPlease choose the server, where you want support from!`);
            if (servers.length > 9) {

            } else if (servers.length > 0) {
                for (let i = 0; i < servers.length; i++) {
                    embed.addField(`${servers[i].name}`, numbers[i + 1], true);
                };
                message.channel.send(embed).then(async msg => {
                    for (let i = 0; i < servers.length; i++) {
                        await msg.react(numbers[i + 1]);
                    };
                    const possibleNumbers: Array<string> = numbers.slice(1, servers.length + 1);
                    const reactions = msg.createReactionCollector((reaction, user) => !user.bot && message.author.id == user.id && possibleNumbers.includes(reaction.emoji.name), {
                        max: 1
                    });
                    reactions.on("collect", async (reaction, user) => {
                        const indexOfServer: number = numbers.indexOf(reaction.emoji.name);
                        openedTicket.set(message.author.id, servers[indexOfServer - 1]);
                        const settings = await GuildSchema.findOne({
                            guildID: servers[indexOfServer - 1].id,
                        }, (err: unknown, guild: any) => {
                            if (err) console.log(err);
                            if (!guild) {
                                const newPrefix = new GuildSchema({
                                    _id: mongoose.Types.ObjectId(),
                                    guildID: servers[indexOfServer - 1].id,
                                    guildPrefix: client.globalPrefix,
                                    logChannelID: null,
                                    guildShardID: servers[indexOfServer - 1].shardID,
                                    muteRole: null,
                                    memberRole: null,
                                    ticketCategory: null,
                                    ticketRole: null,
                                    giveawayByPass: null,
                                    giveawayBlackListed: null,
                                    giveawayPing: null,
                                    welcomeMessage: null,
                                    welcomeEmbed: false
                                });
                                return newPrefix.save().catch(err => console.log(err));
                            };
                        });
                        const prefix: string = settings && settings.guildPrefix ? settings.guildPrefix : client.globalPrefix;
                        let mentionPrefix: boolean;
                        if (prefixRegex.test(message.content)) {
                            mentionPrefix = true;
                        } else {
                            mentionPrefix = false;
                        };
                        const [, matchedPrefix] = mentionPrefix ? message.content.match(prefixRegex) : prefix;
                        const channel: TextChannel | NewsChannel = (servers[indexOfServer - 1].channels.cache.filter(channel => channel.type == 'news' || channel.type == 'text').first() as TextChannel | NewsChannel);
                        if (possibleNumbers.includes(reaction.emoji.name)) {
                            return message.channel.send(client.createEmbed()
                                .setTitle("Mod Mail Manager")
                                .setDescription("Please describe your problem in a short sentence!\nYou have 30s to describe your problem!")).then(msg => {
                                    msg.channel.awaitMessages(m => m.author.id == message.author.id && !m.author.bot, { max: 1, time: 30000 }).then(async messageCollected => {
                                        if (messageCollected.size == 0) {
                                            return message.channel.send(client.createRedEmbed()
                                                .setTitle("Mod Mail Manager")
                                                .setDescription("Mod Mail Support cancelled!"));
                                        } else {
                                            let category;
                                            let modMailManager;
                                            await GuildSchema.findOne({
                                                guildID: servers[indexOfServer - 1].id
                                            }, {}, {}, (err, guild) => {
                                                if (err) return console.log(err);
                                                if (!guild || !guild.modMailCategory) {
                                                    category = false;
                                                } else {
                                                    category = servers[indexOfServer - 1].channels.cache.filter(channel => channel.type == 'category').has(guild.modMailCategory) ? servers[indexOfServer - 1].channels.cache.filter(channel => channel.type == 'category').get(guild.modMailCategory) : false;
                                                };
                                                if (!guild.modMailManager) {
                                                    modMailManager = false;
                                                } else {
                                                    modMailManager = servers[indexOfServer - 1].roles.cache.has(guild.modMailManager) ? servers[indexOfServer - 1].roles.cache.get(guild.modMailManager) : false;
                                                };
                                            });
                                            channel.send(client.createEmbed()
                                                .setTitle("Mod Mail Manager")
                                                .setDescription(`New Mod Mail was created by ${message.author}!\n📝 **Reason:** ${messageCollected.first().content ? messageCollected.first().content : "No reason provided!"}`)).then(async msg => {
                                                    message.author.send(client.createGreenEmbed()
                                                        .setTitle("Mod Mail Manager")
                                                        .setDescription(`Your mod mail request was successfully sent to **${servers[indexOfServer - 1].name}**!
                                                    📝 **Reason:** ${messageCollected.first().content ? messageCollected.first().content : "No reason provided!"}`));
                                                    await msg.react(client.yesEmojiID);
                                                    await msg.react(client.noEmojiID);
                                                    const YesOrNo = msg.createReactionCollector((reaction, user) => !user.bot && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1 });
                                                    YesOrNo.on("collect", (reaction, user) => {
                                                        if (reaction.emoji.id == client.yesEmojiID) {
                                                            msg.reactions.cache.get(client.yesEmojiID).users.remove(user.id);
                                                            msg.delete();
                                                            servers[indexOfServer - 1].channels.create(`modmail-${message.author.username}`, {
                                                                type: "text",
                                                                parent: category ? category : null,
                                                                permissionOverwrites: [{
                                                                    id: servers[indexOfServer - 1].id,
                                                                    deny: ["VIEW_CHANNEL"]
                                                                }]
                                                            }).then(async modMailChannel => {
                                                                if (modMailManager) {
                                                                    modMailChannel.createOverwrite(modMailManager, {
                                                                        SEND_MESSAGES: true,
                                                                        VIEW_CHANNEL: true,
                                                                        ATTACH_FILES: true,
                                                                        READ_MESSAGE_HISTORY: true
                                                                    });
                                                                    modMailChannel.send(`${modMailManager}`).then(mseg => mseg.delete({ timeout: 1 }));
                                                                };
                                                                message.author.send(client.createEmbed()
                                                                    .setTitle(`${servers[indexOfServer - 1].name}'s Mod Mail Support`)
                                                                    .setDescription(`Your mod mail request was successfully accepted! Now all messages, that you send in my DM's, will be sent into **${servers[indexOfServer - 1].name}**!`));
                                                                await handleCollectors(modMailChannel, message, mentionPrefix, matchedPrefix, prefix, servers[indexOfServer - 1]);
                                                            });
                                                        } else {
                                                            msg.reactions.cache.get(client.noEmojiID).users.remove(user.id);
                                                            message.author.send(client.createRedEmbed()
                                                                .setTitle("Mod Mail Manager")
                                                                .setDescription(`Your mod mail request in **${servers[indexOfServer - 1].name}** was denied!\nThank you for using ${client.user.username}'s Mod Mail!`));
                                                            setTimeout(() => {
                                                                openedTicket.delete(message.author.id);
                                                            }, 30000);
                                                            return channel.send(client.createRedEmbed()
                                                                .setTitle("Mod Mail Manager")
                                                                .setDescription("Mod Mail was successfully denied!"));
                                                        };
                                                    });
                                                });
                                        };
                                    });
                                });
                        };
                    });
                });
            } else {
                return;
            };
        };
        function handleCollectors(channel: TextChannel | NewsChannel, message: Message, mentionPrefix: boolean, matchedPrefix: string, prefix: string, guild: Guild): Promise<void> {
            const filter = m => m.author.id == message.author.id;
            const guildFilter = m => m.channel.id == channel.id && !m.author.bot
            const DMCollector = message.channel.createMessageCollector(filter);
            const ModMailChannelCollector = channel.createMessageCollector(guildFilter);
            return new Promise((resolve, reject) => {
                DMCollector.on("collect", async (m) => {
                    const files = getAttachment(m.attachments);
                    channel.send(client.createEmbed()
                        .setAuthor(m.author.tag, m.author.displayAvatarURL())
                        .setDescription(`${m.content}`));
                    await m.react(client.yesEmojiID);
                    setTimeout(() => {
                        m.reactions.cache.get(client.yesEmojiID).users.remove(client.user.id);
                    }, 10000);
                });
                ModMailChannelCollector.on("collect", async (m) => {
                    if (m.content.startsWith(`${mentionPrefix ? matchedPrefix : prefix}modmailclose`)) {
                        const reason = m.content.slice((`${mentionPrefix ? matchedPrefix : prefix}modmailclose`).length, m.content.length);
                        m.channel.send(client.createEmbed()
                            .setTitle("Mod Mail Manager")
                            .setDescription(`Do you really want to close the mod mail with ${message.author}?\n📝 **Reason:** ${reason || "No reason provided!"}\n\nYou have 30s to react!`)).then(async msg => {
                                await msg.react(client.yesEmojiID);
                                await msg.react(client.noEmojiID);
                                const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && !user.bot);
                                YesOrNo.on("collect", (reaction, user) => {
                                    if (reaction.emoji.id == client.yesEmojiID) {
                                        msg.reactions.cache.get(client.yesEmojiID).users.remove(user.id);
                                        DMCollector.stop();
                                        ModMailChannelCollector.stop();
                                        resolve();
                                        message.author.send(client.createEmbed()
                                            .setTitle("Mod Mail Manager")
                                            .setDescription(`Your mod mail in **${guild.name}** was closed!
                                        📝 **Reason:** ${reason ? reason : "No reason provided!"}`));
                                        m.channel.send(client.createGreenEmbed()
                                            .setTitle("Mod Mail Manager")
                                            .setDescription("The mod mail will be deleted in 10s!")).then(msgDelete => {
                                                let counter = 10;
                                                const timer = setInterval(() => {
                                                    if (counter <= 0) {
                                                        clearInterval(timer);
                                                        return channel.delete();
                                                    } else {
                                                        counter--;
                                                        msgDelete.edit(msgDelete.embeds[0].setDescription(`The mod mail will be deleted ${counter == 0 ? 'now' : `in ${counter}s`}!`));
                                                    };
                                                }, 1000);
                                            });
                                    } else {
                                        msg.reactions.cache.get(client.noEmojiID).users.remove(user.id);
                                        return m.channel.send(client.createRedEmbed(true, `${prefix}modmailclose [reason]`)
                                            .setTitle("Mod Mail Manager")
                                            .setDescription("Mod Mail closing cancelled!"));
                                    };
                                });
                                YesOrNo.on("end", (collected, reason) => {
                                    if (collected.size == 0) {
                                        return m.channel.send(client.createRedEmbed(true, `${prefix}modmailclose [reason]`)
                                            .setTitle("Mod Mail Manager")
                                            .setDescription("Mod Mail closing cancelled!"));
                                    };
                                });
                            });
                    } else {
                        const files = getAttachment(m.attachments);
                        message.author.send(client.createEmbed()
                            .setAuthor(`${m.author.tag} from ${guild.name}`, m.author.displayAvatarURL())
                            .setDescription(`${m.content}`));
                        await m.react(client.yesEmojiID);
                        setTimeout(() => {
                            m.reactions.cache.get(client.yesEmojiID).users.remove(client.user.id);
                        }, 10000);
                    };
                });
            });
        };
    };
};

function getAttachment(attachments) {
    const valid = /^.*(gif|png|jpg|jpeg)$/g;
    return attachments.array().filter(attachment => valid.test(attachment)).map(attachment => attachment.url);
};