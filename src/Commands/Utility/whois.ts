import Command, { CommandRunner } from '@root/Command';
import { GuildMember } from 'discord.js';

export default class WhoisCommand extends Command {
    constructor(){
        super({
            name: "whois",
            description: "shows some infos about a member",
            usage: "whois [@User/User ID]",
            category: "utility",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let member: GuildMember = message.member;
        if (message.mentions.users.first()) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.get(args[0])) member = message.guild.members.cache.get(args[0]);
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
        const roles = member.roles.cache.filter(role => role.id != message.guild.id).sort((a, b) => { if (a.position < b.position) return -1; if (a.position > b.position) return 1; return 0; }).map((r) => `${r}`).reverse();
        return message.channel.send(client.createEmbed()
            .setColor(member.roles.highest.hexColor)
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member.user}`)
            .addField("Nickname (username if they don't have one)", member.displayName)
            .addField('ID', member.user.id)
            .addField('Avatar', `[Link](${member.user.displayAvatarURL({ dynamic: true })})`)
            .addField('Registered on Discord', `${weekDays[new Date(member.user.createdAt).getUTCDay()]}, ${monthNames[new Date(member.user.createdAt).getUTCMonth()]} ${new Date(member.user.createdAt).getUTCDate()}, ${new Date(member.user.createdAt).getUTCFullYear()}, ${new Date(member.user.createdAt).getUTCHours()}:${new Date(member.user.createdAt).getUTCMinutes()}:${new Date(member.user.createdAt).getUTCSeconds()} UTC`)
            .addField('Joined this server', `${weekDays[new Date(member.joinedAt).getUTCDay()]}, ${monthNames[new Date(member.joinedAt).getUTCMonth()]} ${new Date(member.joinedAt).getUTCDate()}, ${new Date(member.joinedAt).getUTCFullYear()}, ${new Date(member.joinedAt).getUTCHours()}:${new Date(member.joinedAt).getUTCMinutes()}:${new Date(member.joinedAt).getUTCSeconds()} UTC`)
            .addField(`Roles [${roles.length}]`, roles.join(' ')));
    };
};