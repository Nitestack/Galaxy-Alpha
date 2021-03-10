import Command, { CommandRunner } from '@root/Command';

export default class JoinMessageCommand extends Command {
    constructor() {
        super({
            name: "joinmessage",
            description: "join message commands",
            category: "management",
            usage: "joinmessage set <#channel/channel ID/dm> [embed] <text> or joinmessage remove",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const welcomeManager: string = '🤗 Welcome Manager';
        const setUsage = `${prefix}joinmessage set <#channel/channel ID/dm> [embed] <text>`;
        const removeUsage = `${prefix}joinmessage remove`;
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (args[0]?.toLowerCase() == 'set') {
            let welcomeChannelID: string;
            if (message.mentions.channels.first() && message.guild.channels.cache.has(message.mentions.channels.first().id)) welcomeChannelID = message.mentions.channels.first().id;
            if (args[1] && message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(args[1])) welcomeChannelID = message.guild.channels.cache.get(args[0]).id;
            if (args[1]?.toLowerCase() == "dm") welcomeChannelID = "dm";
            if (!welcomeChannelID) return client.createArgumentError(message, { title: welcomeManager, description: "You have to mention a channel, provide a channel id or just write \"dm\" to let the message sent to the users dm!" }, this.usage);
            if (args[2]?.toLowerCase() == 'embed') {
                if (!args[3]) return client.createArgumentError(message, { title: welcomeManager, description: "You have to provide a welcome message!" }, this.usage);
                const msg = await message.channel.send(client.createEmbed()
                    .setTitle(welcomeManager)
                    .setDescription(`Do you really want to set the new welcome message to:\n\`${args.slice(3).join(" ")}\`?\n\nYou have 30s to react!`));
                await msg.react(client.yesEmojiID);
                await msg.react(client.noEmojiID);
                const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
                YesOrNo.on("collect", async (reaction, user) => {
                    if (reaction.emoji.id == client.yesEmojiID){
                        await client.cache.updateGuild(message.guild.id, {
                            welcomeMessageType: "embed",
                            welcomeChannelID: welcomeChannelID,
                            welcomeMessage: args.slice(3).join(" ")
                        });
                        return client.createSuccess(message, { title: welcomeManager, description: `Set the welcome message to: \`${args.slice(3).join(" ")}\``});
                    } else return client.createArgumentError(message, { title: welcomeManager, description: "Setting welcome message cancelled!" }, this.usage);
                });
                YesOrNo.on("end", (collected, reason) => {
                    if (collected.size == 0) return client.createArgumentError(message, { title: welcomeManager, description: "Setting welcome message cancelled!" }, this.usage);
                });
            } else {
                if (!args[2]) return client.createArgumentError(message, { title: welcomeManager, description: "You have to provide a welcome message!" }, this.usage);
                const msg = await message.channel.send(client.createEmbed()
                    .setTitle(welcomeManager)
                    .setDescription(`Do you really want to set the new welcome message to:\n\`${args.slice(2).join(" ")}\`?\n\nYou have 30s to react!`));
                await msg.react(client.yesEmojiID);
                await msg.react(client.noEmojiID);
                const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
                YesOrNo.on("collect", async (reaction, user) => {
                    if (reaction.emoji.id == client.yesEmojiID) {
                        await client.cache.updateGuild(message.guild.id, {
                            welcomeMessageType: "message",
                            welcomeChannelID: welcomeChannelID,
                            welcomeMessage: args.slice(2).join(" ")
                        });
                        return client.createSuccess(message, { title: welcomeManager, description: `Set the welcome message to: \`${args.slice(2).join(" ")}\``});
                    } else return client.createArgumentError(message, { title: welcomeManager, description: "Setting welcome message cancelled!" }, this.usage);
                });
                YesOrNo.on("end", (collected, reason) => {
                    if (collected.size == 0) return client.createArgumentError(message, { title: welcomeManager, description: "Setting welcome message cancelled!" }, this.usage);
                });
            };
        } else if (args[0].toLowerCase() == 'remove') {
            if (!guildSettings.welcomeMessage) return client.createArgumentError(message, { title: welcomeManager, description: "There is no welcome message to remove!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(welcomeManager)
                .setDescription(`Do you really want to set the new welcome message to:\n\`${args.slice(1).join(" ")}\`?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    await client.cache.updateGuild(message.guild.id, {
                        welcomeMessage: null,
                        welcomeMessageType: "message",
                        welcomeChannelID: null
                    });
                    return client.createSuccess(message, { title: welcomeManager, description: `Removed the current welcome message!` });
                } else return client.createArgumentError(message, { title: welcomeManager, description: "Removing welcome message cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: welcomeManager, description: "Removing welcome message cancelled!" }, this.usage);
            });
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