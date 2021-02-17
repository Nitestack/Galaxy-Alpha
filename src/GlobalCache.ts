import { Collection } from "discord.js";
import CurrencySchema, { Profile } from "@models/profile";
import LevelSchema, { Level } from "@models/level";
import ClientDataSchema, { ClientData } from "@models/clientData";
import GuildSchema, { Guild } from "@models/guild";
import GalaxyAlpha from "@root/Client";

export default class GlobalCache {
    private client: GalaxyAlpha;
    constructor(client: GalaxyAlpha) {
        this.client = client;
        this.client.once("ready", async () => {
            const results = await ClientDataSchema.findById(this.client.dataSchemaObjectId);
            if (!results) throw new Error("Cannot find the client data schema!");
            this.clientData = results;
        });
    };
    //COLLECTIONS\\
    public currency: Collection<string, Profile> = new Collection();
    public levels: Collection<string, Level> = new Collection();
    public guilds: Collection<string, Guild> = new Collection();
    public clientData: ClientData = ({} as ClientData);
    //METHODS\\
    /**
     * Clears the cache and uploads the caches data to the database
     */
    public async clearCacheAndSave() {
        if (this.levels.first()) {
            this.levels.forEach(async message => {
                await LevelSchema.findOneAndUpdate({
                    userID: message.userID,
                    guildID: message.guildID
                }, message, {
                    upsert: true
                });
            });
        };
        if (this.currency.first()) {
            this.currency.forEach(async currency => {
                await CurrencySchema.findOneAndUpdate({
                    userID: currency.userID
                }, currency, {
                    upsert: true
                });
            });
        };
        if (this.clientData) {
            await ClientDataSchema.findByIdAndUpdate(this.client.dataSchemaObjectId, this.clientData, {
                upsert: false
            });
        };
        if (this.guilds.first()) {
            this.guilds.forEach(async guild => {
                await GuildSchema.findOneAndUpdate({
                    guildID: guild.guildID
                }, guild, {
                    upsert: true
                });
            });
        };
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
        const LevelandMessages = this.levels.has(key) ? this.levels.get(key) : await LevelSchema.findOne({ guildID: guildID, userID: userID });
        if (LevelandMessages) this.levels.set(key, LevelandMessages);
        else this.levels.set(key, ({
            userID: userID,
            guildID: guildID,
            level: 0,
            xp: 0,
            messages: 0
        } as Level));
        return this.levels.get(key);
    };
    /**
     * Gets a currency profile of an user
     * @param {string} userID The ID of the user 
     */
    public async getCurrency(userID: string): Promise<Profile> {
        const profile = this.currency.has(userID) ? this.currency.get(userID) : await CurrencySchema.findOne({ userID: userID });
        if (profile) this.currency.set(userID, profile);
        else this.currency.set(userID, ({
            userID: userID,
            bank: 0,
            wallet: 0,
            messageCount: 0,
            items: [{}]
        } as Profile));
        return this.currency.get(userID);
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
        if (!this.guilds.has(guildID)){
            const results = await GuildSchema.findOne({ guildID: guildID });
            if (results){
                this.guilds.set(guildID, results);
            } else return null;
        };
        return this.guilds.get(guildID);
    };
};