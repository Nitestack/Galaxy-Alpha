"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsManager = void 0;
const discord_js_1 = require("discord.js");
exports.ticketsManager = "🎫 Ticket Manager";
class Ticket {
    constructor(client) {
        this.client = client;
        this.transcript = new discord_js_1.Collection();
    }
    ;
    async create(guild, ticketCategory, user, ticketManager, reason) {
        const channel = await guild.channels.create(`ticket-${user.username}`, {
            type: 'text',
            parent: ticketCategory,
            permissionOverwrites: [{
                    id: guild.id,
                    deny: ['VIEW_CHANNEL']
                }, {
                    id: user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES']
                }, {
                    id: ticketManager.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES']
                }, {
                    id: this.client.user.id,
                    allow: ["VIEW_CHANNEL", "MANAGE_MESSAGES", "MANAGE_CHANNELS", "READ_MESSAGE_HISTORY", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS"]
                }]
        });
        const ghostPing = `${user} ${ticketManager}`;
        channel.send(ghostPing).then(async (m) => {
            await m.delete({ timeout: 1 });
        });
        await this.client.cache.getTicket(channel.id, {
            userID: user.id,
            categoryID: ticketCategory.id
        });
        const msg = await channel.send(this.client.createEmbed()
            .setTitle(`Support of ${guild.name}`)
            .setDescription(`Hello ${user},
            your ticket was created successfully!
            Help will be coming soon!
            In the meantime please describe your issue further!
            
            **Channel created at:** ${this.client.util.dateFormatter(channel.createdTimestamp)}
            
            **Reason:** ${reason || "No reason provided!"}`));
        await msg.react("🔒");
        const reactionCollector = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "🔒" && !user.bot);
        reactionCollector.on('collect', async (reaction, user) => {
            if (reaction.emoji.name == '🔒') {
                await msg.reactions.cache.get("🔒").users.remove(user.id);
                await msg.react(this.client.yesEmojiID);
                await msg.react(this.client.noEmojiID);
                msg.createReactionCollector((reaction, reactionUser) => (reaction.emoji.id == this.client.yesEmojiID || reaction.emoji.id == this.client.noEmojiID) && reactionUser.id == user.id, { max: 1, time: 30000 })
                    .on('collect', async (reaction, user) => {
                    if (reaction.emoji.id == this.client.yesEmojiID) {
                        reactionCollector.stop();
                        const msgDelete = await msg.channel.send(this.client.createGreenEmbed()
                            .setTitle(exports.ticketsManager)
                            .setDescription("The ticket will be deleted in 10s!"));
                        let counter = 10;
                        const timer = setInterval(async () => {
                            if (counter <= 0) {
                                const member = msg.guild.members.cache.get(user.id);
                                member.send(this.client.createEmbed()
                                    .setTitle(exports.ticketsManager)
                                    .setDescription(`Your ticket in **${msg.guild.name}** was closed!
                                        📝 **Reason:** ${reason || "No reason provided!"}`));
                                clearInterval(timer);
                                return msg.channel.delete();
                            }
                            else {
                                counter--;
                                await msgDelete.edit(msgDelete.embeds[0].setDescription(`The ticket will be deleted ${counter == 0 ? 'now' : `in ${counter}s`}!`));
                            }
                            ;
                        }, 1000);
                        return;
                    }
                    else if (reaction.emoji.id == this.client.noEmojiID) {
                        await msg.reactions.removeAll();
                        await msg.react("🔒");
                        return msg.channel.send(this.client.createRedEmbed()
                            .setTitle(exports.ticketsManager)
                            .setDescription("Closing ticket cancelled!"));
                    }
                    ;
                }).on('end', (collected, reason) => {
                    if (collected.size == 0)
                        return msg.channel.send(this.client.createRedEmbed()
                            .setTitle(exports.ticketsManager)
                            .setDescription("Closing ticket cancelled!"));
                });
            }
            ;
        });
    }
    ;
    async close(message, userID, reason) {
        this.client.util.YesOrNoCollector(message.author, await message.channel.send(this.client.createEmbed()
            .setTitle(exports.ticketsManager)
            .setDescription("Do you really want to delete this ticket channel?")), {
            title: exports.ticketsManager,
            toHandle: "ticket",
            activity: "closing"
        }, "ticketclose [reason]", async () => {
            return message.channel.send(this.client.createGreenEmbed()
                .setTitle(exports.ticketsManager)
                .setDescription("The ticket will be deleted in 10s!")).then(msgDelete => {
                let counter = 10;
                const timer = setInterval(async () => {
                    if (counter <= 0) {
                        const member = message.guild.members.cache.get(userID);
                        member.send(this.client.createEmbed()
                            .setTitle(exports.ticketsManager)
                            .setDescription(`Your ticket in **${message.guild.name}** was closed!
                                📝 **Reason:** ${reason}`));
                        clearInterval(timer);
                        return await message.channel.delete();
                    }
                    else {
                        counter--;
                        msgDelete.edit(msgDelete.embeds[0].setDescription(`The ticket will be deleted ${counter == 0 ? 'now' : `in ${counter}s`}!`));
                    }
                    ;
                }, 1000);
                return;
            });
        });
    }
    ;
    async addUser(message, userID) {
        const user = message.guild.members.cache.get(userID);
        if (user) {
            await message.channel.updateOverwrite(userID, {
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
                ATTACH_FILES: true,
                VIEW_CHANNEL: true
            });
            message.channel.send(this.client.createGreenEmbed()
                .setTitle(exports.ticketsManager)
                .setDescription(`Added ${user} to the ticket!`));
        }
        ;
    }
    ;
    async removeUser(message, userID) {
        const user = message.guild.members.cache.get(userID);
        if (user) {
            await message.channel.permissionOverwrites.get(user.id).delete();
            return message.channel.send(this.client.createGreenEmbed()
                .setTitle(exports.ticketsManager)
                .setDescription(`Removed ${user} from the ticket!`));
        }
        ;
    }
    ;
}
exports.default = Ticket;
;
//# sourceMappingURL=Ticket.js.map