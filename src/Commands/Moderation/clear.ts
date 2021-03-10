import GalaxyAlpha from '@root/Client';
import Command, { CommandRunner } from '@root/Command';
import { Message, NewsChannel, TextChannel } from 'discord.js';

export default class ClearCommand extends Command {
    constructor() {
        super({
            name: "clear",
            description: "deletes an amount of messages or delete messages, that includes a specific content",
            aliases: ["purge", "delete", "clean"],
            category: "moderation",
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["MANAGE_MESSAGES"],
            usage: "clear <amount of messages> [@User/User ID] or clear content <content>",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const clearManager = "🧹 Clear Manager";
        if (isNaN(args[0] as unknown as number) && message.mentions.users.size == 0) {
            const number = args[1] ? parseInt(args[1]) : 100;
            const messages = (await message.channel.messages.fetch()).filter(msg => msg.id != message.id && message.deletable);
            if (messages.size == 0) return client.createArgumentError(message, { title: clearManager, description: "Cannot find any messages in this channel!" }, this.usage);
            const filterPinnedMessages = messages.filter(message => !message.pinned);
            if (filterPinnedMessages.size == 0) return client.createArgumentError(message, { title: clearManager, description: "Cannot delete pinned messages!" }, this.usage);
            const filterContentMessages = filterPinnedMessages.filter(message => message.content.toLowerCase().includes(args[0].toLowerCase()));
            if (filterContentMessages.size == 0) return client.createArgumentError(message, { title: clearManager, description: client.util.embedFormatter.embedDescriptionLimiter(`Cannot find any messages, that includes \`${args[0]}\`!`) }, this.usage);
            (message.channel as TextChannel | NewsChannel).bulkDelete(filterContentMessages.first(number));
            return await message.delete();
        } else if (message.mentions.users.first() || (args[0] && client.users.cache.has(args[0]))) {
            const user = message.mentions.users.first() ? message.mentions.users.first() : client.users.cache.get(args[0]);
            const number = args[1] ? parseInt(args[1]) : 100;
            const messages = (await message.channel.messages.fetch()).filter(msg => msg.id != message.id && message.deletable);
            if (messages.size == 0) return client.createArgumentError(message, { title: clearManager, description: "Cannot find any messages in this channel!" }, this.usage);
            const filterPinnedMessages = messages.filter(message => !message.pinned);
            if (filterPinnedMessages.size == 0) return client.createArgumentError(message, { title: clearManager, description: "Cannot delete pinned messages!" }, this.usage);
            const userMessages = filterPinnedMessages.filter(msg => msg.author.id == user.id);
            if (userMessages.size == 0) return client.createArgumentError(message, { title: clearManager, description: `Cannot find any messages written by ${user}!` }, this.usage);
            (message.channel as TextChannel | NewsChannel).bulkDelete(userMessages.first(number));
            return await message.delete();
        } else if (!isNaN(args[0] as unknown as number)) {
            let numberOfMessages = parseInt(args[0]);
            const messages = (await message.channel.messages.fetch()).filter(msg => msg.id != message.id && message.deletable);
            if (messages.size == 0) return client.createArgumentError(message, { title: clearManager, description: "Cannot find any messages in this channel!" }, this.usage);
            const filterPinnedMessages = messages.filter(message => !message.pinned);
            if (filterPinnedMessages.size == 0) return client.createArgumentError(message, { title: clearManager, description: "Cannot delete pinned messages!" }, this.usage);
            for (let i = Math.ceil(parseInt(args[0]) / 100); i > 0; i-- ) {
                await (message.channel as TextChannel | NewsChannel).bulkDelete(filterPinnedMessages.first(i * 100));
                console.log(i);
            };
            return await message.delete();
        } else return client.createEmbedForSubCommands(message, {
            title: "🧹 Clear",
            description: "Use this commands to clear messages with options!"
        }, []);
    };
};