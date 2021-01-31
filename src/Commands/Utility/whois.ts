import Command from '@root/Command';
import { GuildMember } from 'discord.js';

module.exports = class WhoisCommand extends Command {
    constructor(client){
        super(client, {
            name: "whois",
            description: "shows some infos about a member",
            usage: "whois [@User/User ID]",
            category: "utility",
            guildOnly: true
        });
    };
    async run(client, message, args, prefix) {
        let member: GuildMember = message.member;
        if (message.mentions.users.first()) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.get(args[0])) member = message.guild.members.cache.get(args[0]);
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
        let roles = member.roles.cache.map((r) => `${r}`);
        roles.splice(roles.length - 1, 1);

        return message.channel.send(client.createEmbed()
            .setColor(member.roles.highest.hexColor)
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(`${member.user}`)
            .addField("Nickname (username if they don't have one)", member.displayName)
            .addField('ID', member.user.id)
            .addField('Avatar', `[Link](${member.user.displayAvatarURL()})`)
            .addField('Registered on Discord', `${weekDays[new Date(member.user.createdAt).getUTCDay()]}, ${monthNames[new Date(member.user.createdAt).getUTCMonth()]} ${new Date(member.user.createdAt).getUTCDate()}, ${new Date(member.user.createdAt).getUTCFullYear()}, ${new Date(member.user.createdAt).getUTCHours()}:${new Date(member.user.createdAt).getUTCMinutes()}:${new Date(member.user.createdAt).getUTCSeconds()} UTC`)
            .addField('Joined this server', `${weekDays[new Date(member.joinedAt).getUTCDay()]}, ${monthNames[new Date(member.joinedAt).getUTCMonth()]} ${new Date(member.joinedAt).getUTCDate()}, ${new Date(member.joinedAt).getUTCFullYear()}, ${new Date(member.joinedAt).getUTCHours()}:${new Date(member.joinedAt).getUTCMinutes()}:${new Date(member.joinedAt).getUTCSeconds()} UTC`)
            .addField(`Roles [${roles.length}]`, roles.join(' ')));
    };
};