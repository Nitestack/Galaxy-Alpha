import { Collection } from "discord.js";
import CurrencySchema, { Profile } from "@models/profile";
import LevelSchema, { Level } from "@models/level";
import ClientDataSchema, { ClientData } from "@models/clientData";
import GuildSchema, { Guild } from "@models/guild";
import GalaxyAlpha from "@root/Client";

export default class GlobalCache {
    constructor(private client: GalaxyAlpha) {
        this.client.once("ready", async () => {
            const results = await ClientDataSchema.findById(this.client.dataSchemaObjectId);
            if (!results) throw new Error("Cannot find the client data schema!");
            this.clientData = {
                autoPollChannels: results.autoPollChannels,
                autoPublishChannels: results.autoPublishChannels,
                blockedUser: results.blockedUser
            };
        });
    };
    //COLLECTIONS\\
    public currency: Collection<string, Profile> = new Collection();
    public levels: Collection<string, Level> = new Collection();
    public guilds: Collection<string, Guild> = new Collection();
    public clientData: ClientData = {};
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
        this.currency.clear();
        this.levels.clear();
        this.guilds.clear();
    };
    /**
     * Gets the level, xp and messages of an user
     * @param {string} guildID The ID of the guild 
     * @param {string} userID The ID of the user
     */
    public async getLevelandMessages(guildID: string, userID: string): Promise<Level> {
        const key = `${userID}-${guildID}`;
        const LevelandMessages = this.levels.has(key) ? this.levels.get(key) : await LevelSchema.findOne({ guildID: guildID, userID: userID }).catch(err => console.log(err));
        if (LevelandMessages && !this.levels.has(key)) this.levels.set(key, {
            userID: LevelandMessages.userID,
            guildID: LevelandMessages.guildID,
            level: LevelandMessages.level,
            xp: LevelandMessages.xp,
            messages: LevelandMessages.messages,
            lastUpdated: new Date()
        });
        else this.levels.set(key, {
            userID: userID,
            guildID: guildID,
            level: 0,
            xp: 0,
            messages: 0,
            lastUpdated: new Date()
        });
        return this.levels.get(key);
    };
    /**
     * Gets a currency profile of an user
     * @param {string} userID The ID of the user 
     */
    public async getCurrency(userID: string): Promise<Profile> {
        const profile = this.currency.has(userID) ? this.currency.get(userID) : await CurrencySchema.findOne({ userID: userID }).catch(err => console.log(err));
        if (profile && !this.currency.has(userID)) this.currency.set(userID, {
            userID: profile.userID,
            bank: profile.bank,
            wallet: profile.wallet,
            messageCount: profile.messageCount,
            passive: profile.passive,
            items: profile.items,
            profileCreatedAt: profile.profileCreatedAt
        });
        else this.currency.set(userID, {
            userID: userID,
            bank: 0,
            wallet: 0,
            messageCount: 0,
            passive: false,
            items: [],
            profileCreatedAt: new Date()
        });
        return this.currency.get(userID);
    };
    /**
     * Updates a value of a key
     * @param {string} userID The ID of the user 
     * @param {object} settings The settings to update 
     */
    public async updateCurrency(userID: string, settings: {
        wallet?: number,
        bank?: number,
        messageCount?: number,
        passive?: boolean,
        items?: Array<{
            name: string,
            aliases?: Array<string>,
            amount: number,
            worth: number,
            category: "Loot" | "Utilty"
        }>
    }) {
        const userProfile = await this.getCurrency(userID);
        return this.currency.set(userID, {
            ...userProfile,
            ...settings
        });
    };
    public async increaseBalance(userID: string, walletOrBalance: "bank" | "wallet", increaseTo: number){
        const userProfile = await this.getCurrency(userID);
        return this.currency.set(userID, {
            ...userProfile,
            wallet: walletOrBalance == "wallet" ? userProfile.wallet + increaseTo : userProfile.wallet,
            bank: walletOrBalance == "bank" ? userProfile.bank + increaseTo : userProfile.bank
        });
    };
    /**
     * Increases the message count to 1
     * @param userID 
     */
    public async increaseCurrencyMessageCount(userID: string){
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
     * @param {string} guildID The ID of the guild 
     */
    public async getGuild(guildID: string): Promise<Guild> {
        if (!this.guilds.has(guildID)) {
            const results = await GuildSchema.findOne({ guildID: guildID }).catch(err => console.log(err));
            if (results) this.guilds.set(guildID, {
                guildID: results.guildID,
                prefix: results.prefix,
                modLogChannelID: results.modLogChannelID,
                modLogChannelWebhookToken: results.modLogChannelWebhookToken,
                modLogChannelWebhookID: results.modLogChannelWebhookID,
                muteRoleID: results.muteRoleID,
                memberRoleID: results.memberRoleID,
                ticketCategoryID: results.ticketCategoryID,
                ticketManagerRoleID: results.ticketManagerRoleID,
                giveawayManagerRoleID: results.giveawayManagerRoleID,
                giveawayBlacklistedRoleID: results.giveawayBlacklistedRoleID,
                giveawayByPassRoleID: results.giveawayByPassRoleID,
                serverManagerRoleID: results.serverManagerRoleID,
                welcomeMessageType: results.welcomeMessageType,
                welcomeMessage: results.welcomeMessage,
                welcomeChannelID: results.welcomeChannelID,
                modMailManagerRoleID: results.modMailManagerRoleID,
                modMailLogChannelID: results.modMailLogChannelID,
                modMailCategoryID: results.modMailCategoryID,
                DJRoleID: results.DJRoleID,
                reactionRoles: results.reactionRoles
            });
            else return null;
        };
        return this.guilds.get(guildID);
    };
};