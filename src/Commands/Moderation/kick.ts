import Command, { CommandRunner } from '@root/Command';
import { GuildMember } from 'discord.js';
import { TextChannel, NewsChannel } from 'discord.js';

export const name: string = 'kick';

export default class KickCommand extends Command {
    constructor() {
        super({
            name: "kick",
            description: "kicks a member from the server",
            userPermissions: ["ADMINISTRATOR", "KICK_MEMBERS"],
            category: "moderation",
            clientPermissions: ["KICK_MEMBERS", "ADMINISTRATOR"],
            usage: "kick <@User/User ID> [reason]",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const usage: string = `${prefix}${this.usage}`;
        let member: GuildMember;
        if (message.mentions.users.first()) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.has(args[0])) member = message.guild.members.cache.get(args[0]);
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription("You cannot kick yourself!"));
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription("You cannot kick yourself!"));
        if (member.id == message.guild.ownerID) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription("You cannot kick the owner!"));
        if (member.id == client.user.id) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription("Cannot kick myself!"));
        if (member) {
            if (member.kickable) {
                const reason = args.slice(1).join(" ") || "No reason provided!";
                client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription(`Do you really want to kick ${member.user}?\n📝 **Reason:** ${reason}\n\nYou have 10s to react!`)), {
                    title: "🤜 Kick Manager",
                    toHandle: `${member}`,
                    activity: "kicking"
                }, this.usage, async (reaction, user) => {
                    await member.kick(`${reason} (kicked by ${message.author.tag})`);
                    await client.modLogWebhook(message.guild.id, client.createRedEmbed()
                        .setTitle("Member Kicked!")
                        .setDescription(`**Member:** ${member.user}
                        **Kicked by:** ${message.author}
                        **Reason**: *${reason}*`));
                    message.channel.send(client.createGreenEmbed()
                        .setTitle("🤜 Kick Manager")
                        .setDescription(`🤜 ${member.user} was kicked!\n📝 **Reason:** ${reason}`));
                    return member.send(client.createEmbed()
                        .setTitle("🤜 Kick Manager")
                        .setDescription(`You were kicked from **${message.guild.name}**!
                        ${client.memberEmoji} **Kicked By:** ${message.author}
                        📝 **Reason:** ${reason}`));
                });
            } else return message.channel.send(client.createRedEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription("I don't have the permission to kick members!"));
        } else {
            return message.channel.send(client.createRedEmbed(true, usage).setTitle("🤜 Kick Manager").setDescription(`Cannot find the user ${args[0]}!`));
        };
    };
};