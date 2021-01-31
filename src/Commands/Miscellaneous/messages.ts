import Command from '@root/Command';
import { User } from 'discord.js';
import GalaxyAlpha from '@root/Client';

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
    async run(client: GalaxyAlpha, message, args, prefix) {
        let user: User = message.member.user;
        if (message.mentions.users.first() && message.guild.members.cache.filter(member => !member.user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).has(args[0])) user = message.guild.members.cache.get(args[0]).user;
        return message.channel.send(client.createEmbed()
            .setTitle(`${client.chatEmoji} Messages`)
            .setDescription(`${user} sent \`${client.cache.messages.has(`${user.id}-${message.guild.id}`) ? client.cache.messages.get(`${user.id}-${message.guild.id}`).messageCount.toLocaleString() : (await client.cache.getMessages(message.guild.id, user.id)).toLocaleString()}\` messages in this server!`));
    };
};