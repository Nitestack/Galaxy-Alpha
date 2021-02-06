import Discord from "discord.js";
import CurrencySchema from "@models/profile";
import LevelSchema from "@models/level";

interface Level {
    userID: string;
    guildID: string;
    level: number;
    xp: number;
    messages: number;
};

interface Profile {
    userID: string;
    bank: number;
    wallet: number;
    messageCount: number;
};

export default class GlobalCache {
    //COLLECTIONS\\
    public currency: Discord.Collection<string, Profile> = new Discord.Collection();
    public levels: Discord.Collection<string, Level> = new Discord.Collection();
    //METHODS\\
    public clearCacheAndSave() {
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
        this.currency.clear();
        this.levels.clear();
    };
    public async getLevelandMessages(guildID: string, userID: string): Promise<Level> {
        const key = `${userID}-${guildID}`;
        const LevelandMessages = this.levels.has(key) ? this.levels.get(key) : await LevelSchema.findOne({ guildID: guildID, userID: userID });
        if (LevelandMessages) this.levels.set(key, {
            userID: userID,
            guildID: guildID,
            level: LevelandMessages.level,
            xp: LevelandMessages.xp,
            messages: LevelandMessages.messages
        });
        else this.levels.set(key, {
            userID: userID,
            guildID: guildID,
            level: 0,
            xp: 0,
            messages: 0
        });
        return this.levels.get(key);
    };
    public async getCurrency(userID: string): Promise<Profile> {
        const profile = this.currency.has(userID) ? this.currency.get(userID) : await CurrencySchema.findOne({ userID: userID });
        if (profile) this.currency.set(userID, {
            userID: userID,
            bank: profile.bank,
            wallet: profile.wallet,
            messageCount: profile.messageCount
        } as Profile);
        else this.currency.set(userID, {
            userID: userID,
            bank: 0,
            wallet: 0,
            messageCount: 0
        });
        return this.currency.get(userID);
    };
};