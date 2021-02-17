import Command, { CommandRunner } from '@root/Command';
import { GuildChannel, NewsChannel, TextChannel } from 'discord.js';

export default class ModLogsCommand extends Command {
    constructor(){
        super({
            name: "modlogs",
            description: "modlogs command",
            usage: "modlogs set <#channel/channel ID>",
            category: "management",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (args[0].toLowerCase() == 'set') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}modlogs set <#channel/channel ID>`)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
            const result = await ModLogsSchema.findOne({
                guildID: message.guild.id
            }, {}, {}, (err, result) => {
                if (err) return console.log(err);
                if (result) return result;
                if (!result) return false;
            });
            const usage: string = `${prefix}modlogs set <#channel/channel ID>`;
            let channel: GuildChannel;
            if (message.mentions.channels.first()) channel = message.mentions.channels.first();
            if (args[1] && message.guild.channels.cache.get(args[1])) channel = message.guild.channels.cache.get(args[1]);
            if (!channel || !args[1]) return message.channel.send(client.createRedEmbed(true, usage)
                .setDescription(`You have to mention a valid channel in this server!`)
                .setTitle("📊 Mod Log Manager"));
            if (result && channel.id == result.channelID) return message.channel.send(client.createRedEmbed(true, usage).setDescription("This channel is already the mod logs channel!"));
            const check: TextChannel | NewsChannel = (message.guild.channels.cache.filter(channel => channel.type == 'news' || channel.type == 'text').get(channel.id) as TextChannel | NewsChannel);
            return message.channel.send(client.createGreenEmbed().setTitle("📊 Mod Log Manager").setDescription(`Do you really want to set the mod logs channel to ${check}?\n\nYou have 30s to react!`)).then(async msg => {
                await msg.react(client.yesEmojiID);
                await msg.react(client.noEmojiID);
                const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                YesOrNo.on('collect', async (reaction, user) => {
                    if (reaction.emoji.id == client.yesEmojiID) {
                        check.createWebhook(`${client.user.username}`, {
                            avatar: client.user.displayAvatarURL()
                        }).then(async webhook => {
                            await ModLogsSchema.findOneAndUpdate({
                                guildID: message.guild.id
                            }, {
                                channelID: check.id,
                                webhookID: webhook.id,
                                webhookToken: webhook.token
                            }, {
                                upsert: true
                            });
                        });
                        return message.channel.send(client.createGreenEmbed().setTitle("📊 Mod Log Manager").setDescription(`Successfully set the mod logs channel to ${check}!`));
                    } else {
                        return msg.channel.send(client.createRedEmbed().setTitle("📊 Mod Log Manager").setDescription("Setting mod logs channel cancelled!"));
                    };
                });
                YesOrNo.on('end', collected => {
                    if (collected.size == 0) {
                        return msg.channel.send(client.createRedEmbed().setTitle("📊 Mod Log Manager").setDescription("Setting mod logs channel cancelled!"));
                    };
                });
            }).catch(err => console.log(err));
        } else if (args[0].toLowerCase() == 'remove') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}modlogs remove`)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
        } else {

        };
    };
};