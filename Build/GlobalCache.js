"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const profile_1 = __importDefault(require("@models/profile"));
const level_1 = __importDefault(require("@models/level"));
const clientData_1 = __importDefault(require("@models/clientData"));
const guild_1 = __importDefault(require("@models/guild"));
const giveaways_1 = __importDefault(require("@models/Giveaways/giveaways"));
const ticket_1 = __importDefault(require("./Models/ticket"));
const customCommand_1 = __importDefault(require("./Models/customCommand"));
class GlobalCache {
    constructor(client) {
        this.client = client;
        //COLLECTIONS\\
        this.currency = new discord_js_1.Collection();
        this.levels = new discord_js_1.Collection();
        this.guilds = new discord_js_1.Collection();
        this.clientData = {};
        this.giveaways = new discord_js_1.Collection();
        this.tickets = new discord_js_1.Collection();
        this.customCommands = new discord_js_1.Collection();
        this.customCommandAliases = new discord_js_1.Collection();
        this.client.once("ready", async () => {
            const results = await clientData_1.default.findById(this.client.dataSchemaObjectId);
            if (!results)
                throw new Error("Cannot find the client data schema!");
            this.clientData = {
                blockedUser: results.blockedUser
            };
            const customCommands = await customCommand_1.default.find();
            for (const command of customCommands) {
                this.customCommands.set(`${command.guildID}-${command.name}`, {
                    aliases: command.aliases || [],
                    allowedChannels: command.allowedChannels || [],
                    allowedMembers: command.allowedMembers || [],
                    allowedRoles: command.allowedRoles || [],
                    answers: command.answers || [],
                    guildID: command.guildID,
                    name: command.name,
                    notAllowedChannels: command.notAllowedChannels || [],
                    notAllowedMembers: command.notAllowedMembers || [],
                    notAllowedRoles: command.notAllowedRoles || []
                });
                if (command.aliases.length > 0)
                    command.aliases.map(alias => this.customCommandAliases.set(`${command.guildID}-${alias}`, command.name));
            }
            ;
        });
    }
    ;
    //METHODS\\
    /**
     * Clears the cache and uploads the caches data to the database
     */
    async clearCacheAndSave() {
        if (this.levels.first())
            this.levels.forEach(async (message) => {
                await level_1.default.findOneAndUpdate({
                    guildID: message.guildID,
                    userID: message.userID
                }, message, {
                    upsert: true
                });
            });
        if (this.currency.first())
            this.currency.forEach(async (currency) => {
                await profile_1.default.findOneAndUpdate({
                    userID: currency.userID
                }, currency, {
                    upsert: true
                });
            });
        if (this.clientData)
            await clientData_1.default.findByIdAndUpdate(this.client.dataSchemaObjectId, this.clientData, {
                upsert: false
            });
        if (this.guilds.first())
            this.guilds.forEach(async (guild) => {
                await guild_1.default.findOneAndUpdate({
                    guildID: guild.guildID
                }, guild, {
                    upsert: true
                });
            });
        if (this.giveaways.first())
            this.giveaways.forEach(async (giveaway) => {
                if (giveaway.hasEnded)
                    this.giveaways.delete(giveaway.messageID);
                else
                    await giveaways_1.default.findOneAndUpdate({ guildID: giveaway.guildID }, {
                        ...giveaway,
                        hostedBy: giveaway.hostedBy.id
                    });
            });
        if (this.tickets.first())
            this.tickets.forEach(async (ticket) => {
                await ticket_1.default.findOneAndUpdate({ channelID: ticket.channelID }, ticket, {
                    upsert: true
                });
            });
        if (this.customCommands.first())
            this.customCommands.forEach(async (command) => {
                await customCommand_1.default.findOneAndUpdate({ guildID: command.guildID, name: command.name }, command, {
                    upsert: true
                });
            });
    }
    ;
    /**
     * Gets the level, xp and messages of an user
     * @param {Snowflake} guildID The ID of the guild
     * @param {Snowflake} userID The ID of the user
     */
    async getLevelandMessages(guildID, userID) {
        const key = `${userID}-${guildID}`;
        const LevelandMessages = this.levels.get(key) || await level_1.default.findOne({ guildID: guildID, userID: userID });
        if (!this.levels.has(key))
            this.levels.set(key, {
                userID: LevelandMessages ? LevelandMessages.userID : userID,
                guildID: LevelandMessages ? LevelandMessages.guildID : guildID,
                level: LevelandMessages ? LevelandMessages.level : 0,
                xp: LevelandMessages ? LevelandMessages.xp : 0,
                messages: LevelandMessages ? LevelandMessages.messages : 0,
                lastUpdated: new Date()
            });
        if (!LevelandMessages)
            level_1.default.create(this.levels.get(key));
        return this.levels.get(key);
    }
    ;
    /**
     * Updates a user's level stats
     * @param {Snowflake} guildID The ID of the guild
     * @param {Snowflake} userID The ID of the user
     * @param {string} settings The settings to update
     */
    async updateLevel(guildID, userID, settings) {
        const key = `${userID}-${guildID}`;
        const usersMessages = await this.getLevelandMessages(guildID, userID);
        return this.levels.set(key, {
            ...usersMessages,
            ...settings
        });
    }
    ;
    /**
     * Gets a currency profile of an user
     * @param {Snowflake} userID The ID of the user
     */
    async getCurrency(userID) {
        const profile = this.currency.has(userID) ? this.currency.get(userID) : await profile_1.default.findOne({ userID: userID });
        if (!this.currency.has(userID))
            this.currency.set(userID, {
                userID: profile ? profile.userID : userID,
                bank: profile ? profile.bank : 0,
                wallet: profile ? profile.wallet : 0,
                messageCount: profile ? profile.messageCount : 0,
                passive: profile ? profile.passive : false,
                items: profile ? profile.items : [],
                profileCreatedAt: profile ? profile.profileCreatedAt : new Date()
            });
        if (!profile)
            profile_1.default.create(this.currency.get(userID));
        return this.currency.get(userID);
    }
    ;
    /**
     * Updates a value of a key
     * @param {Snowflake} userID The ID of the user
     * @param {object} settings The settings to update
     */
    async updateCurrency(userID, settings) {
        const userProfile = await this.getCurrency(userID);
        return this.currency.set(userID, {
            ...userProfile,
            ...settings
        });
    }
    ;
    /**
     * Increases the user's balance
     * @param {Snowflake} userID The ID of the user
     * @param {"bank" | "wallet"} walletOrBalance Increase balance in wallet or bank
     * @param {number} increaseTo The number to increase to
     */
    async increaseBalance(userID, walletOrBalance, increaseTo) {
        const userProfile = await this.getCurrency(userID);
        return this.currency.set(userID, {
            ...userProfile,
            wallet: walletOrBalance == "wallet" ? userProfile.wallet + increaseTo : userProfile.wallet,
            bank: walletOrBalance == "bank" ? userProfile.bank + increaseTo : userProfile.bank
        });
    }
    ;
    /**
     * Increases the message count to 1
     * @param {Snowflake} userID The ID of the user
     */
    async increaseCurrencyMessageCount(userID) {
        const userProfile = await this.getCurrency(userID);
        return this.currency.set(userID, {
            ...userProfile,
            messageCount: userProfile.messageCount + 1
        });
    }
    ;
    /**
     * Gets the client data
     */
    getClientData() {
        return this.clientData;
    }
    ;
    /**
     * Gets the data of a guild
     * @param {Snowflake} guildID The ID of the guild
     */
    async getGuild(guildID) {
        const guild = this.guilds.has(guildID) ? this.guilds.get(guildID) : await guild_1.default.findOne({ guildID: guildID });
        if (!this.guilds.has(guildID))
            this.guilds.set(guildID, {
                guildID: guildID,
                prefix: guild ? guild.prefix : this.client.globalPrefix,
                modLogChannelID: guild ? guild.modLogChannelID : null,
                modLogChannelWebhookToken: guild ? guild.modLogChannelWebhookToken : null,
                modLogChannelWebhookID: guild ? guild.modLogChannelWebhookID : null,
                muteRoleID: guild ? guild.muteRoleID : null,
                memberRoleID: guild ? guild.memberRoleID : null,
                ticketCategoryID: guild ? guild.ticketCategoryID : null,
                ticketManagerRoleID: guild ? guild.ticketManagerRoleID : null,
                giveawayManagerRoleID: guild ? guild.giveawayManagerRoleID : null,
                giveawayBlacklistedRoleID: guild ? guild.giveawayBlacklistedRoleID : null,
                giveawayByPassRoleID: guild ? guild.giveawayByPassRoleID : null,
                serverManagerRoleID: guild ? guild.serverManagerRoleID : null,
                welcomeMessageType: guild ? guild.welcomeMessageType : null,
                welcomeMessage: guild ? guild.welcomeMessage : null,
                welcomeChannelID: guild ? guild.welcomeChannelID : null,
                modMailManagerRoleID: guild ? guild.modMailManagerRoleID : null,
                modMailLogChannelID: guild ? guild.modMailLogChannelID : null,
                modMailCategoryID: guild ? guild.modMailCategoryID : null,
                DJRoleID: guild ? guild.DJRoleID : null,
                reactionRoles: guild ? guild.reactionRoles : [],
                ignoreChannels: guild ? guild.ignoreChannels : [],
                autoPublishChannels: guild ? guild.autoPublishChannels : [],
                autoSuggestionChannel: guild ? guild.autoSuggestionChannel : [],
                blacklistedWords: guild ? guild.blacklistedWords : [],
                suggestionChannelID: guild ? guild.suggestionChannelID : null,
                autoMod: guild ? guild.autoMod : {
                    blacklistedWords: [],
                    deletingLinks: false,
                    deletingImages: false,
                    spam: {
                        cooldown: 0,
                        messageLimit: 0,
                        timer: 0
                    }
                },
                suggestionManagerRoleID: guild ? guild.suggestionManagerRoleID : null,
                chatBot: guild ? guild.chatBot : []
            });
        if (!guild)
            await guild_1.default.create(this.guilds.get(guildID));
        return this.guilds.get(guildID);
    }
    ;
    /**
     * Updates guild settings
     * @param {Snowflake} guildID The ID of the guild
     * @param {object} settings The settings
     */
    async updateGuild(guildID, settings) {
        const guild = await this.getGuild(guildID);
        return this.guilds.set(guildID, {
            ...guild,
            ...settings
        });
    }
    ;
    /**
     * Return's a giveaway
     * @param {Snowflake} messageID
     */
    async getGiveaway(messageID) {
        const giveaway = this.giveaways.has(messageID) ? this.giveaways.get(messageID) : await giveaways_1.default.findOne({ messageID: messageID });
        if (!this.giveaways.has(messageID) && giveaway)
            this.giveaways.set(messageID, {
                guildID: giveaway.guildID,
                channelID: giveaway.channelID,
                duration: giveaway.duration,
                endsOn: giveaway.endsOn,
                hasEnded: giveaway.hasEnded,
                hostedBy: this.client.guilds.cache.get(giveaway.guildID).members.cache.get(giveaway.hostedBy).user,
                messageID: messageID,
                prize: giveaway.prize,
                startsOn: giveaway.startsOn,
                winners: giveaway.winners
            });
        return this.giveaways.get(messageID);
    }
    ;
    /**
     * Updates a giveaway
     * @param {object} settings The settings to update
     */
    async updateGiveaway(messageID, settings) {
        const giveaway = await this.getGiveaway(messageID);
        if (!giveaway)
            return;
        return this.giveaways.set(messageID, {
            ...giveaway,
            ...settings
        });
    }
    ;
    /**
     * Get's data of a ticket
     * @param {Snowflake} channelID The ID of the channel
     * @param {object?} optionalData Optional data, if no ticket was found
     */
    async getTicket(channelID, optionalData) {
        const ticket = this.tickets.has(channelID) ? this.tickets.get(channelID) : await ticket_1.default.findOne({ channelID: channelID });
        if (!this.tickets.has(channelID))
            this.tickets.set(channelID, {
                categoryID: ticket ? ticket.categoryID : optionalData ? optionalData.categoryID : null,
                channelID: channelID,
                userID: ticket ? ticket.userID : optionalData ? optionalData.userID : null,
                createdAt: ticket ? ticket.createdAt : new Date()
            });
        const newTicket = this.tickets.get(channelID);
        return newTicket.categoryID && newTicket.userID ? newTicket : null;
    }
    ;
    /**
     * Get's a custom command
     * @param {Snowflake} guildID The ID of the guild
     * @param {CustomCommand} customCommand The custom command name or an alias of the command
     */
    async getCustomCommand(guildID, customCommand) {
        const key = `${guildID}-${customCommand.toLowerCase()}`;
        return this.customCommands.has(key) ? this.customCommands.get(key) : this.customCommands.get(this.customCommandAliases.get(key));
    }
    ;
}
exports.default = GlobalCache;
;
//# sourceMappingURL=GlobalCache.js.map