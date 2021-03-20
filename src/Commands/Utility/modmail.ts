import GalaxyAlpha from "@root/Client";
import Command, { CommandRunner } from "@root/Command";
import { CategoryChannel, Collection, DMChannel, Guild, Message, MessageAttachment, MessageEmbed, NewsChannel, TextChannel } from "discord.js";

export default class extends Command {
    constructor() {
        super({
            name: "modmail",
            description: "creates a modmail request",
            category: "utility",
            dmOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const prefixRegex: RegExp = new RegExp(`^(<@!?${client.user.id}>|${client.globalPrefix.replace(/[.*+?^${}()|[\]\\]/, '\\$&')})\\s*`);
        const modMailManager = "✉️ ModMail Manager";
        if (client.modMails.has(message.author.id)) return message.author.send(client.createRedEmbed()
            .setTitle(modMailManager)
            .setDescription(`You're already in a modmail conversation!`));
        const serversUnsorted: Array<Guild> = [];
        for (const guild of client.guilds.cache.filter(guild => guild.members.cache.has(message.author.id)).values()) {
            const guildSettings = await client.cache.getGuild(guild.id);
            if (guildSettings && guildSettings.modMailCategoryID && guildSettings.modMailManagerRoleID) serversUnsorted.push(guild);
        };
        const servers = serversUnsorted.sort();
        const embeds = this.generateModMailEmbeds(client, servers);
        const msg = await message.channel.send(embeds[0].setFooter(`Page 1/${embeds.length}`, client.user.displayAvatarURL({ dynamic: true })));
        const reactions = {
            1: "1️⃣",
            2: "2️⃣",
            3: "3️⃣",
            4: "4️⃣",
            5: "5️⃣",
            6: "6️⃣",
            7: "7️⃣",
            8: "8️⃣",
            9: "9️⃣"
        };
        let page = 1;
        for (const server of servers.slice(0, 8)) await msg.react(reactions[servers.indexOf(server) + 1]);
        if (servers.length > 9) {
            await msg.react("◀️");
            await msg.react("▶️");
        };
        serverChoosing(msg);
        const chatCollector = (guildChannel: TextChannel | NewsChannel, dmChannel: DMChannel) => {
            const DMCollector = dmChannel.createMessageCollector((m) => m.author.id == message.author.id && m.channel.id == message.channel.id);
            const ChannelCollector = guildChannel.createMessageCollector((m) => m.channel.id == guildChannel.id && !m.author.bot);
            DMCollector.on("collect", async (dmMessage: Message) => {
                const files = this.getAttachment(dmMessage.attachments);
                const embed = client.createEmbed()
                    .setAuthor(dmMessage.author.tag, dmMessage.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(client.util.embedFormatter.description(dmMessage.content));
                if (files) embed.setImage(files[0]);
                await guildChannel.send(embed);
                await dmMessage.react(client.yesEmojiID);
                setTimeout(async () => await dmMessage.reactions.cache.get(client.yesEmojiID).users.remove(client.user.id), 10000);
            });
            ChannelCollector.on("collect", async (guildMessage: Message) => {
                let prefix: string = (await client.cache.getGuild(guildMessage.guild.id)).prefix;
                if (prefixRegex.test(guildMessage.content)) {
                    const [, matchedPrefix] = guildMessage.content.match(prefixRegex);
                    prefix = matchedPrefix;
                };
                const [usedCommand, ...args] = guildMessage.content.slice(prefix.length).trim().split(/\s+/g);
                if (usedCommand.toLowerCase() == "modmailclose") {
                    client.util.YesOrNoCollector(guildMessage.author, await guildMessage.channel.send(client.createEmbed()
                        .setTitle(modMailManager)
                        .setDescription(`Do you really want to stop the conversation with ${dmChannel.recipient}?`)), {
                        title: modMailManager,
                        activity: "removing",
                        toHandle: "modmail request"
                    }, "modmailclose [reason]", async (reaction, user) => {
                        DMCollector.stop();
                        ChannelCollector.stop();
                        const msgDelete = await guildChannel.send(client.createEmbed()
                            .setTitle(modMailManager)
                            .setDescription("The modmail will be deleted in 10s!"));
                        let counter = 10;
                        const timer = setInterval(async () => {
                            if (counter <= 0) {
                                dmChannel.send(client.createRedEmbed()
                                    .setTitle(modMailManager)
                                    .setDescription(`${guildMessage.author} stopped the conversation!\n📝 **Reason**: ${args.join(" ") || "No reason provided!"}`));
                                clearInterval(timer);
                                client.modMails.delete(message.author.id);
                                const modLogChannel = guildMessage.guild.channels.cache.get((await client.cache.getGuild(guildMessage.guild.id)).modMailLogChannelID) as TextChannel | NewsChannel;
                                if (modLogChannel) await modLogChannel.send(client.createEmbed()
                                    .setTitle(modMailManager)
                                    .setDescription(`${message.author}'s modmail channel was deleted by ${guildMessage.author}!`));
                                return await guildChannel.delete();
                            } else {
                                counter--;
                                await msgDelete.edit(msgDelete.embeds[0].setDescription(`The modmail will be deleted ${counter == 0 ? 'now' : `in ${counter}s`}!`));
                            };
                        }, 1000);
                        return;
                    });
                } else {
                    const files = this.getAttachment(guildMessage.attachments);
                    const embed = client.createEmbed()
                        .setAuthor(guildMessage.author.tag, guildMessage.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(guildMessage.content ? client.util.embedFormatter.description(guildMessage.content) : "");
                    if (files) embed.setImage(files[0]);
                    await dmChannel.send(embed);
                    await guildMessage.react(client.yesEmojiID);
                    setTimeout(async () => await guildMessage.reactions.cache.get(client.yesEmojiID).users.remove(client.user.id), 10000);
                };
            });
        };
        function serverChoosing(messageToCollect: Message) {
            const collector = messageToCollect.createReactionCollector((reaction, user) => (Object.values(reactions).includes(reaction.emoji.name) || reaction.emoji.name == "◀️" || reaction.emoji.name == "▶️") && user.id != client.user.id, { time: 30000, max: 1 });
            collector.on("collect", async (reaction, user) => {
                if (reaction.emoji.name == "◀️") {
                    return collector.stop(`previousPage:${page}`);
                } else if (reaction.emoji.name == "▶️") {
                    return collector.stop(`nextPage:${page}`);
                } else {
                    const field = embeds[page - 1].fields.find(field => field.value.toLowerCase().includes(reaction.emoji.name));
                    if (!field) return errorMessage("Invalid reaction!");
                    const id = field.value.split("**ID**: ")[1].split("\n**Reaction Emoji:** ")[0];
                    const guild = client.guilds.cache.get(id);
                    if (!guild) return errorMessage("Cannot find the server!");
                    const guildSettings = await client.cache.getGuild(id);
                    if (!guildSettings.modMailCategoryID || !guildSettings.modMailManagerRoleID) return message.channel.send(client.createRedEmbed()
                        .setTitle(modMailManager)
                        .setDescription("There is no modmail category or modmail role setup in this server!\nPlease contact the server admins to setup the modmail feature!"));
                    const categoryChannel = guild.channels.cache.filter(channel => channel.type == "category").get(guildSettings.modMailCategoryID) as CategoryChannel;
                    if (!categoryChannel) return errorMessage("Cannot find ModMail category!");
                    const modMailRole = guild.roles.cache.get(guildSettings.modMailManagerRoleID);
                    if (!modMailRole) return errorMessage("Cannot find ModMail Manager role!");
                    await message.channel.send(client.createEmbed()
                        .setTitle(modMailManager)
                        .setDescription("Please provide a reason for creating this modmail request!"));
                    let reason = "No reason provided!";
                    const messageCollector = (await message.channel.awaitMessages((message) => message.author.id != client.user.id, { max: 1, time: 30000 })).first();
                    if (messageCollector) reason = messageCollector.content;
                    const newChannel = await guild.channels.create(`modmail-${message.author.username}`, {
                        type: "text",
                        parent: categoryChannel.id
                    });
                    const modLogChannel = guild.channels.cache.get(guildSettings.modMailLogChannelID) as TextChannel | NewsChannel;
                    if (modLogChannel) await modLogChannel.send(client.createEmbed()
                        .setTitle(modMailManager)
                        .setDescription(`${message.author} created a modmail request!\nFor more infos go to ${newChannel}!`));
                    const acceptMSG = await newChannel.send(client.createEmbed()
                        .setTitle("✉️ New ModMail")
                        .setDescription(client.util.embedFormatter.description(`**Requested by:** ${message.author}
                        **Requested on:** ${client.util.dateFormatter(message.createdTimestamp)}
                        **Reason:** ${reason}`)));
                    await acceptMSG.react(client.yesEmojiID);
                    await acceptMSG.react(client.noEmojiID);
                    await client.createSuccess(message, { title: modMailManager, description: "Created a modmail request!\nIf a modmail manager accepts your request, the bot will notify you!\nIf the nobody accepts your request until 1d you have to create a new request!" });
                    client.modMails.set(message.author.id, guild);
                    const collector = acceptMSG.createReactionCollector((reaction, user) => [client.yesEmojiID, client.noEmojiID].includes(reaction.emoji.id) && !user.bot && acceptMSG.guild.members.cache.get(user.id).roles.cache.has(modMailRole.id), { max: 1, time: client.ms("1d") });
                    collector.on("collect", async (reaction, user) => {
                        if (reaction.emoji.id == client.yesEmojiID) {
                            if (modLogChannel) await modLogChannel.send(client.createGreenEmbed()
                                .setTitle(modMailManager)
                                .setDescription(`${message.author}'s modmail request was accepted by ${user}!\nFor more infos go to ${newChannel}!`));
                            await message.channel.send(client.createGreenEmbed()
                                .setTitle(modMailManager)
                                .setDescription(`Your conversation with the guild **${guild.name}** is beginning now!`));
                            await newChannel.send(client.createGreenEmbed()
                                .setTitle(modMailManager)
                                .setDescription(`The conversation with the user ${message.author} has started now!`));
                            chatCollector(newChannel, message.channel as DMChannel);
                        } else {
                            await message.channel.send(client.createRedEmbed()
                                .setTitle(modMailManager)
                                .setDescription(`Your modmail request to **${acceptMSG.guild.name}** was declined by ${user}!`));
                            client.modMails.delete(message.author.id);
                            if (modLogChannel) await modLogChannel.send(client.createRedEmbed()
                                .setTitle(modMailManager)
                                .setDescription(`${message.author}'s modmail request was declined by ${user}!`));
                            return await newChannel.delete();
                        };
                    });
                    collector.on("end", async (collected, reason) => {
                        if (collected.size == 0) {
                            await message.channel.send(client.createRedEmbed()
                                .setTitle(modMailManager)
                                .setDescription(`Your modmail request ran out of time!\nPlease create a new request to reach out staff!`));
                            client.modMails.delete(message.author.id);
                            if (modLogChannel) await modLogChannel.send(client.createRedEmbed()
                                .setTitle(modMailManager)
                                .setDescription(`${message.author}'s modmail request ran out of time!`));
                            return await newChannel.delete();
                        };
                    });
                    function errorMessage(description: string) {
                        return message.channel.send(client.createRedEmbed()
                            .setTitle(modMailManager)
                            .setDescription(description));
                    };
                };
            });
            collector.on("end", async (collected, reason) => {
                if (collected.size == 0) return message.channel.send(client.createRedEmbed()
                    .setTitle(modMailManager)
                    .setDescription(`You ran out of time!\nCancelled ModMail support!`));
                else if (reason?.includes("previousPage:")) {
                    page--;
                    const index = embeds[page - 1] ? page - 1 : embeds.length;
                    const embed = embeds[index];
                    message.edit(embed.setFooter(`Page ${index + 1}/${embeds.length}`, client.user.displayAvatarURL({ dynamic: true })));
                    serverChoosing(messageToCollect);
                } else if (reason?.includes("nextPage:")) {
                    page++;
                    const index = embeds[page - 1] ? page - 1 : 0;
                    const embed = embeds[index];
                    message.edit(embed.setFooter(`Page ${index + 1}/${embeds.length}`, client.user.displayAvatarURL({ dynamic: true })));
                    serverChoosing(messageToCollect);
                };
            });
        };
    };
    private getAttachment(attachments: Collection<string, MessageAttachment>) {
        const valid = /^.*(gif|png|jpg|jpeg)$/g;
        if (attachments.first()) return attachments.array().filter(attachment => valid.test(attachment.name)).map(attachment => attachment.url);
        else return null;
    };
    private generateModMailEmbeds(client: GalaxyAlpha, servers: Array<Guild>): Array<MessageEmbed> {
        const reactions = {
            1: "1️⃣",
            2: "2️⃣",
            3: "3️⃣",
            4: "4️⃣",
            5: "5️⃣",
            6: "6️⃣",
            7: "7️⃣",
            8: "8️⃣",
            9: "9️⃣"
        };
        const embeds = [];
        const itemsPerPage = 9;
        let itemsPerEmbed = itemsPerPage;
        for (let i = 0; i < servers.length; i += itemsPerPage) {
            const current = servers.slice(i, itemsPerEmbed);
            itemsPerEmbed += itemsPerPage;
            let j = 1;
            const embed = client.createEmbed().setTitle("✉️ ModMail").setDescription("Please react with one of the numbers to choose a server!\nIf you can't find the server, where you want to get support from, contact the server staff to run the setup command `modmail-setup`!");
            for (const server of current) embed.addField(server.name, `**ID**: ${server.id}\n**Reaction Emoji:** ${reactions[j++]}`, true);
            embeds.push(embed);
        };
        return embeds;
    };
};