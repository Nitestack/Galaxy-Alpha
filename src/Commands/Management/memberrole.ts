import Command, { CommandRunner } from '@root/Command';
import Guild from '@models/guild';
import { Role } from 'discord.js';

export default class MemberRoleCommand extends Command {
    constructor(){
        super({
            name: "memberrole",
            description: "member role commands",
            usage: "memberrole set <@Role/Role ID> or memberrole remove",
            category: "management",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const setUsage = `${prefix}memberrole set <@Role/Role ID>`;
        const deleteUsage = `${prefix}memberrole remove`;
        if (args[0].toLowerCase() == 'set') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, setUsage)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
            const GuildSchema = await Guild.findOne({
                guildID: message.guild.id
            }, {}, {}, (err, guild) => {
                if (err) return console.log(err);
                if (guild) return guild;
                if (!guild) return false;
            });
            let role: Role;
            if (message.mentions.roles.first()) role = message.mentions.roles.first();
            if (args[1] && message.guild.roles.cache.get(args[1])) role = message.guild.roles.cache.get(args[1]);
            if (!role) return message.channel.send(client.createRedEmbed(true, setUsage).setTitle(`${client.memberEmoji} Member Role Manager`).setDescription("You have to mention a role or provide a role ID!"));
            if (role.id == GuildSchema.memberRole) return message.channel.send(client.createRedEmbed(true, setUsage).setTitle(`${client.memberEmoji} Member Role Manager`).setDescription("The role is already the member role!"));
            const check = message.guild.roles.cache.get(role.id);
            if (check) {
                return message.channel.send(client.createEmbed(true, setUsage).setTitle(`${client.memberEmoji} Member Role Manager`)
                    .setDescription(`Do you really want to update the member role to ${role}?`)).then(async msg => {
                        await msg.react(client.yesEmojiID);
                        await msg.react(client.noEmojiID);
                        const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                        YesOrNo.on('collect', async (reaction, user) => {
                            if (reaction.emoji.id == client.yesEmojiID) {
                                msg.reactions.cache.get(client.yesEmojiID).users.remove(message.author.id);
                                await Guild.findOneAndUpdate({
                                    guildID: message.guild.id,
                                }, {
                                    memberRole: role.id,
                                }, {
                                    upsert: false,
                                }).catch(err => console.log(err));
                                return message.channel.send(client.createGreenEmbed().setTitle(`${client.memberEmoji} Member Role Manager`).setDescription(`Sucessfully updated the member role to ${role}!`));
                            } else {
                                msg.reactions.cache.get(client.noEmojiID).users.remove(message.author.id);
                                return msg.channel.send(client.createRedEmbed().setTitle(`${client.memberEmoji} Member Role Manager`).setDescription("Updating member role cancelled!"));
                            };
                        });
                        YesOrNo.on('end', collected => {
                            if (collected.size == 0) {
                                return msg.channel.send(client.createRedEmbed().setTitle(`${client.memberEmoji} Member Role Manager`).setDescription("Updating member role cancelled!"));
                            };
                        });
                    }).catch(err => console.log(err));
            } else {
                return message.channel.send(client.createRedEmbed(true, setUsage).setTitle(`${client.memberEmoji} Member Role Manager`).setDescription(`Cannot find the role \`${args[1]}\`!`));
            };
        } else if (args[0].toLowerCase() == 'remove') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, deleteUsage)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
            await Guild.findOneAndUpdate({
                guildID: message.guild.id,
            }, {
                memberRole: null,
            }, {
                upsert: false,
            }).catch((err) => console.log(err));
            return message.channel.send(client.createGreenEmbed().setTitle(`${client.memberEmoji} Member Role Manager`).setDescription('Removed the current member role!\nNow you have to set a new member role!'));
        } else {
            const embed = client.createEmbed()
                .setTitle(`${client.memberEmoji} Member Role Manager`)
                .addField('Set a role as the member role', `\`${setUsage}\``)
                .addField('Remove a member role', `\`${deleteUsage}\``);
            return message.channel.send(embed);
        };
    };
};