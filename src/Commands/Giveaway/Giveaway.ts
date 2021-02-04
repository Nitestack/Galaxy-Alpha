import GalaxyAlpha from '@root/Client';
import { Guild, Message, MessageEmbed, NewsChannel, Role, TextChannel, User } from 'discord.js';
import giveawaySchema, { GiveawaySchema } from '@models/Giveaways/giveaways';
import GuildSchema from '@models/guild';
import MessageSchema from '@models/messageCount';
import Level from '@models/levels';

export const giveawayManager: string = "🎉 Giveaway Manager";

export default class Giveaway {
    private client: GalaxyAlpha;
    constructor(client){
        this.client = client;
    };
    public async start(options: { duration: number, channelID: string, guildID: string, prize: string, winners: number, hostedBy: User }, message: Message, requirements: { roles: Array<string>, messages: number, invites: number, level: number, guildReq: string }) {
        let blackListedRole: Role;
        let byPassRole: Role;
        await GuildSchema.findOne({
            guildID: options.guildID
        }, {}, {}, (err, guild) => {
            if (err) return console.log(err);
            if (!guild) return message.channel.send("An error occurred while you used the command, please try again!");
            if (guild.giveawayBlackListed && this.client.guilds.cache.get(options.guildID).roles.cache.has(guild.giveawayBlackListed)) blackListedRole = this.client.guilds.cache.get(options.guildID).roles.cache.get(guild.giveawayBlackListed);
            if (guild.giveawayByPass) byPassRole = this.client.guilds.cache.get(options.guildID).roles.cache.get(guild.giveawayByPass);
        });
        const channel: TextChannel | NewsChannel = (this.client.guilds.cache.get(options.guildID).channels.cache.filter(channel => channel.type == 'text' || channel.type == 'news').get(options.channelID) as TextChannel | NewsChannel);
        const giveawayEmbed: MessageEmbed = this.client.createEmbed()
            .setTitle(options.prize)
            .setDescription(`${this.client.arrowEmoji} **React with 🎉 to enter!**\n**🏅 ${options.winners == 1 ? "Winner" : "Winners"}**: ${options.winners}\n${this.client.memberEmoji} **Hosted By**: ${options.hostedBy}\n`)
            .setTimestamp(new Date(Date.now() + options.duration))
            .setFooter(`Ends at`, this.client.user.displayAvatarURL());

        let text: string = '';
        if (requirements.messages != 0) text += `${this.client.chatEmoji} You need to have \`${requirements.messages}\` messages!\n`;
        if (requirements.invites != 0) text += `📨 You need to have \`${requirements.invites}\` invites!\n`;
        if (requirements.level != 0) text += `🎚️ You need to be Level \`${requirements.level}\`!\n`;
        if (requirements.roles.length > 0) text += `🎭 You need to have ${requirements.roles.length == 1 ? "the role" : "one of the follwing roles"} ${requirements.roles.length == 1 ? `<@&${requirements.roles}>` : `: <@&${requirements.roles.join("> | <@&")}>`}!\n`;
        if (requirements.guildReq != 'none') text += `${this.client.protectedEmoji} You should be in **[${(await this.client.fetchInvite(requirements.guildReq)).guild.name}](${requirements.guildReq})**!\n`;
        if (requirements.messages != 0 || requirements.invites != 0 || requirements.level != 0 || requirements.roles.length > 0 || requirements.guildReq != 'none') giveawayEmbed.addField(`${this.client.warningInfoEmoji} Requirements:`, text);

        giveawayEmbed.addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`);

        await channel.send(`${this.client.galaxyAlphaEmoji}   **GIVEAWAY**   ${this.client.galaxyAlphaEmoji}`, giveawayEmbed).then(async msg => {
            await msg.react("🎉");
            const Reactions = msg.createReactionCollector((reaction, user) => reaction.emoji.name == '🎉', { time: options.duration });
            const giveawayPing = await GuildSchema.findOne({
                guildID: msg.guild.id
            }, {}, {}, (err, guild) => {
                if (err) return console.log(err);
                if (!guild) return false;
                if (guild.giveawayPing) return true;
            });
            msg.channel.send(`${options.hostedBy} ${giveawayPing ? `<@&${giveawayPing.giveawayPing}>` : ''}`).then(async messagePing => {
                messagePing.delete({ timeout: 1 });
                message.channel.send(this.client.createGreenEmbed()
                    .setTitle(giveawayManager)
                    .setDescription(`Successfully created a giveaway with the prize \`${options.prize}\` in ${channel}!`));
                Reactions.on('collect', async (reaction, user) => {
                    if (user.bot) msg.reactions.cache.get("🎉").users.remove(user.id);
                    const member = message.guild.members.cache.get(user.id);
                    let userMessages: number;
                    if (requirements.messages != 0) {
                        await MessageSchema.findOne({
                            messageGuildID: options.guildID,
                            messageUserID: member.id
                        }, {}, {}, (err, user) => {
                            if (err) return console.log(err);
                            if (!user) userMessages = 0;
                            if (user.messageCount) userMessages = user.messageCount;
                        });
                    };
                    let userLevel: number;
                    if (requirements.level != 0) {
                        await Level.findOne({
                            guildID: options.guildID,
                            userID: member.id
                        }, {}, {}, (err, user) => {
                            if (err) return console.log(err);
                            if (!user) userLevel = 0;
                            if (user.level) userLevel = user.level;
                        });
                    };
                    let serverReq: Guild;
                    if (requirements.guildReq != 'none') {
                        this.client.fetchInvite(requirements.guildReq).then(invite => {
                            serverReq = invite.guild;
                        });
                    };
                    let memberRolesHas: number = 0;
                    if (requirements.roles.length != 0) {
                        for (const role of requirements.roles) {
                            const roles = member.roles.cache.map(role => `${role.id}`);
                            if (roles.includes(requirements.roles[role])) memberRolesHas++;
                        };
                    };
                    if (byPassRole && member.roles.cache.has(byPassRole.id)) {
                        member.send(this.client.createGreenEmbed()
                            .setTitle(giveawayManager)
                            .setDescription(`Your giveaway entry has been confirmed!
                            **[${options.prize}](${msg.url})** in ${channel} of **${msg.guild.name}**
                            By reacting to any giveaways, which are created by ${this.client.user}, you agree to be DMed by the bot,
                            whether you joined a giveaway or you won a giveaway!`)
                            .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`));
                    } else {
                        if (blackListedRole && member.roles.cache.has(blackListedRole.id) && member.id != message.author.id) {
                            msg.reactions.cache.get("🎉").users.remove(user.id);
                            member.send(this.client.createRedEmbed()
                                .setTitle(giveawayManager)
                                .setDescription(`Your giveaway entry has been denied!
                                Your are blacklisted from joining any giveaways, which were created by ${this.client.user}, in **${msg.guild.name}**!`)
                                .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`));
                        } else if (requirements.roles.length != 0 && memberRolesHas == 0) {
                            msg.reactions.cache.get("🎉").users.remove(user.id);
                            member.send(this.client.createRedEmbed()
                                .setTitle(giveawayManager)
                                .setDescription(`Your giveaway entry has beem denied!
                                You need one of the required roles to enter this giveaway!`)
                                .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`));
                        } else if (requirements.messages != 0 && requirements.messages > userMessages && requirements.messages != 0) {
                            msg.reactions.cache.get("🎉").users.remove(user.id);
                            member.send(this.client.createRedEmbed()
                                .setTitle(giveawayManager)
                                .setDescription(`Your giveaway entry has been denied!
                                You need to send \`${requirements.messages - userMessages}\` messagse in **${msg.guild.name}** to enter this giveaway!`)
                                .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`));
                        } else if (requirements.level != 0 && requirements.level > userLevel && requirements.level != 0) {
                            msg.reactions.cache.get("🎉").users.remove(user.id);
                            member.send(this.client.createRedEmbed()
                                .setTitle(giveawayManager)
                                .setDescription(`Your giveaway entry has been denied!
                                You need to be Level \`${requirements.level}\` in **${msg.guild.name}** to enter this giveaway!
                                You are currently Level \`${userLevel}\`!`)
                                .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`));
                        } else if (requirements.invites != 0 && requirements.invites != 0) {
                            member.send(this.client.createGreenEmbed()
                                .setTitle(giveawayManager)
                                .setDescription(`Your giveaway entry has been confirmed!
                                **[${options.prize}](${msg.url})** in ${channel} of **${msg.guild.name}**
                                By reacting to any giveaways, which are created by ${this.client.user}, you agree to be DMed by the bot,
                                whether you joined a giveaway or you won a giveaway!`)
                                .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`));
                        } else {
                            member.send(this.client.createGreenEmbed()
                                .setTitle(giveawayManager)
                                .setDescription(`Your giveaway entry has been confirmed!
                                **[${options.prize}](${msg.url})** in ${channel} of **${msg.guild.name}**
                                By reacting to any giveaways, which are created by ${this.client.user}, you agree to be DMed by the bot,
                                whether you joined a giveaway or you won a giveaway!`)
                                .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`));
                        };
                    };
                });
            });
            const newGiveaway = new giveawaySchema({
                prize: options.prize,
                duration: options.duration,
                channelID: options.channelID,
                guildId: options.guildID,
                endsOn: new Date(Date.now() + options.duration),
                startsOn: new Date(),
                messageID: msg.id,
                winners: options.winners,
                hostedBy: options.hostedBy,
                hasEnded: false,
                guildID: options.guildID
            });
            newGiveaway.save().catch(err => console.log(err));
            setTimeout(async () => {
                await this.schedule(newGiveaway);
                Reactions.stop();
            }, options.duration);
        });
    };
    public async schedule(giveaway: GiveawaySchema) {
        let { messageID, channelID, endsOn, prize, winners, hostedBy } = giveaway;
        const channel: TextChannel | NewsChannel = (this.client.channels.cache.filter(channel => channel.type == 'text' || channel.type == 'news').get(channelID) as TextChannel | NewsChannel);
        if (channel) {
            const message = await channel.messages.fetch(messageID);
            if (message) {
                const { embeds, reactions } = message;
                const reaction = reactions.cache.get('🎉');
                const users = await reaction.users.fetch();
                const entries = users.filter(user => !user.bot && channel.guild.members.cache.has(user.id)).array();
                if (embeds.length === 1) {
                    const embed = embeds[0];
                    function getWinners() {
                        if (entries.length < 1) return false;
                        if (entries.length <= winners) return entries;
                        const numbers = new Set();
                        const array = [];
                        let i = 0;
                        while (i < winners) {
                            const random = Math.floor(Math.random() * entries.length);
                            const selected = entries[random];
                            if (!numbers.has(random)) {
                                array.push(selected);
                                i++;
                            }
                        };
                        return array;
                    };
                    const winner = getWinners();
                    let finalWinners: string;
                    let finalWinnersEmbed: string;
                    if (!winner) {
                        finalWinners = '**Nobody reacted!**';
                        finalWinnersEmbed = finalWinners;
                    } else {
                        finalWinners = winner
                            .map(user => user.toString())
                            .join(', ');
                        finalWinnersEmbed = winner
                            .map((user) => user.toString())
                            .join('\n');
                    };
                    if (!winner) {
                        channel.send(this.client.createRedEmbed().setTitle(giveawayManager).setDescription(`Nobody reacted to the giveaway!\n${message.url}`));
                        embed.setDescription(`**🏅 ${winners == 1 ? "Winner" : "Winners"}:** Nobody reacted!\n${this.client.memberEmoji} **Hosted By:** ${hostedBy}\n`);
                        embed.setFooter(`Ended at`, this.client.user.displayAvatarURL());
                        embed.setColor("#818386");
                        await message.edit(`${this.client.galaxyAlphaEmoji}   **GIVEAWAY ENDED**   ${this.client.galaxyAlphaEmoji}`, embed);
                    } else {
                        this.DMWinner(winner, prize, message, channel);
                        channel.send(finalWinners).then(msg => msg.delete({ timeout: 1 }));
                        channel.send(this.client.createGreenEmbed()
                            .setTitle(giveawayManager)
                            .setDescription(`Congratulations ${finalWinners}! You won the **${prize}**!\n${message.url}`)).then(async giveawayMessage => {
                                embed.setDescription(`**🏅 ${winners == 1 ? "Winner" : "Winners"}**:\n${finalWinnersEmbed}\n[or click me](${giveawayMessage.url})\n${this.client.memberEmoji} **Hosted By:** ${hostedBy}\n`);
                                embed.setFooter(`Ended at`, this.client.user.displayAvatarURL());
                                embed.setColor("#818386");
                                await message.edit(`${this.client.galaxyAlphaEmoji}   **GIVEAWAY ENDED**   ${this.client.galaxyAlphaEmoji}`, embed);
                            });
                    };
                    return await endGiveaway(messageID);
                };
            };
        };
    };
    public async fetch(messageID: string) {
        const giveaway = await giveawaySchema.findOne({ messageID: messageID });
        if (!giveaway) return false;
        return giveaway;
    };
    public async list(guildID: string) {
        const Giveaways = await giveawaySchema.find({ guildID: guildID, hasEnded: false });
        if (Giveaways.length < 1) return false;
        const array = [];
        Giveaways.map(giveaway => array.push({
            hostedBy: giveaway.hostedBy,
            timeRemaining: giveaway.endsOn.getTime() - Date.now(),
            messageID: giveaway.messageID,
            prize: giveaway.prize,
            guildID: giveaway.guildID,
            winners: giveaway.winners,
            channel: `<#${giveaway.channelID}>`
        }));
        return array;
    };
    public async reroll(messageID: string, channel: TextChannel | NewsChannel, usage: string) {
        channel.messages.fetch(messageID).then(async msg => {
            if (msg) {
                const ended = await giveawaySchema.findOne({
                    messageID: messageID
                });
                if (!ended) return false;
                const { reactions } = msg;
                const reaction = reactions.cache.get('🎉');
                if (!reaction) return msg.channel.send(this.client.createRedEmbed(true, usage)
                    .setTitle(giveawayManager)
                    .setDescription("This message is not a giveaway!"));
                const users = await reaction.users.fetch();
                const entries = users.filter(user => !user.bot && channel.guild.members.cache.has(user.id)).array();
                function getWinners() {
                    if (entries.length < 1) return false;
                    const numbers = new Set();
                    const array = [];
                    let i = 0;
                    const random = Math.floor(Math.random() * entries.length);
                    const selected = entries[random];
                    if (!numbers.has(random)) {
                        array.push(selected);
                        i++;
                    };
                    return array;
                };
                const winner = getWinners();
                let finalWinners: string;
                if (!winner) {
                    finalWinners = '**Nobody reacted!**';
                    return msg.channel.send(this.client.createEmbed()
                        .setTitle(giveawayManager)
                        .setDescription(`Nobody reacted to the giveaway!\n${msg.url}`))
                } else {
                    finalWinners = winner
                        .map(user => user.toString())
                        .join(', ');
                    channel.send(finalWinners).then(msg => msg.delete({ timeout: 1 }));
                    return msg.channel.send(this.client.createEmbed()
                        .setTitle(giveawayManager)
                        .setDescription(`The new winner of this giveaways is ${winner}!`));
                };
            };
        });
    };
    public async end(messageID: string) {
        let data = await giveawaySchema.findOne({ messageID: messageID });
        if (!data) return false;
        if (data.hasEnded) return false;
        const channel: TextChannel | NewsChannel = (this.client.channels.cache.filter(channel => channel.type == 'text' || channel.type == 'dm').get(data.channelID) as TextChannel | NewsChannel);
        if (channel) {
            const message = await channel.messages.fetch(messageID);
            if (message) {
                const { embeds, reactions } = message;
                const reaction = reactions.cache.get('🎉');
                const users = await reaction.users.fetch();
                const entries = users.filter(user => !user.bot).array();
                if (embeds.length === 1) {
                    const embed = embeds[0];
                    function getWinners() {
                        if (entries.length < 1) return false;
                        if (entries.length <= data.winners) return entries;
                        const numbers = new Set();
                        const array = [];
                        let i = 0;
                        while (i < data.winners) {
                            const random = Math.floor(Math.random() * entries.length);
                            const selected = entries[random];
                            if (!numbers.has(random)) {
                                array.push(selected);
                                i++;
                            }
                        };
                        return array;
                    };
                    const winner = getWinners();
                    let finalWinners: string;
                    let finalWinnersEmbed: string;
                    if (!winner) {
                        finalWinners = '**Nobody reacted!**';
                        finalWinnersEmbed = finalWinners;
                    } else {
                        finalWinners = winner
                            .map(user => user.toString())
                            .join(', ');
                        finalWinnersEmbed = winner
                            .map((user) => user.toString())
                            .join('\n');
                    };
                    if (!winner) {
                        channel.send(this.client.createRedEmbed().setTitle(giveawayManager).setDescription(`Nobody reacted to the giveaway!\n${message.url}`));
                        embed.setDescription(`**🏅 ${data.winners == 1 ? "Winner" : "Winners"}:** Nobody reacted!\n${this.client.memberEmoji} **Hosted By:** ${data.hostedBy}\n`);
                        embed.setFooter(`Ended at`, this.client.user.displayAvatarURL());
                        embed.setColor("#818386");
                        await message.edit(`${this.client.galaxyAlphaEmoji}   **GIVEAWAY ENDED**   ${this.client.galaxyAlphaEmoji}`, embed);
                    } else {
                        this.DMWinner(winner, data.prize, message, channel);
                        channel.send(finalWinners).then(msg => msg.delete({ timeout: 1 }));
                        channel.send(this.client.createGreenEmbed()
                            .setTitle(giveawayManager)
                            .setDescription(`Congratulations ${finalWinners}! You won the **${data.prize}**!\n${message.url}`)).then(async giveawayMessage => {
                                embed.setDescription(`**🏅 ${data.winners == 1 ? "Winner" : "Winners"}**:\n${finalWinnersEmbed}\n[or click me](${giveawayMessage.url})\n${this.client.memberEmoji} **Hosted By**: ${data.hostedBy}\n`);
                                embed.setFooter(`Ended at`, this.client.user.displayAvatarURL());
                                embed.setColor("#818386");
                                await message.edit(`${this.client.galaxyAlphaEmoji}   **GIVEAWAY ENDED**   ${this.client.galaxyAlphaEmoji}`, embed);
                            });
                    };
                    return await endGiveaway(messageID);
                };
            };
        };
    };
    private DMWinner(winner: Array<User>, prize: string, message: Message, channel: TextChannel | NewsChannel) {
        winner.forEach(user => {
            user.send(this.client.createEmbed()
                .setTitle(giveawayManager)
                .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`)
                .setDescription(`Congratulations! You won the **[${prize}](${message.url})** in ${channel} of **${message.guild.name}**!`));
        });
    };
};

export async function endGiveaway(messageID: string) {
    return await giveawaySchema.findOneAndDelete({ messageID: messageID });
};