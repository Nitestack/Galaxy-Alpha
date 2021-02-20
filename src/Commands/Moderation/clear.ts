import Command, { CommandRunner } from '@root/Command';
import { NewsChannel, User, TextChannel } from 'discord.js';

export default class ClearCommand extends Command {
    constructor(){
        super({
            name: "clear",
            description: "deletes an amount of messages or delete messages, that includes a specific content",
            aliases: ["purge", "delete", "clean"],
            category: "moderation",
            userPermissions: ["MANAGE_MESSAGES"],
            usage: "clear <amount of messages> [@User/User ID] or clear content <content>",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const contentUsage = `${prefix}clear content <content>`;
        const clearManager = "🧹 Clear Manager";
        if (args[0]?.toLowerCase() == 'content') {
            if (!args[1]) return message.channel.send(client.createRedEmbed(true, contentUsage).setTitle(clearManager).setDescription("You have to provide an content!"));
            await message.channel.messages.fetch().then(messages => {
                if (messages.filter(m => m.content.toLowerCase().includes(args[1].toLowerCase())).size == 0) return message.channel.send(client.createRedEmbed(true, contentUsage).setTitle(clearManager).setDescription(`Cannot find any messages, that includes \`${args[1]}\``));
                const result = messages.filter(m => !m.pinned && m.content.toLowerCase().includes(args[1].toLowerCase()));
                (message.channel as TextChannel | NewsChannel).bulkDelete(result);
                if (result.size == 0) return message.channel.send(client.createRedEmbed(true, clearManager)
                    .setTitle(clearManager)
                    .setDescription(`This channel has only pinned messages and I'm not allowed to delete pinned messages!`));
            });
        } else if (!isNaN((args[0] as unknown as number))) {
            
        };
    };
};