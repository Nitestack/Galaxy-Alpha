import Command from '@root/Command';
import { GuildMember, Role } from 'discord.js';
import MemberSchema from '@models/member';
import GuildSchema from '@models/guild';

export const name: string = 'mute';

export default class MuteCommand extends Command {
    constructor() {
        super({
            name: "mute",
            description: "mutes a member of the server",
            category: "moderation",
            userPermissions: ["MANAGE_ROLES", "MANAGE_GUILD"],
            guildOnly: true,
            usage: "mute <@User/User ID> [time] [reason]"
        });
    };
    async run(client, message, args, prefix) {
        const usage = `${prefix}mute <@User/User ID> [time] [reason]`;
        let muteRole: Role;
        let memberRole: Role;
        await GuildSchema.findOne({
            guildID: message.guild.id
        }, {}, {}, (err, guild) => {
            if (err) return console.log(err);
            if (!guild.muteRole) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔇 Mute Role Manager").setDescription(`You have to setup a mute role\n\`${prefix}muterole create <name>\`\n\`${prefix}muterole set <@Role/Role ID>\``));
            if (!guild.memberRole) return message.channel.send(client.createRedEmbed(true, usage).setTitle(`${client.memberEmoji} Member Role Manager`).setDescription(`You have to setup a member role\n\`${prefix}memberrole set <@Role/Role ID>\``));
            if (!guild) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔇 Mute Manager").setDescription("An error occurred while you used the command! Please try again!"));
            muteRole = message.guild.roles.cache.get(guild.muteRole);
            memberRole = message.guild.roles.cache.get(guild.memberRole);

            let member: GuildMember;
            if (message.mentions.users.first()) member = message.guild.members.cache.get(message.mentions.users.first().id);
            if (args[0] && message.guild.members.cache.get(args[0])) member = message.guild.members.cache.get(args[0]);

            if (!member) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔇 Mute Manager").setDescription("You have to mention a user or provide a user ID!"));
            if (message.author.id == member.id) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔇 Mute Manager").setDescription("You cannot mute yourself!"));
            if (client.ms(args[1])) {
                if (client.ms(args[1]) < 60000) return message.channel.send(client.createRedEmbed(true, usage).setTitle("🔇 Mute Manager").setDescription("You have to mute the user atleast 1m!"));
                return mute(true);
            } else {
                return mute(false);
            };
            async function mute(timeMute: Boolean) {
                let reason: string;
                if (timeMute) {
                    reason = args.slice(2).join(" ") || "No reason provided!";
                } else {
                    reason = args.slice(1).join(" ") || "No reason provided!";
                };
                return message.channel.send(client.createEmbed(true, usage).setTitle("🔇 Mute Manager")
                    .setDescription(`Do you really want to mute ${member} ${timeMute ? `for ${args[1]}` : "permanently"}?\n📝 **Reason:** ${reason}\n\nYou have 30s to react!`)).then(async msg => {
                        await msg.react(client.yesEmojiID);
                        await msg.react(client.noEmojiID);
                        const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                        YesOrNo.on('collect', async (reaction, user) => {
                            if (reaction.emoji.id == client.yesEmojiID) {
                                msg.reactions.cache.get(client.yesEmojiID).users.remove(message.author.id);
                                if (timeMute) {
                                    await member.roles.remove(memberRole);
                                    await member.roles.add(muteRole);
                                    setTimeout(() => {
                                        member.roles.remove(muteRole);
                                        member.roles.add(memberRole);
                                    }, client.ms(args[1]));
                                } else {
                                    await member.roles.remove(memberRole);
                                    await member.roles.add(muteRole);
                                };
                                await MemberSchema.findOneAndUpdate({
                                    guildID: msg.guild.id,
                                    memberID: member.id,
                                }, {
                                    $inc: {
                                        kickCount: 0,
                                        banCount: 0,
                                        muteCount: 1,
                                        warnCount: 0
                                    },
                                    isMuted: true
                                }, {
                                    upsert: true
                                });
                                member.send(client.createEmbed().setTitle("🔇 Mute Manager").setDescription(`🔇 You were muted ${timeMute ? `for ${args[1]}` : "permanently"} in **${message.guild.name}**!\n${client.memberEmoji} **Muted By:** ${message.author.id}\n📝 **Reason:** ${reason}!`));
                                return msg.channel.send(client.createGreenEmbed().setTitle("🔇 Mute Manager")
                                    .setDescription(`${member} was sucessfully muted ${timeMute ? `for ${args[1]}` : "permanently"}!\n📝 **Reason:** ${reason}`));
                            } else {
                                msg.reactions.cache.get(client.noEmojiID).users.remove(message.author.id);
                                return msg.channel.send(client.createRedEmbed().setTitle("🔇 Mute Manager").setDescription("Mute cancelled!"));
                            };
                        });
                        YesOrNo.on('end', collected => {
                            if (collected.size == 0) {
                                return msg.channel.send(client.createRedEmbed().setTitle("🔇 Mute Manager").setDescription("Mute cancelled!"));
                            };
                        });
                    }).catch(err => console.log(err));
            };
        });
    };
};