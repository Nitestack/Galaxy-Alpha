import Command, { CommandRunner } from '@root/Command';
import { GuildMember, NewsChannel, TextChannel } from 'discord.js';

export default class BanCommand extends Command {
    constructor() {
        super({
            name: "ban",
            description: "bans a member from the server",
            category: "moderation",
            userPermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
            clientPermissions: ["ADMINISTRATOR", "BAN_MEMBERS"],
            guildOnly: true,
            usage: "ban <@User/User ID> [reason]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const usage: string = `${prefix}ban <@User/User ID> [reason]`;
        let member: GuildMember;
        if (message.mentions.users.first()) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.has(args[0])) member = message.guild.members.cache.get(args[0]);
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription("You cannot ban yourself!"));
        if (member.id == message.guild.ownerID) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription("You cannot ban the owner!"));
        if (member.id == client.user.id) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription("Cannot ban myself!"));
        if (member) {
            if (member.bannable) {
                const reason = args.slice(1).join(" ") || "No reason provided!";
                client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription(`Do you really want to ban ${member.user}?\n📝 **Reason:** ${reason}\n\nYou have 10s to react!`)), {
                    title: "🔨 Ban Manager",
                    toHandle: `${member}`,
                    activity: "banning"
                }, this.usage, async (reaction, user) => {
                    await member.ban({ reason: `${reason} (banned by ${message.author.tag})` });
                    await client.modLogWebhook(message.guild.id, client.createRedEmbed()
                        .setTitle("Member Banned!")
                        .setDescription(`**Member:** ${member.user}
                        **Banned by:** ${message.author}
                        **Reason:** *${reason}*`));
                    message.channel.send(client.createGreenEmbed()
                        .setTitle("🔨 Ban Manager")
                        .setDescription(`🔨 ${member.user} was banned!\n📝 **Reason:** ${reason}`));
                    return member.send(client.createEmbed()
                        .setTitle("🔨 Ban Manager")
                        .setDescription(`You were banned from **${message.guild.name}**!
                        ${client.memberEmoji} **Banned By:** ${message.author}
                        📝 **Reason:** ${reason}`));
                });
            } else return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription("I don't have the permission to ban members!"));
        } else {
            return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔨 Ban Manager").setDescription(`Cannot find the user ${args[0]}!`));
        };
    };
};