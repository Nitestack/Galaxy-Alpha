import Command, { CommandRunner } from "@root/Command";
import { NewsChannel, TextChannel } from "discord.js";

export default class LockdownCommand extends Command {
    constructor(){
        super({
            name: "lock",
            description: "locks the @everyone permissions in a channel",
            category: "moderation",
            userPermissions: ["MANAGE_CHANNELS"],
            usage: "lock [#channel/channel ID] <enable/disable>",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let channel: TextChannel | NewsChannel = message.channel as TextChannel | NewsChannel;
        if (message.mentions.channels.first() && message.guild.channels.cache.has(message.mentions.channels.first().id)) channel = message.mentions.channels.first();
        if (args[0] && message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(args[0])) channel = message.guild.channels.cache.get(args[0]) as TextChannel | NewsChannel;
        const enableOrDisable = channel.id != message.channel.id && ((message.mentions.channels.first() && message.guild.channels.cache.has(message.mentions.channels.first().id)) || (args[0] && message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "news").has(args[0]))) ? args[1] : args[0];
        if (!enableOrDisable || (enableOrDisable != "enable" && enableOrDisable != "disable")) return client.createArgumentError(message, { title: "Lock Manager", description: "You have to say if you want to enable or disable the lock!" }, this.usage);
        const role = message.guild.roles.everyone;
        if (enableOrDisable == "enable") {
            await channel.updateOverwrite(role, {
                SEND_MESSAGES: true
            })
            return client.createSuccess(message, { title: "Lock Manager", description: `${channel} was unlocked!`});
        } else {
            await channel.updateOverwrite(role, {
                SEND_MESSAGES: false
            });
            return client.createSuccess(message, { title: "Lock Manager", description: `${channel} was locked!`});
        };
    };
};