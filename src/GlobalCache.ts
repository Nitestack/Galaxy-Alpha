import Discord from "discord.js";
import GalaxyAlpha from "@root/Client";
import MessageSchema from "@models/messageCount";
import CurrencySchema from "@models/profile";
import { Bot } from "@root/index";

interface Currency {
    userID: string;
    bank: number;
    wallet: number;
    messageCount: number;
};

interface Messages {
    userID: string;
    guildID: string;
    messageCount: number;
};

interface Profile {
    userID: string;
    bank: number;
    wallet: number;
    messageCount: number;
};

export default class GlobalCache {
    private client: GalaxyAlpha = Bot;
    constructor(client: GalaxyAlpha) {
        this.client = client;
        this.client.once("ready", () => {
            setInterval(() => {
                if (this.messages.first()) {
                    this.messages.forEach(async message => {
                        await MessageSchema.findOneAndUpdate({
                            messageUserID: message.userID,
                            messageGuildID: message.guildID
                        }, {
                            messageCount: message.messageCount
                        }, {
                            upsert: true
                        });
                    });
                };
                if (this.currency.first()) {
                    this.currency.forEach(async currency => {
                        await CurrencySchema.findOneAndUpdate({
                            profileID: currency.userID
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
                this.messages.clear();
            }, 1800000);
        });
    };
    //COLLECTIONS\\
    public currency: Discord.Collection<string, Currency> = new Discord.Collection();
    public messages: Discord.Collection<string, Messages> = new Discord.Collection();
    //GET METHODS\\
    public async getMessages(guildID: string, userID: string): Promise<number> {
        const Message = await MessageSchema.findOne({
            messageGuildID: guildID,
            messageUserID: userID
        });
        if (Message) return Message.messageCount;
        if (!Message) return 0;
    };
    public async getCurrency(userID: string): Promise<Profile> {
        const profile = await CurrencySchema.findOne({ profileID: userID });
        if (profile) return ({
            userID: userID,
            bank: profile.bank,
            wallet: profile.wallet,
            messageCount: profile.messageCount
        } as Profile);
        if (!profile) return ({
            userID: userID,
            bank: 0,
            wallet: 0,
            messageCount: 0
        });
    };
};