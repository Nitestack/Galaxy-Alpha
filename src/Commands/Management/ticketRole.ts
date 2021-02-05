import Command, { CommandRunner } from '@root/Command';
import Guild from '@models/guild';
import { Role } from 'discord.js';

export default class TicketRoleCommand extends Command {
    constructor(){
        super({
            name: "ticketrole",
            description: "ticket role commands",
            usage: "ticketrole set <@Role/Role ID> or ticketrole remove",
            category: "management",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const setUsage = `${prefix}ticketrole set <@Role/Role ID>`;
        const deleteUsage = `${prefix}ticketrole remove`;
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
            if (!role) return message.channel.send(client.createRedEmbed(true, setUsage).setTitle(`🎫 Ticket Role Manager`).setDescription("You have to mention a role or provide a role ID!"));
            if (role.id == GuildSchema.ticketRole) return message.channel.send(client.createRedEmbed(true, setUsage).setTitle(`🎫 Ticket Role Manager`).setDescription("The role is already the ticket role!"));
            const check = message.guild.roles.cache.get(role.id);
            if (check) {
                return message.channel.send(client.createEmbed(true, setUsage).setTitle(`🎫 Ticket Role Manager`)
                    .setDescription(`Do you really want to update the ticket role to ${role}?`)).then(async msg => {
                        await msg.react(client.yesEmojiID);
                        await msg.react(client.noEmojiID);
                        const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                        YesOrNo.on('collect', async (reaction, user) => {
                            if (reaction.emoji.id == client.yesEmojiID) {
                                msg.reactions.cache.get(client.yesEmojiID).users.remove(message.author.id);
                                await Guild.findOneAndUpdate({
                                    guildID: message.guild.id,
                                }, {
                                    ticketRole: role.id,
                                }, {
                                    upsert: false,
                                }).catch(err => console.log(err));
                                return message.channel.send(client.createGreenEmbed().setTitle(`🎫 Ticket Role Manager`).setDescription(`Sucessfully updated the ticket role to ${role}!`));
                            } else {
                                msg.reactions.cache.get(client.noEmojiID).users.remove(message.author.id);
                                return msg.channel.send(client.createRedEmbed().setTitle(`🎫 Ticket Role Manager`).setDescription("Updating ticket role cancelled!"));
                            };
                        });
                        YesOrNo.on('end', collected => {
                            if (collected.size == 0) {
                                return msg.channel.send(client.createRedEmbed().setTitle(`🎫 Ticket Role Manager`).setDescription("Updating ticket role cancelled!"));
                            };
                        });
                    }).catch(err => console.log(err));
            } else {
                return message.channel.send(client.createRedEmbed(true, setUsage).setTitle(`🎫 Ticket Role Manager`).setDescription(`Cannot find the role \`${args[1]}\`!`));
            };
        } else if (args[0].toLowerCase() == 'remove') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, deleteUsage)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
            await Guild.findOneAndUpdate({
                guildID: message.guild.id,
            }, {
                ticketRole: null,
            }, {
                upsert: false,
            }).catch((err) => console.log(err));
            return message.channel.send(client.createGreenEmbed().setTitle(`🎫 Ticket Role Manager`).setDescription('Removed the current ticket role!\nNow you have to set a new Ticket Role!'));
        } else {
            const embed = client.createEmbed()
                .setTitle(`🎫 Ticket Role Manager`)
                .addField('Set a role as the ticket role', `\`${setUsage}\``)
                .addField('Remove a ticket role', `\`${deleteUsage}\``);
            return message.channel.send(embed);
        };
    };
};