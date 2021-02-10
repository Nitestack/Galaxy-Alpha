import Command, { CommandRunner } from '@root/Command';
import GuildSchema from '@models/guild';

export default class JoinMessageCommand extends Command {
    constructor(){
        super({
            name: "joinmessage",
            description: "join message commands",
            category: "management",
            usage: "joinmessage set [embed] <text> or joinmessage remove",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const welcomeManager: string = '🤗 Welcome Manager';
        const setUsage = `${prefix}joinmessage set [embed] <text>`;
        const removeUsage = `${prefix}joinmessage remove`;
        if (args[0].toLowerCase() == 'set') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, setUsage)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
            if (args[1] == 'embed') {
                if (args[2]) {
                    const welcomeMessage: string = args.slice(2).join(" ");
                    return message.channel.send(client.createEmbed()
                        .setTitle(welcomeManager)
                        .setDescription(`**Do you really want to update your embed welcome message to:**\n\n${welcomeMessage}\n\nYou have 30s to react!`)).then(async msg => {
                            await msg.react(client.yesEmojiID);
                            await msg.react(client.noEmojiID);
                            const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                            YesOrNo.on('collect', async (reaction, user) => {
                                if (reaction.emoji.id == client.yesEmojiID) {
                                    await GuildSchema.findOneAndUpdate({
                                        guildID: message.guild.id
                                    }, {
                                        welcomeMessage: welcomeMessage,
                                        welcomeEmbed: true
                                    }, {
                                        upsert: false
                                    }).catch(err => console.log(err));
                                    return msg.channel.send(client.createGreenEmbed()
                                        .setTitle(welcomeManager)
                                        .setDescription("Successfully updated the join messages!"));
                                } else {
                                    return msg.channel.send(client.createRedEmbed().setTitle(welcomeManager).setDescription("Updating join message cancelled!"));
                                };
                            });
                            YesOrNo.on('end', collected => {
                                if (collected.size == 0) {
                                    return msg.channel.send(client.createRedEmbed().setTitle(welcomeManager).setDescription("Updating join message cancelled!"));
                                };
                            });
                        });
                } else {
                    return message.channel.send(client.createRedEmbed(true, setUsage)
                        .setTitle(welcomeManager)
                        .setDescription("You have to provide a welcome message for the embed message!"));
                };
            } else if (args[1] && args[1] != 'embed') {
                const welcomeMessage: string = args.slice(1).join(" ");
                if (args[1]) {
                    return message.channel.send(client.createEmbed()
                        .setTitle(welcomeManager)
                        .setDescription(`**Do you really want to update your welcome message to:**\n\n${welcomeMessage}\n\nYou have 30s to react!`)).then(async msg => {
                            await msg.react(client.yesEmojiID);
                            await msg.react(client.noEmojiID);
                            const YesOrNo = msg.createReactionCollector((reaction, user) => (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID) && user.id == message.author.id, { time: 30000, max: 1 });
                            YesOrNo.on('collect', async (reaction, user) => {
                                if (reaction.emoji.id == client.yesEmojiID) {
                                    await GuildSchema.findOneAndUpdate({
                                        guildID: message.guild.id
                                    }, {
                                        welcomeMessage: welcomeMessage,
                                        welcomeEmbed: false
                                    }, {
                                        upsert: false
                                    });
                                    return msg.channel.send(client.createGreenEmbed()
                                        .setTitle(welcomeManager)
                                        .setDescription("Successfully updated the join messages!"));
                                } else {
                                    return msg.channel.send(client.createRedEmbed().setTitle(welcomeManager).setDescription("Updating join message cancelled!"));
                                };
                            });
                            YesOrNo.on('end', collected => {
                                if (collected.size == 0) {
                                    return msg.channel.send(client.createRedEmbed().setTitle(welcomeManager).setDescription("Updating join message cancelled!"));
                                };
                            });
                        });
                }
            } else {
                return message.channel.send(client.createRedEmbed(true, setUsage))
            };
        } else if (args[0].toLowerCase() == 'remove') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, removeUsage)
                .setTitle("🎉 Giveaway Role Manager")
                .setDescription("You need the permission `Manage Server` to use this command!"));
            await GuildSchema.findOneAndUpdate({
                guildID: message.guild.id
            }, {
                welcomeMessage: null,
                welcomeEmbed: false
            }, {
                upsert: false
            });
            return message.channel.send(client.createGreenEmbed()
                .setTitle(welcomeManager)
                .setDescription("Your welcome message was successfully removed!"));
        } else {
            return message.channel.send(client.createEmbed()
                .setTitle(welcomeManager)
                .addField("Setup a welcome message", `\`${setUsage}\`\n
            Welcome Message Variables:
            {user:mention} - Mentions the user
            {user:username} - The name of the user
            {user:discriminator} - The discriminator of the user (the numbers after the hashtag of your user)
            {user:avatar} - A link to the user's avatar
            {user:createdAt} - When the user was created
            {user:createdAgo} - When the user was created as timestamp
            {user:joinedAt} - When the user joined the server
            {user:joinedAgo} - When the user joined the server as timestamp
            {server:name} - The name of the server, where the user joined
            {server:members} - The amount of members in the server
            {server:user} - The amount of users in the server
            {server:createdAt} - When the server was created
            {server:createdAgo} - When the server was created as timestamp   
            other variables are coming soon and please use lower case letters!`)
                .addField("Remove a welcome message", `\`${removeUsage}\``));
        };
    };
};