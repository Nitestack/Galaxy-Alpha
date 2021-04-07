import Command, { CommandRunner } from '@root/Command';
import { GuildMember } from 'discord.js';

export const name: string = 'mute';

export default class MuteCommand extends Command {
    constructor() {
        super({
            name: "mute",
            description: "mutes a member of the server",
            category: "moderation",
            userPermissions: ["MANAGE_ROLES", "MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"],
            guildOnly: true,
            usage: "mute <@User/User ID> [time] [reason]"
        });
    };
    run: CommandRunner = async (client, message, args: Array<string>, prefix) => {
        message.channel.send("This feature is coming soon!");
        const muteManager = "⛔ Mute Manager";
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (!guildSettings.muteRoleID) return client.createArgumentError(message, { title: muteManager, description: "This server has no mute role set!" }, this.usage);
        if (!guildSettings.memberRoleID) return client.createArgumentError(message, { title: muteManager, description: "This server has no mute role set!" }, this.usage);
        let member: GuildMember;
        if (message.mentions.members.first() && message.guild.members.cache) member = message.mentions.members.first();
        else if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).has(args[0])) member = message.guild.members.cache.get(args[0]);
        let time: number = 0;
        let timeMute: boolean = false;
        if (args[1] && client.ms(args[1])) {
            time = client.ms(args[1]);
            timeMute = true;
        };
        const reason = timeMute ? args.slice(2).join(" ") || "No reason provided!" : args.slice(1).join(" ") || "No reason provided!";
        client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed()
            .setTitle(muteManager)
            .setDescription(`Do you really want to mute ${member} ${timeMute ? `for ${client.humanizer(time, {
                round: true,
                units: ["y", "mo", "w", "d", "h", "m", "s"]
            })}` : "permananently"}?`)), {
            title: muteManager,
            toHandle: "muting member",
            activity: "muting"
        }, this.usage, async (reaction, user) => {
            await member.roles.remove(guildSettings.memberRoleID);
            await member.roles.add(guildSettings.muteRoleID);
            await member.send(client.createRedEmbed()
                .setTitle(muteManager)
                .setDescription(`Your were muted in **${message.guild.name}** by ${message.author}!\n📝 **Reason:** ${reason}`));
            await client.createSuccess(message, {
                title: muteManager, description: `You successfully muted ${member} ${timeMute ? `for ${client.humanizer(time, {
                    round: true,
                    units: ["y", "mo", "w", "d", "h", "m", "s"]
                })}` : "permananently"}!`
            });
            client.cache.mutes.set(`${message.guild.id}-${member.id}`, message.createdTimestamp);
            setTimeout(async () => {
                client.cache.mutes.delete(`${message.guild.id}-${member.id}`);
                await member.roles.remove(guildSettings.muteRoleID);
                await member.roles.add(guildSettings.memberRoleID);
            }, time);
        });
    };
};