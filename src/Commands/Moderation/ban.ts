import Command, { CommandRunner } from '@root/Command';
import { GuildMember, NewsChannel, TextChannel } from 'discord.js';
import WebhookSchema from '@models/modlogs';

export default class BanCommand extends Command {
    constructor(){
        super({
            name: "ban",
            description: "bans a member from the server",
            category: "moderation",
            userPermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
            clientPermissions: ["ADMINISTRATOR", "BAN_MEMBERS"],
            guildOnly: true,
            usage: "ban <@User/User ID> [reason]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const usage: string = `${prefix}ban <@User/User ID> [reason]`;
        let member: GuildMember;
        if (message.mentions.users.first()) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.has(args[0])) member = message.guild.members.cache.get(args[0]);
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription("You cannot ban yourself!"));
        if (member) {
            if (member.bannable) {
                const reason = args.slice(1).join(" ") || "No reason provided!";
                return message.channel.send(client.createEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription(`Do you really want to ban ${member.user}?\n📝 **Reason:** ${reason}\n\nYou have 10s to react!`)).then(async msg => {
                    await msg.react(client.yesEmojiID);
                    await msg.react(client.noEmojiID);
                    const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 10000, max: 1 });
                    YesOrNo.on('collect', (reaction, user) => {
                        if (reaction.emoji.id == client.yesEmojiID) {
                            member.ban({ reason: `${reason} (banned by ${message.author.tag})` })
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
                                                        .setTitle("🔨 Ban Manager")
                                                        .setDescription(`🔨 ${member.user} was banned by ${message.author}!\n📝 **Reason:** ${reason}`));
                                                });
                                            };
                                        };
                                    });
                                    msg.channel.send(client.createGreenEmbed()
                                        .setTitle("🔨 Ban Manager")
                                        .setDescription(`🔨 ${member.user} was banned!\n📝 **Reason:** ${reason}`));
                                    return member.send(client.createEmbed()
                                        .setTitle("🔨 Ban Manager")
                                        .setDescription(`You were banned from **${message.guild.name}**!
                                        ${client.memberEmoji} **Banned By:** ${message.author}
                                        📝 **Reason:** ${reason}`));
                                }).catch(err => console.log(err));
                        } else {
                            return msg.channel.send(client.createRedEmbed().setTitle("🔨 Ban Manager").setDescription("Ban cancelled!"));
                        };
                    });
                    YesOrNo.on('end', collected => {
                        if (collected.size == 0) {
                            return msg.channel.send(client.createRedEmbed().setTitle("🔨 Ban Manager").setDescription("Ban cancelled!"));
                        };
                    });
                });
            } else {
                return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription("I don't have the permission to ban members!"));
            };
        } else {
            return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription(`Cannot find the user ${args[0]}!`));
        };
    };
};