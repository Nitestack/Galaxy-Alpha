import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';

export default class MessagesCommand extends Command {
    constructor(){
        super({
            name: "messages",
            description: "shows the amount of messages sent by an user",
            guildOnly: true,
            usage: "messages [@User/User ID]",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User = message.member.user;
        if (message.mentions.users.first() && message.guild.members.cache.filter(member => !member.user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).has(args[0])) user = message.guild.members.cache.get(args[0]).user;
        return message.channel.send(client.createEmbed()
            .setTitle(`${client.chatEmoji} Messages`)
            .setDescription(`${user} sent \`${(await client.cache.getLevelandMessages(message.guild.id, user.id)).messages.toLocaleString()}\` messages in this server!`));
    };
};