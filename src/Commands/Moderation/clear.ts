import Command from '@root/Command';
import { User } from 'discord.js';

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
    async run(client, message, args, prefix) {
        const amountUsage = `${prefix}clear <amount of messages> [@User/User ID]`;
        const contentUsage = `${prefix}clear content <content>`;
        const clearManager = "🧹 Clear Manager";
        let counter = 0;
        if (args[0] && args[0].toLowerCase() == 'content') {
            if (message.channel.type == 'dm') return;
            if (!args[1]) return message.channel.send(client.createRedEmbed(true, contentUsage).setTitle(clearManager).setDescription("You have to provide an content!"));
            await message.channel.messages.fetch({ limit: 100 }).then(messages => {
                messages.filter((m) => m.content.toLowerCase().includes(args[1].toLowerCase()));
                if (messages.size == 0) return message.channel.send(client.createRedEmbed(true, contentUsage).setTitle(clearManager).setDescription(`Cannot find any messages, that includes \`${args[1]}\``));
                const result = messages.filter(m => !m.pinned);
                message.channel.bulkDelete(result);
                if (result.size == 0) return message.channel.send(client.createRedEmbed(true, clearManager)
                    .setTitle(clearManager)
                    .setDescription(`This channel has only pinned messages and I'm not allowed to delete pinned messages!`));
            });
        } else if (!isNaN(args[0])) {
            if (parseInt(args[0]) < 1) return message.channel.send(client.createRedEmbed().setTitle(clearManager).setDescription("You have to delete atleast `1` message!"));
            if (parseInt(args[0]) > 1000) return message.channel.send(client.createRedEmbed().setTitle(clearManager).setDescription("I cannot delete more than `1000` messages!"));
            if (message.channel.type == 'dm') return;

            if (parseInt(args[0]) > 100 && parseInt(args[0]) <= 200) {
                const difference = parseInt(args[0]) - 100;
                deleteMessages(100, false);
                deleteMessages(difference, true);
            } else if (parseInt(args[0]) > 200 && parseInt(args[0]) <= 300) {
                const difference = parseInt(args[0]) - 200;
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(difference, true);
            } else if (parseInt(args[0]) > 300 && parseInt(args[0]) <= 400) {
                const difference = parseInt(args[0]) - 300;
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(difference, true);
            } else if (parseInt(args[0]) > 400 && parseInt(args[0]) <= 500) {
                const difference = parseInt(args[0]) - 400;
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(difference, true);
            } else if (parseInt(args[0]) > 500 && parseInt(args[0]) <= 600) {
                const difference = parseInt(args[0]) - 500;
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(difference, true);
            } else if (parseInt(args[0]) > 600 && parseInt(args[0]) <= 700) {
                const difference = parseInt(args[0]) - 600;
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(difference, true);
            } else if (parseInt(args[0]) > 700 && parseInt(args[0]) <= 800) {
                const difference = parseInt(args[0]) - 700;
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(difference, true);
            } else if (parseInt(args[0]) > 800 && parseInt(args[0]) <= 900) {
                const difference = parseInt(args[0]) - 800;
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(difference, true);
            } else if (parseInt(args[0]) > 900 && parseInt(args[0]) <= 1000) {
                const difference = parseInt(args[0]) - 900;
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(difference, true);
            } else if (parseInt(args[0]) == 1000) {
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, false);
                deleteMessages(100, true);
            } else {
                deleteMessages(parseInt(args[0]), true);
            }
        } else {
            return message.channel.send(client.createEmbed()
                .setTitle(clearManager)
                .addField("Clear an amount of messages", `\`${prefix}clear <amount of messages> [@User/User ID]\``)
                .addField("Clear messages, that includes a content", `\`${prefix}clear content <content>\``));
        };

        async function deleteMessages(number: number, messageYesOrNo: Boolean, user?: User) {
            await message.channel.messages
                .fetch({ limit: number })
                .then(messages => {
                    if (messages.size == 0) return message.channel.send(client.createRedEmbed(true, amountUsage).setTitle(clearManager).setDescription("Cannot find any messages in this channel!"));
                    const result = messages.filter(m => !m.pinned);
                    if (user) messages.filter(m => m.author.id == user.id);
                    counter += result.size;
                    message.channel.bulkDelete(result);
                    if (messageYesOrNo) {
                        if (counter == 0) {
                            const resultSizeEmbed = client.createRedEmbed()
                                .setTitle('Cannot clear messages!')
                                .setDescription(`This channel has only pinned messages and I'm not allowed to delete pinned messages!`);
                            return message.channel.send(resultSizeEmbed);
                        } else {
                            return;
                        };
                    };
                });
        };
    };
};