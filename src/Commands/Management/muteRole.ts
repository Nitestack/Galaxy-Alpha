import Command, { CommandRunner } from '@root/Command';
import Guild from '@models/guild';
import { Role } from 'discord.js';

export default class MuteRoleCommand extends Command {
    constructor(){
        super({
            name: "muterole",
            description: "mute role commands",
            category: "management",
            guildOnly: true,
            usage: "muterole create <mute role name> or muterole set <@Role/Role ID> or muterole remove",
            userPermissions: ["MANAGE_GUILD"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const createUsage = `${prefix}muterole create <mute role name>`;
        const setUsage = `${prefix}muterole set <@Role/Role ID>`;
        const deleteUsage = `${prefix}muterole remove`;
        if (args[0].toLowerCase() == 'create') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, createUsage)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
            if (!args[1]) {
                const embed = client.createRedEmbed(true, createUsage)
                    .setTitle("🔇 Mute Role Manager")
                    .setDescription('You have to provide a role name for the mute role!');
                return message.channel.send(embed);
            } else {
                return message.channel.send(client.createEmbed(true, createUsage).setTitle("🔇 Mute Role Manager")
                    .setDescription(`Do you really want to create a mute role?\n**TIP:** You can set a already existing mute role with\n\`${setUsage}\`!`)).then(async msg => {
                        await msg.react(client.yesEmoji);
                        await msg.react(client.noEmoji);
                        const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                        YesOrNo.on('collect', async (reaction, user) => {
                            if (reaction.emoji.id == client.yesEmojiID) {
                                message.guild.roles.create({
                                    data: {
                                        name: args[1],
                                        color: '#818386',
                                    }
                                }).then(async (role) => {
                                    message.guild.channels.cache.filter(channel => ['news', 'store', 'voice', 'text', 'category'].includes(channel.type.toLowerCase()))
                                        .each((channel) => {
                                            if (channel.type == 'voice') {
                                                channel.createOverwrite(role, {
                                                    CONNECT: false,
                                                });
                                            } else if (channel.type == 'category') {
                                                channel.createOverwrite(role, {
                                                    SEND_MESSAGES: false,
                                                    ADD_REACTIONS: false,
                                                    CONNECT: false,
                                                });
                                            } else {
                                                channel.createOverwrite(role, {
                                                    SEND_MESSAGES: false,
                                                    ADD_REACTIONS: false,
                                                });
                                            }
                                        });
                                    await Guild.findOneAndUpdate({
                                        guildID: message.guild.id,
                                    }, {
                                        muteRole: role.id,
                                    }, {
                                        upsert: false,
                                    });
                                    return message.channel.send(
                                        client.createGreenEmbed().setTitle("🔇 Mute Role Manager")
                                            .setDescription(`Sucessfully created the role \`${role.name}\` and overwrote all channels permissions
                                        Make sure, that the mute role is over all roles, who can bet muted
                                        For example you want, that all members (includes staff) can be muted Then you have to move the mute role over all roles in the server!
                                        But if you want, that all members can be muted without the staff members, move the role between all member roles and the staff roles!`));
                                }).catch((err) => console.log(err));
                            } else {
                                return msg.channel.send(client.createRedEmbed().setTitle("🔇 Mute Role Manager").setDescription("Creating mute role cancelled!"));
                            };
                        });
                        YesOrNo.on('end', collected => {
                            if (collected.size == 0) {
                                return msg.channel.send(client.createRedEmbed().setTitle("🔇 Mute Role Manager").setDescription("Creating mute role cancelled!"));
                            };
                        });
                    });
            };
        } else if (args[0].toLowerCase() == 'set') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, setUsage)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
            const GuildSchema = await Guild.findOne({
                guildID: message.guild.id
            }, {}, {}, (err, guild) => {
                if (err) return console.log(err);
            });
            let role: Role;
            if (message.mentions.roles.first()) role = message.mentions.roles.first();
            if (args[1] && message.guild.roles.cache.get(args[1])) role = message.guild.roles.cache.get(args[1]);
            if (!role) return message.channel.send(client.createRedEmbed(true, setUsage).setTitle("🔇 Mute Role Manager").setDescription("You have to mention a role or provide a role ID!"));
            if (role.id == GuildSchema.muteRole) return message.channel.send(client.createRedEmbed(true, setUsage).setTitle("🔇 Mute Role Manager").setDescription("The role is already the mute role!"));
            const check = message.guild.roles.cache.get(role.id);
            if (check) {
                return message.channel.send(client.createEmbed(true, setUsage).setTitle("🔇 Mute Role Manager")
                    .setDescription(`Do you really want to update the mute role to ${role}?`)).then(async msg => {
                        await msg.react(client.yesEmojiID);
                        await msg.react(client.noEmojiID);
                        const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                        YesOrNo.on('collect', async (reaction, user) => {
                            if (reaction.emoji.id == client.yesEmojiID) {
                                await Guild.findOneAndUpdate({
                                    guildID: message.guild.id,
                                }, {
                                    muteRole: role.id,
                                }, {
                                    upsert: false,
                                }).catch(err => console.log(err));
                                message.guild.channels.cache
                                    .filter(channel => ['news', 'store', 'voice', 'text'].includes(channel.type.toLowerCase()))
                                    .each((channel) => {
                                        if (channel.type == 'voice') {
                                            channel.createOverwrite(role, {
                                                CONNECT: false,
                                            });
                                        } else if (channel.type == 'category') {
                                            channel.createOverwrite(role, {
                                                SEND_MESSAGES: false,
                                                ADD_REACTIONS: false,
                                                CONNECT: false,
                                            });
                                        } else {
                                            channel.createOverwrite(role, {
                                                SEND_MESSAGES: false,
                                                ADD_REACTIONS: false,
                                            });
                                        }
                                    });
                                return message.channel.send(client.createGreenEmbed().setTitle("🔇 Mute Role Manager").setDescription(`Sucessfully updated the mute role to ${role}!`));
                            } else {
                                return msg.channel.send(client.createRedEmbed().setTitle("🔇 Mute Role Manager").setDescription("Updating mute role cancelled!"));
                            };
                        });
                        YesOrNo.on('end', collected => {
                            if (collected.size == 0) {
                                return msg.channel.send(client.createRedEmbed().setTitle("🔇 Mute Role Manager").setDescription("Updating mute role cancelled!"));
                            };
                        });
                    }).catch(err => console.log(err));
            } else {
                return message.channel.send(client.createRedEmbed(true, setUsage).setTitle("🔇 Mute Role Manager").setDescription(`Cannot find the role \`${args[1]}\`!`));
            };
        } else if (args[0].toLowerCase() == 'remove') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, deleteUsage)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
            await Guild.findOneAndUpdate({
                guildID: message.guild.id,
            }, {
                muteRole: null,
            }, {
                upsert: false,
            }).catch((err) => console.log(err));
            return message.channel.send(client.createGreenEmbed().setTitle("🔇 Mute Role Manager").setDescription('Removed the current mute role!\nNow you have to set a new mute role!'));
        } else {
            const embed = client.createEmbed()
                .setTitle("🔇 Mute Role Manager")
                .setDescription(`Make sure you have a member role in your server, otherwise the mute role doens't work!`)
                .addField('Create a mute role', `\`${createUsage}\``)
                .addField('Set a role as the mute role', `\`${setUsage}\``)
                .addField('Removes the mute function from the current mute role', `\`${deleteUsage}\``);
            return message.channel.send(embed);
        };
    };
};