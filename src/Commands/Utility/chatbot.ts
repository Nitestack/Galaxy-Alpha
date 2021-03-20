import Command, { CommandRunner } from "@root/Command";
import { NewsChannel, TextChannel } from "discord.js";

export default class extends Command {
    constructor() {
        super({
            name: "chatbot",
            description: "enables or disables chat bot in a specific channel",
            category: "utility",
            requiredRoles: ["serverManagerRoleID"],
            userPermissions: ["MANAGE_CHANNELS"],
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args: Array<string>, prefix) => {
        const chatBotManager = "💬 Chat Bot Manager";
        if (args[0]?.toLowerCase() == "enable") {
            const usage = `${this.name} enable [#channel/channel ID]`;
            let channel = message.channel;
            if (message.mentions.channels.first() && message.guild.channels.cache.has(message.mentions.channels.first().id)) channel = message.mentions.channels.first();
            if (args[1] && message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "news").has(args[1])) channel = message.guild.channels.cache.get(args[1]) as TextChannel | NewsChannel;
            const guildSettings = await client.cache.getGuild(message.guild.id);
            if (guildSettings.chatBot.includes(channel.id)) return client.createArgumentError(message, { title: chatBotManager, description: "This channel has chat bot already enabled!" }, usage);
            guildSettings.chatBot.push(channel.id);
            return client.createSuccess(message, { title: chatBotManager, description: `Successfully enabled chatbot in ${channel}!`});
        } else if (args[0]?.toLowerCase() == "disable") {
            const usage = `${this.name} enable [#channel/channel ID]`;
            let channel = message.channel;
            if (message.mentions.channels.first() && message.guild.channels.cache.has(message.mentions.channels.first().id)) channel = message.mentions.channels.first();
            if (args[1] && message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "news").has(args[1])) channel = message.guild.channels.cache.get(args[1]) as TextChannel | NewsChannel;
            const guildSettings = await client.cache.getGuild(message.guild.id);
            if (!guildSettings.chatBot.includes(channel.id)) return client.createArgumentError(message, { title: chatBotManager, description: "This channel has chat bot already disabled!" }, usage);
            guildSettings.chatBot.splice(guildSettings.chatBot.indexOf(channel.id), 1);
            return client.createSuccess(message, { title: chatBotManager, description: `Successfully disabled chatbot in ${channel}!`});
        } else return client.createEmbedForSubCommands(message, {
            title: "💬 Chat Bot",
            description: "Use this commands to enable chat bot or disable!"
        }, [{
            usage: `${this.name} enable [#channel/channel ID]`,
            description: "Enables the chat bot (if no mention, in the channel, were the message was sent)"
        }, {
            usage: `${this.name} disable [#channel/channel ID]`,
            description: "Disables the chat bot (if no mention, in the channel, were the message was sent)"
        }]);
    };
};