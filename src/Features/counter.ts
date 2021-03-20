import Feature, { FeatureRunner } from '@root/Feature';
import { Guild, GuildChannel, VoiceChannel } from 'discord.js';
import CounterSchema from '@models/counter';

export default class CounterFeature extends Feature {
    constructor(){
        super({
            name: "counter"
        });
    };
    run: FeatureRunner = async (client) => {
        function convertName(channelName: string, counter: number): string {
            const oldNumber = channelName.match(/\d+/)[0];
            return channelName.replace(oldNumber, `${counter}`);
        };
        //ALL MEMBERS\\
        function allMembers(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.memberCount));
        };
        //MEMBERS\\
        function members(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.members.cache.filter(member => !member.user.bot).size));
        };
        //BOTS\\
        function bots(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.members.cache.filter(member => member.user.bot).size));
        };
        //ROLES\\
        function roles(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.roles.cache.size - 1));
        };
        //ALL CHANNELS\\
        function allChannels(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.channels.cache.filter(channel => channel.type != 'category').size));
        };
        //TEXT CHANNELS\\
        function textChannels(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.channels.cache.filter(channel => channel.type == 'text').size));
        };
        //VOICE CHANNELS\\
        function voiceChannels(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.channels.cache.filter(channel => channel.type == 'voice').size));
        };
        //CATEGORIES\\
        function categories(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.channels.cache.filter(channel => channel.type == 'category').size));
        };
        //ANNOUNCEMENT CHANNELS\\
        function announcementsChannels(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.channels.cache.filter(channel => channel.type == 'news').size));
        };
        //ALL EMOJIS\\
        function allEmojis(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.emojis.cache.size));
        };
        //ANIMATED EMOJIS\\
        function animatedEmojis(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.emojis.cache.filter(emoji => emoji.animated).size));
        };
        //NOT ANIMATED EMOJIS\\
        function notAnimatedEmojis(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.emojis.cache.filter(emoji => !emoji.animated).size));
        };
        //BOOSTS\\
        function boosts(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.premiumSubscriptionCount));
        };
        //BOOST LEVEL\\
        function boostLevel(guildID: string, channelID: string) {
            const guild: Guild = client.guilds.cache.get(guildID);
            const channel: VoiceChannel = (guild.channels.cache.filter(channel => channel.type == 'voice').get(channelID) as VoiceChannel);
            channel.updateOverwrite(guild.id, {
                VIEW_CHANNEL: true,
                CONNECT: false
            });
            channel.setName(convertName(channel.name, guild.premiumTier));
        };
        client.on("guildMemberAdd", async (member) => {
            await CounterSchema.findOne({
                guildID: member.guild.id
            }, {}, {}, (err, counter) => {
                if (err) return console.log(err);
                if (counter) {
                    if (member.user.bot && counter.bots) bots(member.guild.id, counter.bots);
                    if (!member.user.bot && counter.members) members(member.guild.id, counter.members);
                    if (counter.allMembers) allMembers(member.guild.id, counter.allMembers);
                };
            });
        });
        client.on("guildMemberRemove", async (member) => {
            await CounterSchema.findOne({
                guildID: member.guild.id
            }, {}, {}, (err, counter) => {
                if (err) return console.log(err);
                if (counter) {
                    if (member.user.bot && counter.bots) bots(member.guild.id, counter.bots);
                    if (!member.user.bot && counter.members) members(member.guild.id, counter.members);
                    if (counter.allMembers) allMembers(member.guild.id, counter.allMembers);
                };
            });
        });
        client.on("roleCreate", async (role) => {
            await CounterSchema.findOne({
                guildID: role.guild.id
            }, {}, {}, (err, counter) => {
                if (err) return console.log(err);
                if (counter) {
                    if (counter.roles) roles(role.guild.id, counter.roles);
                };
            });
        });
        client.on("roleDelete", async (role) => {
            await CounterSchema.findOne({
                guildID: role.guild.id
            }, {}, {}, (err, counter) => {
                if (err) return console.log(err);
                if (counter) {
                    if (counter.roles) roles(role.guild.id, counter.roles);
                };
            });
        });
        client.on("channelCreate", async (channel) => {
            if (channel.type != 'dm') {
                await CounterSchema.findOne({
                    guildID: (channel as GuildChannel).guild.id
                }, {}, {}, (err, counter) => {
                    if (err) return console.log(err);
                    if (counter) {
                        if (counter.allChannels && channel.type != 'category') allChannels((channel as GuildChannel).guild.id, counter.allChannels);
                        if (channel.type == 'category' && counter.categories) categories((channel as GuildChannel).guild.id, counter.categories);
                        if (channel.type == 'text' && counter.textChannels) textChannels((channel as GuildChannel).guild.id, counter.textChannels);
                        if (channel.type == 'voice' && counter.voiceChannels) voiceChannels((channel as GuildChannel).guild.id, counter.voiceChannels);
                        if (channel.type == 'news' && counter.announcements) announcementsChannels((channel as GuildChannel).guild.id, counter.announcements);
                    };
                });
            };
        });
        client.on("channelDelete", async (channel) => {
            if (channel.type != 'dm') {
                await CounterSchema.findOne({
                    guildID: (channel as GuildChannel).guild.id
                }, {}, {}, (err, counter) => {
                    if (err) return console.log(err);
                    if (counter) {
                        if (counter.allChannels && channel.type != 'category') allChannels((channel as GuildChannel).guild.id, counter.allChannels);
                        if (channel.type == 'category' && counter.categories) categories((channel as GuildChannel).guild.id, counter.categories);
                        if (channel.type == 'text' && counter.textChannels) textChannels((channel as GuildChannel).guild.id, counter.textChannels);
                        if (channel.type == 'voice' && counter.voiceChannels) voiceChannels((channel as GuildChannel).guild.id, counter.voiceChannels);
                        if (channel.type == 'news' && counter.announcements) announcementsChannels((channel as GuildChannel).guild.id, counter.announcements);
                    };
                });
            };
        });
        client.on("emojiCreate", async (emoji) => {
            await CounterSchema.findOne({
                guildID: emoji.guild.id
            }, {}, {}, (err, counter) => {
                if (err) return console.log(err);
                if (counter) {
                    if (counter.allEmojis) allEmojis(emoji.guild.id, counter.allEmojis);
                    if (emoji.animated && counter.animated) animatedEmojis(emoji.guild.id, counter.animated);
                    if (!emoji.animated && counter.notAnimated) notAnimatedEmojis(emoji.guild.id, counter.animated);
                };
            });
        });
        client.on("emojiDelete", async (emoji) => {
            await CounterSchema.findOne({
                guildID: emoji.guild.id
            }, {}, {}, (err, counter) => {
                if (err) return console.log(err);
                if (counter) {
                    if (counter.allEmojis) allEmojis(emoji.guild.id, counter.allEmojis);
                    if (emoji.animated && counter.animated) animatedEmojis(emoji.guild.id, counter.animated);
                    if (!emoji.animated && counter.notAnimated) notAnimatedEmojis(emoji.guild.id, counter.animated);
                };
            });
        });
        client.on("guildUpdate", async (oldGuild, newGuild) => {
            await CounterSchema.findOne({
                guildID: newGuild.id
            }, {}, {}, (err, counter) => {
                if (err) return console.log(err);
                if (counter) {
                    if (oldGuild.premiumSubscriptionCount != newGuild.premiumSubscriptionCount) boosts(newGuild.id, counter.boosts);
                    if (oldGuild.premiumTier != newGuild.premiumTier) boostLevel(newGuild.id, counter.boostLevel);
                };
            });
        });
    };
};