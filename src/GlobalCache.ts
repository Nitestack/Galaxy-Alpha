import Discord from "discord.js";
import CurrencySchema, { Profile } from "@models/profile";
import LevelSchema, { Level } from "@models/level";
import ClientDataSchema, { ClientData } from "@models/clientData";
import GuildSchema, { Guild } from "@models/guild";
import GalaxyAlpha from "@root/Client";

export default class GlobalCache {
    private client: GalaxyAlpha;
    constructor(client: GalaxyAlpha) {
        this.client = client;
        this.client.on("ready", async () => {
            const results = await ClientDataSchema.findById(this.client.dataSchemaObjectId);
            if (!results) throw new Error("Cannot find the client data schema!");
            this.clientData = results;
        });
    };
    //COLLECTIONS\\
    public currency: Discord.Collection<string, Profile> = new Discord.Collection();
    public levels: Discord.Collection<string, Level> = new Discord.Collection();
    public guilds: Discord.Collection<string, Guild> = new Discord.Collection();
    public clientData: ClientData = ({} as ClientData);
    //METHODS\\
    public async clearCacheAndSave() {
        if (this.levels.first()) {
            this.levels.forEach(async message => {
                await LevelSchema.findOneAndUpdate({
                    userID: message.userID,
                    guildID: message.guildID
                }, {
                    messages: message.messages,
                    xp: message.xp,
                    level: message.level,
                    lastUpdated: new Date()
                }, {
                    upsert: true
                });
            });
        };
        if (this.currency.first()) {
            this.currency.forEach(async currency => {
                await CurrencySchema.findOneAndUpdate({
                    userID: currency.userID
                }, {
                    bank: currency.bank,
                    wallet: currency.wallet,
                    messageCount: currency.messageCount
                }, {
                    upsert: true
                });
            });
        };
        if (this.clientData) {
            await ClientDataSchema.findByIdAndUpdate(this.client.dataSchemaObjectId, {
                autoPublishChannels: this.clientData.autoPublishChannels,
                autoPollChannels: this.clientData.autoPollChannels,
                blockedUser: this.clientData.blockedUser
            }, {
                upsert: false
            });
        };
        if (this.guilds.first()) {
            this.guilds.forEach(async guild => {
                await GuildSchema.findOneAndUpdate({
                    guildID: guild.guildID
                }, {
                    guildPrefix: guild.guildPrefix,
                    logChannelID: guild.logChannelID,
	                muteRole: guild.muteRole,
	                memberRole: guild.memberRole,
	                ticketCategoryID: guild.ticketCategoryID,
	                ticketRole: guild.ticketRole,
	                giveawayManager: guild.giveawayManager,
	                giveawayByPass: guild.giveawayByPass,
	                giveawayBlackListed: guild.giveawayBlackListed,
	                welcomeMessage: guild.welcomeMessage,
	                welcomeEmbed: guild.welcomeEmbed,
	                welcomeChannelID: guild.welcomeChannelID,
	                modMailManager: guild.modMailManager,
	                modMailCategory: guild.modMailCategory,
	                modMailLogChannel: guild.modMailLogChannel
                }, {
                    upsert: true
                });
            });
        };
        this.currency.clear();
        this.levels.clear();
        this.guilds.clear();
    };
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
    public async getCurrency(userID: string): Promise<Profile> {
        const profile = this.currency.has(userID) ? this.currency.get(userID) : await CurrencySchema.findOne({ userID: userID });
        if (profile) this.currency.set(userID, profile);
        else this.currency.set(userID, ({
            userID: userID,
            bank: 0,
            wallet: 0,
            messageCount: 0
        } as Profile));
        return this.currency.get(userID);
    };
    public getClientData() {
        return this.clientData;
    };
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