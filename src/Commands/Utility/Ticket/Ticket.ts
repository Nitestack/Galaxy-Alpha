import GalaxyAlpha from '@root/Client';
import { CategoryChannel, Collection, Guild, GuildMember, Message, NewsChannel, Role, TextChannel, User } from 'discord.js';
import TicketSchema from '@models/ticket';

export const ticketsManager: string = "🎫 Ticket Manager";

export default class Ticket {
    private client: GalaxyAlpha;
    public transcript: Collection<string, string> = new Collection();
    public async create(guild: Guild, ticketCategory: CategoryChannel, user: User, ticketManager: Role, reason?: string) {
        await guild.channels.create(`ticket-${user.username}`, {
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
            }]
        }).then(async channel => {
            const ghostPing = `${user} ${ticketManager}`;
            channel.send(ghostPing).then(message => {
                setTimeout(() => {
                    message.delete();
                }, 1);
            });
            const ticket = new TicketSchema({
                guildID: guild.id,
                channelID: channel.id,
                categoryID: ticketCategory.id,
                userID: user.id,
                reason: reason,
                createdAt: Date.now()
            });
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            ticket.save().catch(err => console.log(err));
            channel.send(this.client.createEmbed()
                .setTitle(`Support of ${guild.name}`)
                .setDescription(`Hello ${user},
                your ticket was created successfully!
                Help will be coming soon!
                In the meantime please describe your issue further!
                
                **Channel created at:** ${weekDays[channel.createdAt.getUTCDay()]}, ${monthNames[channel.createdAt.getUTCMonth()]} ${channel.createdAt.getUTCDate()}, ${channel.createdAt.getUTCFullYear()}, ${channel.createdAt.getUTCHours()}:${channel.createdAt.getUTCMinutes()}:${channel.createdAt.getUTCSeconds()} UTC
                
                **Reason:** ${reason}`)).then(async msg => {
                    await msg.react("🔒");
                    const reactionCollector = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "🔒");
                    reactionCollector.on('collect', async (reaction, user) => {
                        if (reaction.emoji.name == '🔒') {
                            msg.reactions.cache.get("🔒").users.remove(user.id);
                            await msg.react(this.client.yesEmojiID);
                            await msg.react(this.client.noEmojiID);
                            const yesOrNo = msg.createReactionCollector((reaction, user) => reaction.emoji.id == this.client.yesEmojiID || reaction.emoji.id == this.client.noEmojiID, { max: 1, time: 30000 });
                            yesOrNo.on('collect', (reaction, user) => {
                                if (reaction.emoji.id == this.client.yesEmojiID) {
                                    msg.reactions.cache.get(this.client.yesEmojiID).users.remove(user.id);
                                    yesOrNo.stop();
                                    reactionCollector.stop();
                                    return msg.channel.send(this.client.createGreenEmbed()
                                        .setTitle(ticketsManager)
                                        .setDescription("The ticket will be deleted in 10s!")).then(msgDelete => {
                                            let counter = 10;
                                            const timer = setInterval(() => {
                                                if (counter <= 0) {
                                                    const member: GuildMember = msg.guild.members.cache.get(user.id);
                                                    member.send(this.client.createEmbed()
                                                        .setTitle(ticketsManager)
                                                        .setDescription(`Your ticket in **${msg.guild.name}** was closed!
                                                        📝 **Reason:** ${reason}`));
                                                    clearInterval(timer);
                                                    return msg.channel.delete();
                                                } else {
                                                    counter--;
                                                    msgDelete.edit(msgDelete.embeds[0].setDescription(`The ticket will be deleted ${counter == 0 ? 'now' : `in ${counter}s`}!`));
                                                };
                                            }, 1000);
                                            return;
                                        });
                                } else if (reaction.emoji.id == this.client.noEmojiID) {
                                    msg.reactions.cache.get(this.client.yesEmojiID).remove();
                                    msg.reactions.cache.get(this.client.noEmojiID).remove();
                                    yesOrNo.stop();
                                    return msg.channel.send(this.client.createRedEmbed()
                                        .setTitle(ticketsManager)
                                        .setDescription("Closing ticket cancelled!"));
                                };
                            });
                            yesOrNo.on('end', (collected, reason) => {
                                if (collected.size == 0) {
                                    return msg.channel.send(this.client.createRedEmbed()
                                        .setTitle(ticketsManager)
                                        .setDescription("Closing ticket cancelled!"));
                                };
                            });
                        };
                    });
                });
        });
    };
    public close(channelID: string, prefix: string, userID: string, reason: string, message: Message) {
        const channel: TextChannel | NewsChannel = (this.client.channels.cache.filter(channel => channel.type == 'text' || channel.type == 'news').get(channelID) as TextChannel | NewsChannel);
        channel.send(this.client.createEmbed(true, `${prefix}tclose [reason]`)
            .setTitle(ticketsManager)
            .setDescription("Do you really want to delete this ticket channel?")).then(async msg => {
                await msg.react(this.client.yesEmojiID);
                await msg.react(this.client.noEmojiID);
                const yesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == this.client.yesEmojiID || reaction.emoji.id == this.client.noEmojiID) && user.id == message.author.id);
                yesOrNo.on('collect', (reaction, user) => {
                    if (reaction.emoji.id == this.client.yesEmojiID) {
                        msg.reactions.cache.get(this.client.yesEmojiID).users.remove(user.id);
                        yesOrNo.stop();
                        return msg.channel.send(this.client.createGreenEmbed()
                            .setTitle(ticketsManager)
                            .setDescription("The ticket will be deleted in 10s!")).then(msgDelete => {
                                let counter = 10;
                                const timer = setInterval(() => {
                                    if (counter <= 0) {
                                        const member: GuildMember = msg.guild.members.cache.get(userID);
                                        member.send(this.client.createEmbed()
                                            .setTitle(ticketsManager)
                                            .setDescription(`Your ticket in **${msg.guild.name}** was closed!
                                        📝 **Reason:** ${reason}`));
                                        clearInterval(timer);
                                        return msg.channel.delete();
                                    } else {
                                        counter--;
                                        msgDelete.edit(msgDelete.embeds[0].setDescription(`The ticket will be deleted ${counter == 0 ? 'now' : `in ${counter}s`}!`));
                                    };
                                }, 1000);
                                return;
                            });
                    } else if (reaction.emoji.id == this.client.noEmojiID) {
                        msg.reactions.cache.get(this.client.noEmojiID).users.remove(user.id);
                        return msg.channel.send(this.client.createRedEmbed()
                            .setTitle(ticketsManager)
                            .setDescription("Closing ticket cancelled!"));
                    };
                });
            });
    };
    public addUser(userID: string, channelID: string, message: Message) {
        const channel: TextChannel | NewsChannel = (message.guild.channels.cache.filter(channel => channel.type == 'text' || channel.type == 'news').get(channelID) as TextChannel | NewsChannel);
        const user: GuildMember = message.guild.members.cache.get(userID);
        if (user && channel) {
            channel.createOverwrite(userID, {
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
                ATTACH_FILES: true,
                VIEW_CHANNEL: true
            });
            channel.send(this.client.createGreenEmbed()
                .setTitle(ticketsManager)
                .setDescription(`Added ${user} to the ticket!`));
        }
    };
    public removeUser(userID: string, channelID: string, message: Message) {
        const channel: TextChannel | NewsChannel = (message.guild.channels.cache.filter(channel => channel.type == 'text' || channel.type == 'news').get(channelID) as TextChannel | NewsChannel);
        const user: GuildMember = message.guild.members.cache.get(userID);
        if (user && channel) {
            channel.permissionOverwrites.get(user.id).delete();
            return message.channel.send(this.client.createGreenEmbed()
                .setTitle(ticketsManager)
                .setDescription(`Removed ${user} from the ticket!`));
        };
    };
};