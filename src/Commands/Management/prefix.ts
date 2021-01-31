import Command from '@root/Command';
import Guild from '@models/guild';

module.exports = class PrefixCommand extends Command {
    constructor(client){
        super(client, {
            name: "prefix",
            description: "prefix commands",
            category: "management",
            guildOnly: true,
            usage: "prefix <new prefix>"
        });
    };
    async run(client, message, args, prefix) {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}prefix <new prefix>`)
            .setTitle("🎉 Giveaway Role Manager")
            .setDescription("You need the permission `Manage Server` to use this command!"));
        const settings = await Guild.findOne({
            guildID: message.guild.id,
        });
        if (!args[0]) {
            return message.channel.send(client.createRedEmbed(true, `${prefix}prefix <new prefix>`)
                .setTitle(`${client.workingGearEmoji} Prefix Manager`)
                .setDescription(`You must specify a prefix to set for this server!\nYour current server prefix is \`${settings.guildPrefix}\`.`));
        };
        if (settings.guildPrefix == args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}prefix <new prefix>`).setTitle(`${client.workingGearEmoji} Prefix Manager`).setDescription("This prefix is already the server prefix!"));
        return message.channel.send(client.createEmbed(true, `${prefix}prefix <new prefix>`).setTitle(`${client.workingGearEmoji} Prefix Manager`)
            .setDescription(`Do you really want to update the server prefix to \`${args.slice().join(" ")}\`?\n\nYou have 30s to react!`)).then(async msg => {
                await msg.react(client.yesEmojiID);
                await msg.react(client.noEmojiID);
                const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                YesOrNo.on('collect', async (reaction, user) => {
                    if (reaction.emoji.id == client.yesEmojiID) {
                        msg.reactions.cache.get(client.yesEmojiID).users.remove(message.author.id);
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
                        msg.reactions.cache.get(client.noEmojiID).users.remove(message.author.id);
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