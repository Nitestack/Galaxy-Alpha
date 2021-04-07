import Command, { CommandRunner } from '@root/Command';
import { Message, NewsChannel, ReactionCollector, TextChannel } from 'discord.js';

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
        client.util.prompts("🎭 Reaction Roles Setup", [{
            title: "#1 Reaction Roles Channel",
            description: "Please mention a channel or provide a channel ID! Type `create` to let me create one!",
            errorText: "Invalid channel or channel ID!",
            checkFunction: async (i, msg) => {
                let channel: TextChannel | NewsChannel;
                if (msg.content.toLowerCase() == "create") channel = await message.guild.channels.create("reaction-roles", {
                    type: "text"
                });
                else {
                    if (msg.mentions.channels.first() && message.guild.channels.cache.has(msg.mentions.channels.first().id)) channel = msg.mentions.channels.first();
                    else if (message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "news").has(msg.content)) channel = message.guild.channels.cache.get(msg.content) as TextChannel | NewsChannel;
                };
                if (channel) {
                    responses.channelID = channel.id;
                    return true;
                } else return false;
            }
        }, {
            title: "#2.1 Reaction Roles Table - Title",
            description: "Please provide a title for the reaction roles table! Type `create` to let me generate a title!",
            errorText: "Unknown error occurred!",
            checkFunction: (i, msg) => {
                responses.title = msg.content.toLowerCase() == "create" ? "Reaction Roles" : msg.content;
                return true;
            }
        }, {
            title: "#2.2 Reaction Roles Table - Description",
            description: "Please provide a description for the table! Type `create` to let me auto-generate a useful description!",
            errorText: "Unknown error occurred!",
            checkFunction: (i, msg) => {
                responses.description = msg.content.toLowerCase() == "create" ? "auto-generate" : msg.content;
                return true;
            }
        }, {
            title: "#3 Reaction Roles Roles",
            description: "Please mention role(s) or provide role ID(s)! Trim each role (or role ID) with a space!",
            errorText: "No role or role ID mentioned!",
            checkFunction: (i, msg) => {
                for (const roleID of msg.content.trim().split(/ +/g)) {
                    if (message.guild.roles.cache.has(roleID)) responses.roleIDs.push(roleID);
                    else if (message.guild.roles.cache.has(roleID.split("<@&")[1].split(">")[0])) responses.roleIDs.push(roleID.split("<@&")[1].split(">")[0]);
                };
                if (responses.roleIDs.length > 0) return true;
                else return false;
            }
        }, {
            title: "#4 Reaction Roles Emojis",
            description: `Please react with the emojis! The emojis must be in the same order like the roles, you provided before!`,
            errorText: "No reactions or too many reactions!",
            beforeExecutionFunction: (i, reactionMessage) => {
                return reactionMessage.createReactionCollector((reaction, user) => user.id == message.author.id, { time: 60000 }).on("end", (collected, reason) => {
                    if (collected.size != 0) for (const reaction of collected.values()) responses.emojiIDs.push(reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name);
                });
            },
            checkFunction: async (i, msg, reactionMessage, collector: ReactionCollector) => {
                if (msg.content.toLowerCase() == "done") {
                    let bool: boolean = false;
                    collector.stop();
                    if (responses.emojiIDs.length > 0 && responses.emojiIDs.length == responses.roleIDs.length) bool = true;
                    return bool;
                } else {
                    collector.stop();
                    return false
                };
            }
        }], message.channel, (m) => m.author.id == message.author.id, {
            description: "Cancelled reaction roles setup!",
            commandUsage: this.usage
        }, async () => {
            if (responses.description.toLowerCase() == "auto-generate") {
                let text: string = "";
                for (let i = 0; i < responses.roleIDs.length; i++) text += `${responses.emojiIDs[i]} > <@&${responses.roleIDs[i]}>\n`;
                responses.description = text;
            };
            const msg = await (message.guild.channels.cache.get(responses.channelID) as TextChannel | NewsChannel).send(client.createEmbed()
                .setTitle(responses.title)
                .setDescription(responses.description));
            responses.messageID = msg.id;
            for (const emojiID of responses.emojiIDs) await msg.react(emojiID);
            const serverSettings = await client.cache.getGuild(message.guild.id);
            const reactionRoles = serverSettings.reactionRoles || [];
            for (let i = 0; i < responses.roleIDs.length; i++) reactionRoles.push({
                roleID: responses.roleIDs[i],
                emojiID: responses.emojiIDs[i],
                messageID: responses.messageID
            });
            await client.cache.updateGuild(message.guild.id, {
                reactionRoles: reactionRoles
            });
            return client.createSuccess(message, { title: "🎭 Reaction Roles Setup", description: "Completed reaction roles setup!" });
        }, true);
    };
};