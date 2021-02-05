import Command, { CommandRunner } from '@root/Command';
import { GuildMember } from 'discord.js';

export default class NickNameCommand extends Command {
    constructor() {
        super({
            name: "nickname",
            aliases: ["nick"],
            userPermissions: ["CHANGE_NICKNAME", "MANAGE_NICKNAMES"],
            clientPermissions: ["MANAGE_NICKNAMES"],
            description: "changes the nickname of a member",
            category: "miscellaneous",
            guildOnly: true,
            usage: "nickname set [@User/User ID] <new name>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (args[0] && args[0].toLowerCase() == 'set') {
            let member: GuildMember = message.member;
            let optional: boolean = false;
            if (message.mentions.users.first() && message.guild.members.cache.has(message.mentions.users.first().id)) {
                member = message.guild.members.cache.get(message.mentions.users.first().id);
                optional = true;
            };
            if (args[1] && message.guild.members.cache.has(args[1])) {
                member = message.guild.members.cache.get(args[1]);
                optional = true;
            };
            if (member.id != message.author.id && !message.member.hasPermission("MANAGE_NICKNAMES")) return message.channel.send(client.createRedEmbed(true, `${prefix}nickname set <new name>`)
                .setTitle("Nickname Manager")
                .setDescription("You need the permission `Manage Nicknames` to edit the nicknames of other server members!"));
            if (optional ? !args[2] : !args[1]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("Nickname Manager")
                .setDescription(member.id == message.author.id ? "You have to provide a new nickname for you!" : "You have to provide a new name for this member!"));
            member.setNickname(args.slice(optional ? 3 : 2).join(" ")).catch(err => console.log(err));
        } else if (args[0] && args[0].toLowerCase() == 'remove') {


        } else {
            return message.reply("LOL")
        };
    };
};