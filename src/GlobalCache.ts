import { Collection, Snowflake } from "discord.js";
import CurrencySchema, { Profile } from "@models/profile";
import LevelSchema, { Level } from "@models/level";
import ClientDataSchema, { ClientData } from "@models/clientData";
import GuildSchema, { Guild, CustomCommand } from "@models/guild";
import GalaxyAlpha from "@root/Client";
import GiveawaySchema, { Giveaway } from "@models/Giveaways/giveaways";
import TicketSchema, { Ticket } from "./Models/ticket";

export default class GlobalCache {
    constructor(private client: GalaxyAlpha) {
        this.client.once("ready", async () => {
            const results = await ClientDataSchema.findById(this.client.dataSchemaObjectId);
            if (!results) throw new Error("Cannot find the client data schema!");
            this.clientData = {
                blockedUser: results.blockedUser
            };
            for (const guild of this.client.guilds.cache.values()) await client.cache.getGuild(guild.id);
            for (const guild of this.guilds.values()) {
                for (const command of guild.customCommands) {
                    this.customCommands.set(`${guild.guildID}-${command.name}`, {
                        aliases: command.aliases || [],
                        allowedChannels: command.allowedChannels || [],
                        allowedRoles: command.allowedRoles || [],
                        answers: command.answers || [],
                        guildID: guild.guildID,
                        name: command.name,
                        notAllowedChannels: command.notAllowedChannels || [],
                        notAllowedRoles: command.notAllowedRoles || [],
                        random: command.random
                    });
                    if (command.aliases.length > 0) command.aliases.map(alias => this.customCommandAliases.set(`${guild.guildID}-${alias}`, command.name));
                };
            };
            for (const user of await LevelSchema.find()) await client.cache.getLevelandMessages(user.guildID, user.userID);
            for (const currency of await CurrencySchema.find()) await client.cache.getCurrency(currency.userID);
            for (const ticket of await TicketSchema.find()) await client.cache.getTicket(ticket.channelID);
            console.log("[Global Cache => Manager] Cached data of MongoDB");
        });
    };
    //COLLECTIONS\\
    public currency: Collection<string, Profile> = new Collection();
    public levels: Collection<string, Level> = new Collection();
    public guilds: Collection<string, Guild> = new Collection();
    public clientData: ClientData = {};
    public giveaways: Collection<string, Giveaway> = new Collection();
    public tickets: Collection<string, Ticket> = new Collection();
    public customCommands: Collection<string, CustomCommand> = new Collection();
    public customCommandAliases: Collection<string, string> = new Collection();
    public rateLimis: Collection<string, string> = new Collection();
    public mutes: Collection<string, number> = new Collection();
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
            if (giveaway.hasEnded) this.giveaways.delete(giveaway.messageID);
            else await GiveawaySchema.findOneAndUpdate({ guildID: giveaway.guildID }, {
                ...giveaway,
                hostedBy: giveaway.hostedBy.id
            });
        });
        if (this.tickets.first()) this.tickets.forEach(async ticket => {
            await TicketSchema.findOneAndUpdate({ channelID: ticket.channelID }, ticket, {
                upsert: true
            });
        });
        const guilds: Collection<string, Array<CustomCommand>> = new Collection();
        if (this.customCommands.first()) this.customCommands.forEach(async customCommand => {
            const guildID = customCommand.guildID;
            const guildCollection = guilds.get(guildID);
            if (!guildCollection) guilds.set(guildID, [customCommand]);
            guilds.get(guildID).push(customCommand);
        });
        if (guilds.first()) guilds.forEach(async guild => {
            await GuildSchema.findOneAndUpdate({ guildID: guild[0].guildID }, {
                customCommands: guild
            }, {
                upsert: true
            });
        });
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
     * Increases the message count to `1`
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
            chatBot: guild ? guild.chatBot : [],
            customCommands: guild ? guild.customCommands : [],
            ticket: guild ? guild.ticket : {
                categoryID: null,
                managerRoleID: null
            },
            suggestion: guild ? guild.suggestion : {
                channelID: null,
                managerRoleID: null
            }
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
    /**
     * Get's data of a ticket 
     * @param {Snowflake} channelID The ID of the channel
     * @param {object?} optionalData Optional data, if no ticket was found
     */
    public async getTicket(channelID: string, optionalData?: {
        categoryID: string,
        userID: string
    }) {
        const ticket = this.tickets.has(channelID) ? this.tickets.get(channelID) : await TicketSchema.findOne({ channelID: channelID });
        if (!this.tickets.has(channelID)) this.tickets.set(channelID, {
            categoryID: ticket ? ticket.categoryID : optionalData ? optionalData.categoryID : null,
            channelID: channelID,
            userID: ticket ? ticket.userID : optionalData ? optionalData.userID: null,
            createdAt: ticket ? ticket.createdAt : new Date()
        });
        const newTicket = this.tickets.get(channelID);
        return newTicket.categoryID && newTicket.userID ? newTicket : null;
    };
    /**
     * Get's a custom command
     * @param {Snowflake} guildID The ID of the guild
     * @param {CustomCommand} customCommand The custom command name or an alias of the command
     */
    public async getCustomCommand(guildID: Snowflake, customCommand: string) {
        const key = `${guildID}-${customCommand.toLowerCase()}`;
        return this.customCommands.has(key) ? this.customCommands.get(key) : this.customCommands.get(this.customCommandAliases.get(key));
    };
};