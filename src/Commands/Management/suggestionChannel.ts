import Command, { CommandRunner } from "@root/Command";
import { TextChannel, NewsChannel } from "discord.js";

export default class SuggestionChannelCommand extends Command {
    constructor() {
        super({
            name: "suggestionchannel",
            description: "suggestion channel commands",
            category: "management",
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"],
            guildOnly: true,
            usage: "suggestionchannel set <#channel/channel ID> or suggestionchannel remove"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const blackListManager = "🚫 Suggestion Channel Manager";
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (args[0]?.toLowerCase() == "set") {
            let channel: TextChannel | NewsChannel;
            if (message.mentions.channels.first() && message.guild.channels.cache.has(message.mentions.channels.first().id)) channel = message.mentions.channels.first();
            if (args[1] && message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(args[1])) channel = message.guild.channels.cache.get(args[1]) as TextChannel | NewsChannel;
            if (!channel) return client.createArgumentError(message, { title: blackListManager, description: "You have to mention a channel or provide a channel ID!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(blackListManager)
                .setDescription(`Do you really want to change the current suggestion channel to ${channel}?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    await client.cache.updateGuild(message.guild.id, {
                        suggestionChannelID: channel.id
                    });
                    return client.createSuccess(message, { title: blackListManager, description: `Set the new suggestion channel to ${channel}` });
                } else return client.createArgumentError(message, { title: blackListManager, description: "Setting suggestion channel cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: blackListManager, description: "Setting suggestion channel cancelled!" }, this.usage);
            });
        } else if (args[0]?.toLowerCase() == "remove") {
            if (!guildSettings.suggestionChannelID) return client.createArgumentError(message, { title: blackListManager, description: "There is no suggestion channel to remove!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(blackListManager)
                .setDescription(`Do you really want to remove the current suggestion channel?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    await client.cache.updateGuild(message.guild.id, {
                        suggestionChannelID: null
                    });
                    return client.createSuccess(message, { title: blackListManager, description: `Removed the current suggestion channel!` });
                } else return client.createArgumentError(message, { title: blackListManager, description: "Removing suggestion channel cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: blackListManager, description: "Removing suggestion channel cancelled!" }, this.usage);
            });
        } else {
            return client.createEmbedForSubCommands(message, {
                title: blackListManager,
                description: "Use this commands to set or remove the suggestion channel!"
            }, [{
                usage: `${this.name} set <@Role/Role ID>`,
                description: "Sets the suggestion channel"
            }, {
                usage: `${this.name} remove`,
                description: "Removes the suggestion channel"
            }]);
        };
    };
};