import Command, { CommandRunner } from '@root/Command';
import { GuildChannel, MessageAttachment, NewsChannel, TextChannel } from 'discord.js';

export default class ModLogsCommand extends Command {
    constructor(){
        super({
            name: "modlogs",
            description: "modlogs command",
            usage: "modlogs set <#channel/channel ID>",
            category: "management",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"],
            clientPermissions: ["MANAGE_WEBHOOKS"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const modLogsManager = "📊 Mod Logs Manager";
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (args[0]?.toLowerCase() == "set"){
            let channel: TextChannel | NewsChannel;
            if (message.mentions.channels.first() && message.guild.channels.cache.has(message.mentions.channels.first().id)) channel = message.mentions.channels.first();
            if (args[1] && message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(args[1])) channel = message.guild.channels.cache.get(args[1]) as TextChannel | NewsChannel;
            if (!channel) return client.createArgumentError(message, { title: modLogsManager, description: "You have to mention a channel or provide a channel ID!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(modLogsManager)
                .setDescription(`Do you really want to update the mod logs channel to ${channel}?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID){
                    const webhook = await channel.createWebhook(client.user.username, {
                        avatar: client.user.displayAvatarURL({ dynamic: false, format: "png" })
                    });
                    await client.cache.updateGuild(message.guild.id, {
                        modLogChannelID: channel.id,
                        modLogChannelWebhookID: webhook.id,
                        modLogChannelWebhookToken: webhook.token
                    });
                    return client.createSuccess(message, { title: modLogsManager, description: `Set mod logs channel to ${channel}!`});
                } else return client.createArgumentError(message, { title: modLogsManager, description: "Setting mod logs channel cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: modLogsManager, description: "Setting mod logs channel cancelled!" }, this.usage);
            })
        } else if (args[0]?.toLowerCase() == "remove"){
            if (!guildSettings.modLogChannelWebhookID || !guildSettings.modLogChannelWebhookToken || !guildSettings.modLogChannelID) return client.createArgumentError(message, { title: modLogsManager, description: "There is no mod log channel to remove!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(modLogsManager)
                .setDescription("Do you really want to remove the current mod log channel?\n\nYou have 30s to react!"));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    const channel = message.guild.channels.cache.get(guildSettings.modLogChannelID) as TextChannel | NewsChannel;
                    if (channel){
                        const webhooks = await channel.fetchWebhooks();
                        webhooks.delete(guildSettings.modLogChannelWebhookID);
                        await client.cache.updateGuild(message.guild.id, {
                            modMailLogChannelID: null,
                            modLogChannelWebhookID: null,
                            modLogChannelWebhookToken: null
                        });
                    };
                    return client.createSuccess(message, { title: modLogsManager, description: "Removed the current mod log channel!"});
                } else return client.createArgumentError(message, { title: modLogsManager, description: "Removing mod logs channel cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: modLogsManager, description: "Removing mod logs channel cancelled!" }, this.usage);
            });
        } else {
            return client.createEmbedForSubCommands(message, {
                title: modLogsManager,
                description: "Use this commands to set or remove the mod logs channel!"
            }, [{
                usage: "modlogs set <@Role/Role ID>",
                description: "Sets the mod log channel"
            }, {
                usage: "modlogs remove",
                description: "Removes the mod log channel"
            }]);
        };
    };
};