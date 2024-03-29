import Command, { CommandRunner } from "@root/Command";
import { User } from "discord.js";

export default class UnbanCommand extends Command {
    constructor() {
        super({
            name: "unban",
            description: "unbans a member of the server",
            category: "moderation",
            userPermissions: ["ADMINISTRATOR"],
            guildOnly: true,
            usage: "unban <@User/User ID>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let member: User;
        if (message.mentions.users.first() && (await message.guild.fetchBans()).has(message.mentions.users.first().id)) member = await client.users.fetch(message.mentions.users.first().id);
        if (args[0] && (await message.guild.fetchBans()).has(args[0])) member = await client.users.fetch(args[0]);
        if (!member) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("You have to mention an user or provide an user ID!"));
        if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🔨 Ban Manager")
            .setDescription("You cannot unban yourself!"));
            if (member.id == message.author.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription("You cannot ban yourself!"));
            if (member.id == message.guild.ownerID) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription("You cannot ban the owner!"));
            if (member.id == client.user.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription("Cannot ban myself!"));
        client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`).setTitle("🔨 Ban Manager").setDescription(`Do you really want to ban ${member}?\n\nYou have 30s to react!`)), {
            title: "🔨 Ban Manager",
            toHandle: `${member}`,
            activity: "unbanning"
        }, this.usage, async (reaction, user) => {
            await message.guild.members.unban(member.id);
            await client.modLogWebhook(message.guild.id, client.createGreenEmbed()
                .setTitle("Member Unbanned!")
                .setDescription(`**Member:** ${member}
                **Unbanned by:** ${message.author}`));
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🔨 Ban Manager")
                .setDescription(`🔨 ${member} was unbanned by ${message.author}!`));
        });
    };
};