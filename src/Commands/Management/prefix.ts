import Command, { CommandRunner } from '@root/Command';
import Guild from '@models/guild';

export default class PrefixCommand extends Command {
    constructor(){
        super({
            name: "prefix",
            description: "prefix commands",
            category: "management",
            guildOnly: true,
            usage: "prefix <new prefix>",
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const settings = await client.cache.getGuild(message.guild.id);
        if (!args[0]) {
            return message.channel.send(client.createRedEmbed(true, `${prefix}prefix <new prefix>`)
                .setTitle(`${client.workingGearEmoji} Prefix Manager`)
                .setDescription(`You must specify a prefix to set for this server!\nYour current server prefix is \`${prefix}\`.`));
        };
        if (settings.prefix == args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}prefix <new prefix>`).setTitle(`${client.workingGearEmoji} Prefix Manager`).setDescription("This prefix is already the server prefix!"));
        return message.channel.send(client.createEmbed(true, `${prefix}prefix <new prefix>`).setTitle(`${client.workingGearEmoji} Prefix Manager`)
            .setDescription(`Do you really want to update the server prefix to \`${args.slice().join(" ")}\`?\n\nYou have 30s to react!`)).then(async msg => {
                await msg.react(client.yesEmojiID);
                await msg.react(client.noEmojiID);
                const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                YesOrNo.on('collect', async (reaction, user) => {
                    if (reaction.emoji.id == client.yesEmojiID) {
                        await Guild.findOneAndUpdate({
                            guildID: message.guild.id,
                        }, {
                            guildID: message.guild.id,
                            guildPrefix: args.slice().join(" "),
                            guildShardID: message.guild.shardID
                        }, {
                            upsert: false,
                        });
                        return message.channel.send(client
                            .createGreenEmbed()
                            .setTitle(`${client.workingGearEmoji} Prefix Manager`)
                            .setDescription(`Your server prefix has been updated to \`${args.slice().join(" ")}\`!`));
                    } else {
                        return msg.channel.send(client.createRedEmbed().setTitle(`${client.workingGearEmoji} Prefix Manager`).setDescription("Updating prefix cancelled!"));
                    };
                });
                YesOrNo.on('end', collected => {
                    if (collected.size == 0) {
                        return msg.channel.send(client.createRedEmbed().setTitle(`${client.workingGearEmoji} Prefix Manager`).setDescription("Updating prefix cancelled!"));
                    };
                });
            });
    };
};