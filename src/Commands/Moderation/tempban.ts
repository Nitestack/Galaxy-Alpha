import Command, { CommandRunner } from "@root/Command";
import { GuildMember } from "discord.js";

export default class TempBanCommand extends Command {
    constructor() {
        super({
            name: "temporaryban",
            aliases: ["tempban"],
            description: "temporary bans a user",
            category: "moderation",
            guildOnly: true,
            userPermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
            usage: "tempban <@User/User ID> <duration> [reason]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let member: GuildMember;
        if (message.mentions.users.first() && message.guild.members.cache.has(message.mentions.users.first().id)) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.has(args[0])) member = message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("You have to mention an user or provide an user ID!"));
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription("You cannot ban yourself!"));
        if (member.id == message.guild.ownerID) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription("You cannot ban the owner!"));
        if (member.id == client.user.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription("Cannot ban myself!"));
        let banDuration: number = client.ms(args[1]);
        if (!banDuration) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("You have to provide a valid duration!"));
        const reason = args.slice(2).join(" ") || "No reason provided!";
        if (!member.bannable) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("I don't have the permission to temp ban this member! Make sure I have the permission `Kick Members` or `Administrator`!"));
        client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription(`Do you really want to ban ${member.user}?\n📝 **Reason:** ${reason}\n\nYou have 30s to react!`)), {
            title: "🔨 Ban Manager",
            toHandle: `${member}`,
            activity: "banning"
        }, this.usage, async (reaction, user) => {
            await member.ban({ reason: `${reason} (banned by ${message.author.tag})` });
            await client.modLogWebhook(message.guild.id, client.createEmbed()
                .setTitle("Member temporary banned!")
                .setDescription(`**Member:** ${member.user}
                **Banned by:** ${message.author}
                **Time:** ${args[1]}
                **Reason:** *${reason}*`));
            message.channel.send(client.createGreenEmbed()
                .setTitle("🔨 Ban Manager")
                .setDescription(`🔨 ${member.user} was banned for **${banDuration}**!\n📝 **Reason:** ${reason}`));
            member.send(client.createEmbed()
                .setTitle("🔨 Ban Manager")
                .setDescription(`You were temporary banned from **${message.guild.name}** for **${banDuration}**!
                ${client.memberEmoji} **Banned By:** ${message.author}
                📝 **Reason:** ${reason}`));
            return setTimeout(() => message.guild.members.unban(member.id), banDuration);
        });
    };
};