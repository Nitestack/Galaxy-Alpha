import Command, { CommandRunner } from '@root/Command';
import { Message, NewsChannel, TextChannel } from 'discord.js';
import ReactionRolesSchema from '@models/reactionroles';
import GalaxyAlpha from '@root/Client';

export default class ReactionRolesCommand extends Command {
    constructor() {
        super({
            name: "reactionroles",
            description: "reaction role commands",
            category: "utility",
            aliases: ["rr"],
            userPermissions: ["MANAGE_CHANNELS"]
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
            "Now react with the emojis! You can use multiple emojis!\nType `done`, if you are ready!",
            "Now you have to mention the roles or provide role ID's! Make sure to trim each mention or ID with a space!\nYou have to order the role like the emojis order!"
        ];
        for (let i = 2; i < prompts.length; i++) {
            if (cancel) return;
            let messageEmoji: Message;
            if (i < 2 && i != 5) await message.channel.send(client.createRedEmbed().setTitle("Reaction Roles Manager").setDescription(prompts[i]));
            if (i > 1 && i != 5) await message.channel.send(client.createEmbed().setTitle("Reaction Roles Manager").setDescription(prompts[i]));
            if (i == 5){
                messageEmoji = await message.channel.send(client.createEmbed().setTitle("Reaction Roles Manager").setDescription(prompts[i]));
            };
            await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000 }).then(async messages => {
                if (messages.size == 0) {
                    cancel = true;
                    return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                        .setTitle("Reaction Roles Manager")
                        .setDescription("Reaction Roles settings cancelled!"));
                } else {
                    const { content } = messages.first();
                    if (messages.first().content.toLowerCase() == "cancel") {
                        cancel = true;
                        return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                            .setTitle("Reaction Roles Manager")
                            .setDescription("Reaction Roles settings cancelled!"));
                    };
                    if (i == 0) {
                        let channel: TextChannel | NewsChannel;
                        if (messages.first().mentions.channels.first() && message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "news").has(messages.first().mentions.channels.first().id)) {
                            responses.channelID = message.mentions.channels.first().id;
                            i = 2;
                        } else i = -1;
                    } else if (i == 1) {
                        const roles = messages.first().content.trim().split(/ +/g);
                        roles.forEach(role => {
                            if (message.guild.roles.cache.has(role)) {
                                responses.roleIDs.push(role);
                            };
                        });
                        if (messages.first().mentions.roles.first()){
                            messages.first().mentions.roles.forEach(role => {
                                if (message.guild.roles.cache.has(role.id) && !responses.roleIDs.includes(role.id)) responses.roleIDs.push(role.id);
                            });
                        };
                        if (responses.roleIDs.length == 0) {
                            i = 0;
                        } else i = 6;
                    } else if (i == 2) {
                        let channel: TextChannel | NewsChannel;
                        if (messages.first().mentions.channels.first() && message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "news").has(messages.first().mentions.channels.first().id)) responses.channelID = messages.first().mentions.channels.first().id;
                        else i = -1;
                    } else if (i == 3) {
                        responses.title = content;
                    } else if (i == 4) {
                        responses.description = content;
                    } else if (i == 5) {
                        const EmojiCollector = await messageEmoji.createReactionCollector((reaction, user) => user.id == message.author.id, { time: 30000 });
                        if (content.toLowerCase() == "done") EmojiCollector.stop();
                        else cancel = true;
                        EmojiCollector.on("end", (collected, reason) => {
                            if (collected.size == 0) {
                                cancel = true;
                                return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("Reaction Roles Manager").setDescription("Reaction Roles settings cancelled!"));
                            } else {
                                console.log(collected);
                                collected.forEach(reaction => reaction.emoji.createdAt ? responses.emojiIDs.push(reaction.emoji.id) : responses.emojiIDs.push(reaction.emoji.name));
                            };
                        });
                    } else if (i == 6) {
                        const roles = messages.first().content.trim().split(/ +/g);
                        roles.forEach(role => {
                            if (message.guild.roles.cache.has(role)) {
                                responses.roleIDs.push(role);
                            };
                        });
                        if (messages.first().mentions.roles.first()){
                            messages.first().mentions.roles.forEach(role => {
                                if (message.guild.roles.cache.has(role.id) && !responses.roleIDs.includes(role.id)) responses.roleIDs.push(role.id);
                            });
                        };
                        if (responses.roleIDs.length == 0) {
                            i = 0;
                        };
                    };
                };
            });
        };
        if (cancel) return;
        (message.guild.channels.cache.get(responses.channelID) as TextChannel | NewsChannel).send(client.createEmbed()
            .setTitle(responses.title)
            .setDescription(responses.description)
            .addField("How to get the roles?", "Simply react with the emojis below to gain specific roles!")).then(msg => {
                responses.messageID = msg.id
                responses.emojiIDs.forEach(async emojiID => await msg.react(emojiID));
            });

        await ReactionRolesSchema.findOneAndUpdate({
            messageID: responses.messageID
        }, {
            channelID: responses.channelID,
            title: responses.title,
            description: responses.description,
            emojiIDs: responses.emojiIDs,
            roleIDs: responses.roleIDs
        }, {
            upsert: true
        });

        client.on("messageReactionAdd", async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if (reaction.message.id == responses.messageID){
                if (reaction.emoji.createdAt){
                    message.guild.members.cache.get(user.id).roles.add(responses.roleIDs[responses.emojiIDs.indexOf(reaction.emoji.id)]);
                } else {
                    message.guild.members.cache.get(user.id).roles.add(responses.roleIDs[responses.emojiIDs.indexOf(reaction.emoji.name)]);
                };
            };
        });
        client.on("messageReactionRemove", async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if (reaction.message.id == responses.messageID){
                if (reaction.emoji.createdAt){
                    message.guild.members.cache.get(user.id).roles.remove(responses.roleIDs[responses.emojiIDs.indexOf(reaction.emoji.id)]);
                } else {
                    message.guild.members.cache.get(user.id).roles.remove(responses.roleIDs[responses.emojiIDs.indexOf(reaction.emoji.name)]);
                };
            };
        });
    };
};