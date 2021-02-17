import Command, { CommandRunner } from "@root/Command";
import { GuildMember } from "discord.js";
import { TextChannel, NewsChannel } from "discord.js";

export default class TempBanCommand extends Command {
    constructor() {
        super({
            name: "temporaryban",
            aliases: ["tempban"],
            description: "temporary bans a user",
            category: "moderation",
            guildOnly: true,
            userPermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
            usage: "tempban <@User/User ID> <duration> [reason]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let member: GuildMember;
        if (message.mentions.users.first() && message.guild.members.cache.has(message.mentions.users.first().id)) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.has(args[0])) member = message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("You have to mention an user or provide an user ID!"));
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("You cannot tempban yourself!"));
        let banDuration: number = client.ms(args[1]);
        if (!banDuration) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("You have to provide a valid duration!"));
        const reason = args.slice(2).join(" ") || "No reason provided!";
        if (!member.bannable) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("I don't have the permission to tem ban this member! Make sure I have the permission `Kick Members` or `Administrator`!"));
        return message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription(`Do you really want to ban ${member.user}?\n📝 **Reason:** ${reason}\n\nYou have 10s to react!`)).then(async msg => {
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 10000, max: 1 });
            YesOrNo.on('collect', async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    try {
                        await member.ban({ reason: `${reason} (banned by ${message.author.tag})` });
                        const webhookSchema = await client.cache.getGuild(message.guild.id)
                        if (webhookSchema.modLogChannelID && webhookSchema.modLogChannelWebhookID && webhookSchema.modLogChannelWebhookToken) {
                            const webhookChannel: TextChannel | NewsChannel = (client.channels.cache.filter(channel => channel.type == 'news' || channel.type == 'text').get(webhookSchema.modLogChannelID) as TextChannel | NewsChannel);
                            if (webhookChannel) {
                                const webhooks = await webhookChannel.fetchWebhooks();
                                if (webhooks.has(webhookSchema.modLogChannelWebhookID)) {
                                    const webhookMessageChannel = new client.discordJS.WebhookClient(webhookSchema.modLogChannelWebhookID, webhookSchema.modLogChannelWebhookToken);
                                    webhookMessageChannel.send(client.createRedEmbed()
                                        .setTitle("🔨 Ban Manager")
                                        .setDescription(`🔨 ${member.user} was banned by ${message.author} for **${banDuration}**!\n📝 **Reason:** ${reason}`));
                                };
                            };
                        };
                        msg.channel.send(client.createGreenEmbed()
                            .setTitle("🔨 Ban Manager")
                            .setDescription(`🔨 ${member.user} was banned for **${banDuration}**!\n📝 **Reason:** ${reason}`));
                        member.send(client.createEmbed()
                            .setTitle("🔨 Ban Manager")
                            .setDescription(`You were temporary banned from **${message.guild.name}** for **${banDuration}**!
                        ${client.memberEmoji} **Banned By:** ${message.author}
                        📝 **Reason:** ${reason}`));
                        return setTimeout(() => message.guild.members.unban(member.id), banDuration);
                    } catch (error) {
                        return console.log(error);
                    };
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
    };
};