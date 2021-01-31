import Command from '@root/Command';
import MessageCount from '@models/messageCount';
import { User } from 'discord.js';
import mongoose from 'mongoose';

module.exports = class MessagesCommand extends Command {
    constructor(client){
        super(client, {
            name: "messages",
            description: "shows the amount of messages sent by an user",
            guildOnly: true,
            usage: "messages [@User/User ID]",
            category: "miscellaneous"
        });
    };
    async run(client, message, args, prefix) {
        const usage = `${prefix}messages [@User/User ID]`;
        let user: User = message.member.user;
        if (message.mentions.users.first()) user = message.mentions.users.first();
        if (args[0] && message.guild.members.cache.get(args[0])) user = message.guild.members.cache.get(args[0]).user;
        const check = message.guild.members.cache.get(user.id);
        if (check && !user.bot) {
            await MessageCount.findOne({
                messageGuildID: message.guild.id,
                messageUserID: user.id
            }, async (err: unknown, messageProfile: any) => {
                if (err) return console.log(err);
                if (!messageProfile) {
                    const newProfile = new MessageCount({
                        _id: mongoose.Types.ObjectId(),
                        messageGuildID: message.guild.id,
                        messageUserID: user.id,
                        messageCount: 0,
                        lastUpdated: Date.now()
                    });
                    newProfile.save().catch(err => console.log(err));
                    return message.channel.send(client.createEmbed().setAuthor(user.username, user.displayAvatarURL()).setDescription(`${user} sent \`${newProfile.messageCount.toLocaleString()}\` messages in this server!`));
                } else if (messageProfile) {
                    return message.channel.send(client.createEmbed().setAuthor(user.username, user.displayAvatarURL()).setDescription(`${user} sent \`${messageProfile.messageCount.toLocaleString()}\` messages in this server!`))
                } else {
                    return;
                };
            });
        } else {
            return message.channel.send(client.createRedEmbed(true, usage).setTitle(`${client.arrowEmoji} Message Manager`).setDescription(`The user ${user} is a bot!`));
        };
    };
};