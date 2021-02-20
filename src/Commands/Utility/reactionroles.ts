import Command, { CommandRunner } from '@root/Command';
import { Message, NewsChannel, TextChannel } from 'discord.js';

export default class ReactionRolesCommand extends Command {
    constructor() {
        super({
            name: "reactionroles",
            description: "reaction role commands",
            category: "utility",
            aliases: ["rr"],
            userPermissions: ["MANAGE_CHANNELS"],
            clientPermissions: ["MANAGE_ROLES"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let cancel: boolean = false;
        let responses: {
            messageID: string,
            channelID: string,
            title: string,
            description: string,
            emojiIDs: Array<string>;
            roleIDs: Array<string>;
        } = {
            messageID: "",
            channelID: "",
            title: "",
            description: "",
            emojiIDs: [],
            roleIDs: []
        };
        const prompts: Array<string> = [
            "You have to mention a valid channel/channel ID!",
            "You have to mention valid roles or provide valid role ID's!",
            "Please mention the channel, where the reaction role should be in! You can also provide a channel ID instead of a mention!",
            "Now what is the title of the react table?",
            "What is the description of the react table?",
            "Now you have to mention the roles or provide role ID's! Make sure to trim each mention or ID with a space!\nKeep in mind that my role has to be over all reaction roles!",
            "5. PROMPT"
        ];
        for (let i = 2; i < prompts.length; i++) {
            if (cancel) return;
            let messageEmoji: Message = null;
            if (i < 2 && i != 6) await message.channel.send(client.createRedEmbed().setTitle("Reaction Roles Manager").setDescription(prompts[i] + "\n\n**How to cancel?**\nSimply type `cancel` to cancel the entire process!"));
            if (i > 1 && i != 6) await message.channel.send(client.createEmbed().setTitle("Reaction Roles Manager").setDescription(prompts[i] + "\n\n**How to cancel?**\nSimply type `cancel` to cancel the entire process!"));
            if (i == 6) messageEmoji = await message.channel.send(client.createEmbed().setTitle("Reaction Roles Manager").setDescription(`Now react with the emojis! The emojis must be in the same order as this roles:\n <@&${responses.roleIDs.join(">\n<@&")}>\n\nType \`done\`, if you are ready!` + "\n\n**How to cancel?**\nSimply type `cancel` to cancel the entire process!"));
            await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000 }).then(async messages => {
                if (messages.size == 0) {
                    cancel = true;
                    return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                        .setTitle("Reaction Roles Manager")
                        .setDescription("Reaction Roles settings cancelled!"));
                } else {
                    const { content } = messages.first();
                    if (content.toLowerCase() == "cancel") {
                        cancel = true;
                        return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                            .setTitle("Reaction Roles Manager")
                            .setDescription("Reaction Roles settings cancelled!"));
                    };
                    if (i == 0) {
                        if (messages.first().mentions.channels.first() && message.guild.channels.cache.has(messages.first().mentions.channels.first().id)) {
                            responses.channelID = messages.first().mentions.channels.first().id;
                            i = 2;
                        } else if (content && message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(content)) {
                            responses.channelID = content;
                            i = 2;
                        } else i = -1;
                    } else if (i == 1) {
                        const roles = content.trim().split(/ +/g);
                        roles.forEach(role => {
                            if (message.guild.roles.cache.has(role)) {
                                responses.roleIDs.push(role);
                            };
                        });
                        if (messages.first().mentions.roles.first()) {
                            messages.first().mentions.roles.forEach(role => {
                                if (message.guild.roles.cache.has(role.id) && !responses.roleIDs.includes(role.id)) responses.roleIDs.push(role.id);
                            });
                        };
                        if (responses.roleIDs.length == 0) {
                            i = 0;
                        } else i = 5;
                    } else if (i == 2) {
                        if (messages.first().mentions.channels.first() && message.guild.channels.cache.has(messages.first().mentions.channels.first().id)) responses.channelID = messages.first().mentions.channels.first().id;
                        else if (content && message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "news").has(content)) responses.channelID = content;
                        else i = -1;
                    } else if (i == 3) {
                        responses.title = content;
                    } else if (i == 4) {
                        responses.description = content;
                    } else if (i == 5) {
                        const roles = content.trim().split(/\s+/g);
                        roles.forEach(role => {
                            if (message.guild.roles.cache.has(role)) {
                                responses.roleIDs.push(role);
                            };
                        });
                        if (messages.first().mentions.roles.first()) {
                            messages.first().mentions.roles.forEach(role => {
                                if (message.guild.roles.cache.has(role.id) && !responses.roleIDs.includes(role.id)) responses.roleIDs.push(role.id);
                            });
                        };
                        if (responses.roleIDs.length == 0) {
                            i = 0;
                        };
                    } else if (i == 6) {
                        if (content.toLowerCase() == "done") {
                            if (messageEmoji.reactions.cache.size !=  responses.roleIDs.length) i = 5;
                            messageEmoji.reactions.cache.forEach(reaction => responses.emojiIDs.push(reaction.emoji.createdTimestamp ? reaction.emoji.id : reaction.emoji.name.toString()));
                        } else i = 5;
                    };
                };
            });
        };
        if (cancel) return;
        const msg = await (message.guild.channels.cache.get(responses.channelID) as TextChannel | NewsChannel).send(client.createEmbed()
            .setTitle(responses.title)
            .setDescription(responses.description));
        responses.messageID = msg.id
        responses.emojiIDs.forEach(async emojiID => await msg.react(emojiID));
        const serverSettings = await client.cache.getGuild(message.guild.id);
        const reactionRoles = serverSettings.reactionRoles || [];
        for (let i = 0; i < responses.roleIDs.length; i++) {
            reactionRoles.push({
                roleID: responses.roleIDs[i],
                emojiID: responses.emojiIDs[i],
                channelID: responses.channelID,
                messageID: responses.messageID
            });
        };
        client.cache.guilds.set(message.guild.id, {
            ...serverSettings,
            reactionRoles: reactionRoles
        });
    };
};