import Command, { CommandRunner } from '@root/Command';
import { Role } from 'discord.js';

export default class MemberRoleCommand extends Command {
    constructor(){
        super({
            name: "memberrole",
            description: "member role commands",
            usage: "memberrole set <@Role/Role ID> or memberrole remove",
            category: "management",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const memberRoleManager = "🚫 Member Role Manager";
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (args[0]?.toLowerCase() == "set") {
            let role: Role;
            if (message.mentions.roles.first() && message.guild.roles.cache.has(message.mentions.roles.first().id)) role = message.mentions.roles.first();
            if (args[1] && message.guild.roles.cache.has(args[1])) role = message.guild.roles.cache.get(args[1]);
            if (!role) return client.createArgumentError(message, { title: memberRoleManager, description: "You have to mention a role or provide a role ID!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(memberRoleManager)
                .setDescription(`Do you really want to change the current member role to ${role}?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    await client.cache.updateGuild(message.guild.id, {
                        memberRoleID: role.id
                    });
                    return client.createSuccess(message, { title: memberRoleManager, description: `Set the new member role to ${role}` });
                } else return client.createArgumentError(message, { title: memberRoleManager, description: "Setting member role cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: memberRoleManager, description: "Setting member role cancelled!" }, this.usage);
            });
        } else if (args[0]?.toLowerCase() == "remove") {
            if (!guildSettings.memberRoleID) return client.createArgumentError(message, { title: memberRoleManager, description: "There is no member role to remove!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(memberRoleManager)
                .setDescription(`Do you really want to remove the current member role?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    await client.cache.updateGuild(message.guild.id, {
                        memberRoleID: null
                    });
                    return client.createSuccess(message, { title: memberRoleManager, description: `Removed the current member role!` });
                } else return client.createArgumentError(message, { title: memberRoleManager, description: "Removing member role cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: memberRoleManager, description: "Removing member role cancelled!" }, this.usage);
            });
        } else {
            return client.createEmbedForSubCommands(message, {
                title: memberRoleManager,
                description: "Use this commands to set or remove the member role!"
            }, [{
                usage: "memberrole set <@Role/Role ID>",
                description: "Sets the member role"
            }, {
                usage: "memberrole remove",
                description: "Removes the member role"
            }]);
        };
    };
};