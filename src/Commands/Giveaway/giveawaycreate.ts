import Command, { CommandRunner } from '@root/Command';
import { NewsChannel, Role, TextChannel } from 'discord.js';
import { giveawayManager } from '@commands/Giveaway/Giveaway';


export const giveawayCreate: string = "giveawaycreate";
export default class GiveawayCreateCommand extends Command {
    constructor() {
        super({
            name: giveawayCreate,
            description: "creates a giveaway with requirements",
            aliases: ["gcreate"],
            category: "giveaway",
            guildOnly: true,
            requiredRoles: ["giveawayManagerRoleID"],
            userPermissions: ["MANAGE_GUILD"],
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const prompts = [
            'You have to mention a channel or provide a channel ID, where I have the permission to `Manage Messages`!',
            'You have to specify a valid duration!\nThe duration has to be over a minute.\nYou can also provide the duration in milliseconds!\nYou can use seconds (s), minutes (m), hours (h), days (d), weeks (w) and years (y)!',
            'You have to provide a number of winners!',
            'One of these roles is invalid! Make sure that the each role is trimmed by a space!',
            'You have to provide a number of messages',
            'You have to provide a number of invites',
            'You have to provide a level!',
            'You have to provide a valid invite link!',
            'What is the prize of this giveaway?',
            'In which channel do you want the giveaway to be in?\nUse <#channel-name> please!',
            'How long will the giveaway be?\nThe duration has to be over a minute.\nYou can also provide the duration in milliseconds!\nYou can use seconds (s), minutes (m), hours (h), days (d), weeks (w) and years (y)!',
            'How many winners will this giveaway have?',
            'Are they any requirements? Answer with `yes` or `no`!',
            'Which roles are required?\nTrim each @Role or Role ID with a space!\nRemember that one of the roles, which you\'ll provide, are required to join the giveaway!',
            'How many messages are required to sent to join this giveaway?\nEnter a number!',
            'How many invites are required to have?',
            'Which level is required to join this giveaway?',
            'Is there a guild, where the member should be in?',
        ];
        interface responsesLayout {
            prize: string;
            channel: TextChannel | NewsChannel;
            duration: number;
            winners: number;
            roles: Array<string>;
            messages: number;
            invites: number;
            level: number;
            guildReq: string;
        };
        let responses: responsesLayout = {
            prize: "",
            duration: 0,
            guildReq: "",
            invites: 0,
            level: 0,
            messages: 0,
            roles: [],
            winners: 0,
            channel: null
        };
        let cancel: boolean = false;
        for (let i = 8; i < prompts.length; i++) {
            if (cancel) return;
            if (i < 3) await message.channel.send(client.createRedEmbed().setTitle(giveawayManager).setDescription(prompts[i]).addField("How to cancel?", "Simply type `cancel` to cancel the entire process!"));
            if (i >= 3 && i < 8) await message.channel.send(client.createRedEmbed().setTitle(giveawayManager).setDescription(prompts[i]).addField("Type `none` if you do not want this to be a requirement", "Simply type `cancel` to cancel the entire process!"));
            if (i >= 8 && i < 13) await message.channel.send(client.createEmbed().setTitle(giveawayManager).setDescription(prompts[i]).addField("How to cancel?", "Simply type `cancel` to cancel the entire process!"));
            if (i >= 13) await message.channel.send(client.createEmbed().setTitle(giveawayManager).setDescription(prompts[i]).addField("Type `none` if you do not want this to be a requirement", "Simply type `cancel` to cancel the entire process!"));
            const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 });
            if (msg.size == 0) {
                cancel = true;
                return message.channel.send(client.createRedEmbed(true, `${prefix}gcreate`).setTitle(giveawayManager).setDescription("Creating giveaway cancelled!"));
            } else if (msg.first().content.toLowerCase() == 'cancel') {
                cancel = true;
                return message.channel.send(client.createRedEmbed(true, `${prefix}gcreate`).setTitle(giveawayManager).setDescription("Creating giveaway cancelled!"));
            };
            if (i == 0) { //THE BEGINNING - CHANNEL
                let channel: TextChannel | NewsChannel;
                if (msg.first().mentions.channels.first() && msg.first().mentions.channels.first().permissionsFor(client.user).has("MANAGE_MESSAGES")) channel = msg.first().mentions.channels.first();
                if (msg.first().content && message.guild.channels.cache.filter(channel => (channel.type == 'news' || channel.type == 'text') && channel.permissionsFor(client.user).has("MANAGE_MESSAGES")).has(msg.first().content)) channel = (message.guild.channels.cache.get(msg.first().content) as TextChannel | NewsChannel);
                if (channel) responses.channel = channel;
                else i = -1;
            } else if (i == 1) {//DURATION
                if (client.ms(msg.first().content) && client.ms(msg.first().content) >= 60000) {
                    responses.duration = client.ms(msg.first().content);
                    i = 10;
                } else {
                    i = 0;
                };
            } else if (i == 2) {//WINNERS
                if (!isNaN(parseInt(msg.first().content))) {
                    responses.winners = parseInt(msg.first().content);
                    i = 11;
                } else {
                    i = 1;
                };
            } else if (i == 3) { // REQUIREMENTS
                const validRoles: Array<string> = [];
                const roles = msg.first().content.trim().split(/ +/g);
                roles.forEach(role => {
                    if (role.startsWith("<@&") && role.endsWith(">")) {
                        if (message.guild.roles.cache.has(role.split("&")[1].split(">")[0])) {
                            validRoles.push(role.split("<&")[1].split(">")[0]);
                        };
                    } else if (message.guild.roles.cache.has(role)) {
                        validRoles.push(role);
                    };
                });
                if (validRoles.length == 0) {
                    i = 2;
                } else {
                    responses.roles = validRoles;
                    i = 13;
                };
            } else if (i == 4) {
                if (msg.first().content.toLowerCase() == 'none') {
                    responses.messages = 0;
                    i = 14;
                } else {
                    if (!isNaN(parseInt(msg.first().content))) {
                        responses.messages = parseInt(msg.first().content);
                        i = 14;
                    } else {
                        i = 3;
                    };
                };
            } else if (i == 5) {
                if (msg.first().content.toLowerCase() == 'none') {
                    responses.invites = 0;
                    i = 15;
                } else {
                    if (!isNaN(parseInt(msg.first().content))) {
                        responses.invites = parseInt(msg.first().content);
                        i = 15;
                    } else {
                        i = 4;
                    };
                };
            } else if (i == 6) {
                if (msg.first().content.toLowerCase() == 'none') {
                    responses.level = 0;
                    i = 16;
                } else {
                    if (!isNaN(parseInt(msg.first().content))) {
                        responses.level = parseInt(msg.first().content);
                        i = 16;
                    } else {
                        i = 5;
                    };
                };
            } else if (i == 7) {
                if (msg.first().content.toLowerCase() == 'none') {
                    responses.guildReq = 'none';
                    i = prompts.length;
                } else {
                    if (msg.first().content.includes("discord.gg/") && client.fetchInvite(msg.first().content)) {
                        responses.guildReq = msg.first().content;
                        i = prompts.length;
                    } else {
                        i = 6;
                    };
                };
            } else if (i == 8) {//THE BEGINNING - PRIZE
                responses.prize = msg.first().content;
            } else if (i == 9) {//CHANNEL
                let channel: TextChannel | NewsChannel;
                if (msg.first().mentions.channels.first() && msg.first().mentions.channels.first().permissionsFor(client.user).has("MANAGE_MESSAGES")) channel = msg.first().mentions.channels.first();
                if (msg.first().content && message.guild.channels.cache.filter(channel => (channel.type == 'news' || channel.type == 'text') && channel.permissionsFor(client.user).has("MANAGE_MESSAGES")).has(msg.first().content)) channel = (message.guild.channels.cache.get(msg.first().content) as TextChannel | NewsChannel);
                if (channel) responses.channel = channel;
                else i = -1;
            } else if (i == 10) {//DURATION
                if (client.ms(msg.first().content) && client.ms(msg.first().content) >= 60000) {
                    responses.duration = client.ms(msg.first().content);
                } else {
                    i = 0;
                };
            } else if (i == 11) {//WINNER
                if (!isNaN(parseInt(msg.first().content))) {
                    responses.winners = parseInt(msg.first().content);
                } else {
                    i = 1;
                };
            } else if (i == 12) {//YES OR NO
                if (msg.first().content.toLowerCase() == "yes") {
                    i = 12;
                } else if (msg.first().content.toLowerCase() == "no") {
                    responses.roles = [];
                    responses.messages = 0;
                    responses.invites = 0;
                    responses.level = 0;
                    responses.guildReq = 'none';
                    i = prompts.length;
                } else {
                    i = 11;
                }
            } else if (i == 13) { //REQUIREMENTS - ROLES
                if (msg.first().content.toLowerCase() == 'none') {
                    responses.roles = [];
                } else {
                    const validRoles: Array<string> = [];
                    const roles = msg.first().content.trim().split(/ +/g);
                    roles.forEach(role => {
                        if (role.startsWith("<@&") && role.endsWith(">")) {
                            if (message.guild.roles.cache.has(role.split("&")[1].split(">")[0])) {
                                validRoles.push(role.split("<&")[1].split(">")[0]);
                            };
                        } else if (message.guild.roles.cache.has(role)) {
                            validRoles.push(role);
                        };
                    });
                    if (validRoles.length == 0) {
                        i = 2;
                    } else {
                        responses.roles = validRoles;
                    };
                };
            } else if (i == 14) {//MESSAGSE
                if (msg.first().content.toLowerCase() == 'none') {
                    responses.messages = 0;
                } else {
                    if (!isNaN(parseInt(msg.first().content))) {
                        responses.messages = parseInt(msg.first().content);
                    } else {
                        i = 3;
                    };
                };
            } else if (i == 15) {//INVITES
                if (msg.first().content.toLowerCase() == 'none') {
                    responses.invites = 0;
                } else {
                    if (!isNaN(parseInt(msg.first().content))) {
                        responses.invites = parseInt(msg.first().content);
                    } else {
                        i = 4;
                    };
                };
            } else if (i == 16) {//LEVEL
                if (msg.first().content.toLowerCase() == 'none') {
                    responses.level = 0;
                } else {
                    if (!isNaN(parseInt(msg.first().content))) {
                        responses.level = parseInt(msg.first().content);
                    } else {
                        i = 5;
                    };
                };
            } else if (i == 17) {//INVITE LINK
                if (msg.first().content.toLowerCase() == 'none') {
                    responses.guildReq = 'none';
                } else {
                    if (msg.first().content.includes("discord.gg/") && client.fetchInvite(msg.first().content)) {
                        responses.guildReq = msg.first().content;
                    } else {
                        i = 6;
                    };
                };
            };
        };
        let time: number = 0;
        if (message.content.toLowerCase().includes("giveawayschedule") || message.content.toLowerCase().includes("gschedule")){
            for (let i = 0; i == 0; i++){
                await message.channel.send(client.createEmbed()
                .setTitle(giveawayManager)
                .setDescription("When you want to let the giveaway start?")
                .addField("How to cancel?", "Simply type `cancel` to cancel the entire process!"));
                const msg = await message.channel.awaitMessages((msg) => msg.author.id == message.author.id, { max: 1, time: 30000 });
                if (!msg.first()) return client.createArgumentError(message, { title: giveawayManager, description: "Creating giveaway cancelled!" }, this.usage);
                if (msg.first().content.toLowerCase() == "cancel") return client.createArgumentError(message, { title: giveawayManager, description: "Creating giveaway cancelled!" }, this.usage);
                if (client.ms(msg.first().content)) time = client.ms(msg.first().content);
                else i = -1;
            };
            client.createSuccess(message, { title: giveawayManager, description: `Starting giveaway in ${client.humanizer(time, {
                round: true,
                units: ["y", "mo", "w", "d", "h", "m", "s"]
            })}!`});
        };
        setTimeout(async () => await client.giveaways.start({
            prize: responses.prize,
            channelID: responses.channel.id,
            duration: responses.duration,
            winners: responses.winners,
            guildID: message.guild.id,
            hostedBy: message.author
        }, message, {
            roles: responses.roles,
            messages: responses.messages,
            invites: responses.invites,
            level: responses.level,
            guildReq: responses.guildReq
        }), time);
    };
};