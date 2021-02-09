import Command, { CommandRunner } from '@root/Command';
import { GuildMember } from 'discord.js';
import WebhookSchema from '@models/modlogs';
import { TextChannel, NewsChannel } from 'discord.js';

export const name: string = 'kick';

export default class KickCommand extends Command {
    constructor(){
        super({
            name: "kick",
            description: "kicks a member from the server",
            userPermissions: ["ADMINISTRATOR", "KICK_MEMBERS"],
            category: "moderation",
            clientPermissions: ["KICK_MEMBERS", "ADMINISTRATOR"],
            usage: "kick <@User/User ID> [reason]",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const usage: string = `${prefix}${this.usage}`;
        let member: GuildMember;
        if (message.mentions.users.first()) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.has(args[0])) member = message.guild.members.cache.get(args[0]);
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription("You cannot kick yourself!"));
        if (member) {
            if (member.kickable) {
                const reason = args.slice(1).join(" ") || "No reason provided!";
                return message.channel.send(client.createEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription(`Do you really want to kick ${member.user}?\n📝 **Reason:** ${reason}\n\nYou have 10s to react!`)).then(async msg => {
                    await msg.react(client.yesEmojiID);
                    await msg.react(client.noEmojiID);
                    const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 10000, max: 1 });
                    YesOrNo.on('collect', (reaction, user) => {
                        if (reaction.emoji.id == client.yesEmojiID) {
                            msg.reactions.cache.get(client.yesEmojiID).users.remove(message.author.id);
                            member.kick(`${reason} (kicked by ${message.author.tag})`)
                                .then(() => {
                                    WebhookSchema.findOne({
                                        guildID: message.guild.id
                                    }, {}, {}, (err, webhook) => {
                                        if (err) return console.log(err);
                                        if (!webhook) return;
                                        if (webhook) {
                                            const webhookChannel: TextChannel | NewsChannel = (client.channels.cache.filter(channel => channel.type == 'news' || channel.type == 'text').get(webhook.channelID) as TextChannel | NewsChannel);
                                            if (webhookChannel) {
                                                webhookChannel.fetchWebhooks().then(webhooks => {
                                                    if (!webhooks.has(webhook.webhookID)) return;
                                                    const webhookMessageChannel = new client.discordJS.WebhookClient(webhook.webhookID, webhook.webhookToken);
                                                    webhookMessageChannel.send(client.createRedEmbed()
                                                        .setTitle("🤜 Kick Manager")
                                                        .setDescription(`🔨 ${member.user} was kicked by ${message.author}!\n📝 **Reason:** ${reason}`));
                                                });
                                            };
                                        };
                                    });
                                    msg.channel.send(client.createGreenEmbed()
                                        .setTitle("🤜 Kick Manager")
                                        .setDescription(`🤜 ${member.user} was kicked!\n📝 **Reason:** ${reason}`));
                                    return member.send(client.createEmbed()
                                        .setTitle("🤜 Kick Manager")
                                        .setDescription(`You were kicked from **${message.guild.name}**!
                                        ${client.memberEmoji} **Kicked By:** ${message.author}
                                        📝 **Reason:** ${reason}`));
                                }).catch(err => console.log(err));
                        } else {
                            msg.reactions.cache.get(client.noEmojiID).users.remove(message.author.id);
                            return msg.channel.send(client.createRedEmbed().setTitle("🤜 Kick Manager").setDescription("Kick cancelled!"));
                        };
                    });
                    YesOrNo.on('end', collected => {
                        if (collected.size == 0) {
                            return msg.channel.send(client.createRedEmbed().setTitle("🤜 Kick Manager").setDescription("Kick cancelled!"));
                        };
                    });
                });
            } else {
                return message.channel.send(client.createRedEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription("I don't have the permission to kick members!"));
            };
        } else {
            return message.channel.send(client.createRedEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription(`Cannot find the user ${args[0]}!`));
        };
    };
};