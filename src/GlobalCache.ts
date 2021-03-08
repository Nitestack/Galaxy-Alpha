import { Collection, Snowflake } from "discord.js";
import CurrencySchema, { Profile } from "@models/profile";
import LevelSchema, { Level } from "@models/level";
import ClientDataSchema, { ClientData } from "@models/clientData";
import GuildSchema, { Guild } from "@models/guild";
import GalaxyAlpha from "@root/Client";
import GiveawaySchema, { Giveaway } from "@models/Giveaways/giveaways";

export default class GlobalCache {
    constructor(private client: GalaxyAlpha) {
        this.client.once("ready", async () => {
            const results = await ClientDataSchema.findById(this.client.dataSchemaObjectId);
            if (!results) throw new Error("Cannot find the client data schema!");
            this.clientData = {
                blockedUser: results.blockedUser
            };
        });
    };
    //COLLECTIONS\\
    public currency: Collection<string, Profile> = new Collection();
    public levels: Collection<string, Level> = new Collection();
    public guilds: Collection<string, Guild> = new Collection();
    public clientData: ClientData = {};
    public giveaways: Collection<string, Giveaway> = new Collection();
    //METHODS\\
    /**
     * Clears the cache and uploads the caches data to the database
     */
    public async clearCacheAndSave() {
        if (this.levels.first()) this.levels.forEach(async message => {
            await LevelSchema.findOneAndUpdate({
                guildID: message.guildID,
                userID: message.userID
            }, message, {
                upsert: true
            });
        });
        if (this.currency.first()) this.currency.forEach(async currency => {
            await CurrencySchema.findOneAndUpdate({
                userID: currency.userID
            }, currency, {
                upsert: true
            });
        });
        if (this.clientData) await ClientDataSchema.findByIdAndUpdate(this.client.dataSchemaObjectId, this.clientData, {
            upsert: false
        });
        if (this.guilds.first()) this.guilds.forEach(async guild => {
            await GuildSchema.findOneAndUpdate({
                guildID: guild.guildID
            }, guild, {
                upsert: true
            });
        });
        if (this.giveaways.first()) this.giveaways.forEach(async giveaway => {
            await GiveawaySchema.findOneAndUpdate({ guildID: giveaway.guildID }, {
                ...giveaway,
                hostedBy: giveaway.hostedBy.id
            });
            if (giveaway.hasEnded) this.giveaways.delete(giveaway.messageID);
        });
        this.currency.clear();
        this.levels.clear();
        this.guilds.clear();
    };
    /**
     * Gets the level, xp and messages of an user
     * @param {Snowflake} guildID The ID of the guild 
     * @param {Snowflake} userID The ID of the user
     */
    public async getLevelandMessages(guildID: Snowflake, userID: Snowflake): Promise<Level> {
        const key = `${userID}-${guildID}`;
        const LevelandMessages = this.levels.get(key) || await LevelSchema.findOne({ guildID: guildID, userID: userID });
        if (!this.levels.has(key)) this.levels.set(key, {
            userID: LevelandMessages ? LevelandMessages.userID : userID,
            guildID: LevelandMessages ? LevelandMessages.guildID : guildID,
            level: LevelandMessages ? LevelandMessages.level : 0,
            xp: LevelandMessages ? LevelandMessages.xp : 0,
            messages: LevelandMessages ? LevelandMessages.messages : 0,
            lastUpdated: new Date()
        });
        if (!LevelandMessages) LevelSchema.create(this.levels.get(key));
        return this.levels.get(key);
    };
    /**
     * Updates a user's level stats
     * @param {Snowflake} guildID The ID of the guild 
     * @param {Snowflake} userID The ID of the user
     * @param {string} settings The settings to update
     */
    public async updateLevel(guildID: Snowflake, userID: Snowflake, settings: Level) {
        const key = `${userID}-${guildID}`;
        const usersMessages = await this.getLevelandMessages(guildID, userID);
        return this.levels.set(key, {
            ...usersMessages,
            ...settings
        });
    };
    /**
     * Gets a currency profile of an user
     * @param {Snowflake} userID The ID of the user 
     */
    public async getCurrency(userID: Snowflake): Promise<Profile> {
        const profile = this.currency.has(userID) ? this.currency.get(userID) : await CurrencySchema.findOne({ userID: userID });
        if (!this.currency.has(userID)) this.currency.set(userID, {
            userID: profile ? profile.userID : userID,
            bank: profile ? profile.bank : 0,
            wallet: profile ? profile.wallet : 0,
            messageCount: profile ? profile.messageCount : 0,
            passive: profile ? profile.passive : false,
            items: profile ? profile.items : [],
            profileCreatedAt: profile ? profile.profileCreatedAt : new Date()
        });
        if (!profile) CurrencySchema.create(this.currency.get(userID));
        return this.currency.get(userID);
    };
    /**
     * Updates a value of a key
     * @param {Snowflake} userID The ID of the user 
     * @param {object} settings The settings to update 
     */
    public async updateCurrency(userID: Snowflake, settings: Profile) {
        const userProfile = await this.getCurrency(userID);
        return this.currency.set(userID, {
            ...userProfile,
            ...settings
        });
    };
    /**
     * Increases the user's balance
     * @param {Snowflake} userID The ID of the user 
     * @param {"bank" | "wallet"} walletOrBalance Increase balance in wallet or bank 
     * @param {number} increaseTo The number to increase to 
     */
    public async increaseBalance(userID: Snowflake, walletOrBalance: "bank" | "wallet", increaseTo: number) {
        const userProfile = await this.getCurrency(userID);
        return this.currency.set(userID, {
            ...userProfile,
            wallet: walletOrBalance == "wallet" ? userProfile.wallet + increaseTo : userProfile.wallet,
            bank: walletOrBalance == "bank" ? userProfile.bank + increaseTo : userProfile.bank
        });
    };
    /**
     * Increases the message count to 1
     * @param {Snowflake} userID The ID of the user 
     */
    public async increaseCurrencyMessageCount(userID: Snowflake) {
        const userProfile = await this.getCurrency(userID);
        return this.currency.set(userID, {
            ...userProfile,
            messageCount: userProfile.messageCount + 1
        });
    };
    /**
     * Gets the client data
     */
    public getClientData() {
        return this.clientData;
    };
    /**
     * Gets the data of a guild
     * @param {Snowflake} guildID The ID of the guild 
     */
    public async getGuild(guildID: Snowflake): Promise<Guild> {
        const guild = this.guilds.has(guildID) ? this.guilds.get(guildID) : await GuildSchema.findOne({ guildID: guildID });
        if (!this.guilds.has(guildID)) this.guilds.set(guildID, {
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
            suggestionChannelID: guild ? guild.suggestionChannelID : null
        });
        if (!guild) await GuildSchema.create(this.guilds.get(guildID));
        return this.guilds.get(guildID);
    };
    /**
     * Updates guild settings
     * @param {Snowflake} guildID The ID of the guild 
     * @param {object} settings The settings 
     */
    public async updateGuild(guildID: Snowflake, settings: Guild) {
        const guild = await this.getGuild(guildID);
        return this.guilds.set(guildID, {
            ...guild,
            ...settings
        });
    };
    /**
     * Return's a giveaway
     * @param {Snowflake} messageID 
     */
    public async getGiveaway(messageID: Snowflake) {
        const giveaway = this.giveaways.has(messageID) ? this.giveaways.get(messageID) : await GiveawaySchema.findOne({ messageID: messageID });
        if (!this.giveaways.has(messageID) && giveaway) this.giveaways.set(messageID, {
            guildID: giveaway.guildID,
            channelID: giveaway.channelID,
            duration: giveaway.duration,
            endsOn: giveaway.endsOn,
            hasEnded: giveaway.hasEnded,
            hostedBy: this.client.guilds.cache.get(giveaway.guildID).members.cache.get(giveaway.hostedBy as string).user,
            messageID: messageID,
            prize: giveaway.prize,
            startsOn: giveaway.startsOn,
            winners: giveaway.winners
        });
        return this.giveaways.get(messageID);
    };
    /**
     * Updates a giveaway
     * @param {object} settings The settings to update
     */
    public async updateGiveaway(messageID: Snowflake, settings: Giveaway) {
        const giveaway = await this.getGiveaway(messageID);
        if (!giveaway) return;
        return this.giveaways.set(messageID, {
            ...giveaway,
            ...settings
        });
    };
};