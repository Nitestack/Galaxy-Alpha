import Feature, { FeatureRunner } from "@root/Feature";
import { Message, Collection } from "discord.js";

export default class AutoModFeature extends Feature {
    constructor() {
        super({
            name: "automod"
        });
    };
    run: FeatureRunner = async (client) => {
        const spamCollection: Collection<string, {
            lastMessage: Message,
            timer: NodeJS.Timeout,
            messageCount: number
        }> = new Collection();
        client.on("message", async message => {
            if (message.author.bot || message.channel.type == "dm") return;
            const autoModerator = "🛠️ Automoderator";
            const guildSettings = await client.cache.getGuild(message.guild.id);
            const DIFF = guildSettings.autoMod.spam.cooldown;
            const TIME = guildSettings.autoMod.spam.timer;
            const LIMIT = guildSettings.autoMod.spam.messageLimit;
            if (spamCollection.has(`${message.author.id}-${message.guild.id}`)) {
                const userData = spamCollection.get(`${message.author.id}-${message.guild.id}`);
                const { lastMessage, timer, messageCount } = userData;
                const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                let msgCount = userData.messageCount;
                if (difference > DIFF){
                    clearTimeout(timer);
                    userData.messageCount = 1;
                    userData.lastMessage = message;
                    userData.timer = setTimeout(() => {
                        spamCollection.delete(message.author.id);
                    }, TIME);
                    spamCollection.set(`${message.author.id}-${message.guild.id}`, userData);
                } else {
                    msgCount++;
                    if (messageCount == LIMIT) {
                        return message.channel.send(client.createRedEmbed()
                            .setTitle(autoModerator)
                            .setDescription(`${message.author}, do not spam!`));
                    } else {
                        userData.messageCount = msgCount;
                        spamCollection.set(`${message.author.id}-${message.guild.id}`, userData);
                    };
                };
            } else {
                let fn = setTimeout(() => {
                    spamCollection.delete(message.author.id);
                }, TIME);
                spamCollection.set(`${message.author.id}-${message.guild.id}`, {
                    messageCount: 1,
                    lastMessage: message,
                    timer: fn
                });
            };
            for (const blacklistWord of guildSettings.autoMod.blacklistedWords) {
                if (message.content.toLowerCase().includes(blacklistWord.toLowerCase())) {
                    if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete();
                    return message.channel.send(client.createRedEmbed()
                        .setTitle(autoModerator)
                        .setDescription(`${message.author}, do not use blacklisted words!`));
                };
            };
            if (message.attachments.first() && guildSettings.autoMod.deletingImages) {
                if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete();
                return message.channel.send(client.createRedEmbed()
                    .setTitle(autoModerator)
                    .setDescription(`${message.author}, do not post any pictures!`));
            };
            if (message.content.toLowerCase().includes("https://") && guildSettings.autoMod.deletingLinks) {
                if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete();
                return message.channel.send(client.createRedEmbed()
                    .setTitle(autoModerator)
                    .setDescription(`${message.author}, do not post any links!`));
            };
        });
    };
};