"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDrop = exports.dropManager = void 0;
const drops_1 = __importDefault(require("@models/Giveaways/drops"));
exports.dropManager = `🎁 Drop Manager`;
class Drop {
    constructor(client) {
        this.client = client;
    }
    ;
    async create(options, message) {
        if (!options.prize)
            throw new Error("You didn't provide a prize.");
        if (!options.guildID)
            throw new Error("You didn't provide a guild ID.");
        if (!options.channelID)
            throw new Error("You didn't provide a channel ID.");
        if (!options.createdBy)
            throw new Error("You didn't provide who the drop was created by.");
        const channel = this.client.guilds.cache.get(options.guildID).channels.cache.filter(channel => channel.type == 'news' || channel.type == 'text').get(options.channelID);
        const dropEmbed = this.client.createEmbed()
            .setTitle(`${options.prize}`)
            .setDescription(`${this.client.arrowEmoji} **First one, who reacts with 🎉\nto this message, wins the drop!**\n**${this.client.memberEmoji} Hosted By:** ${options.createdBy}`)
            .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`);
        channel.send(`${this.client.galaxyAlphaEmoji}   **DROP**   ${this.client.galaxyAlphaEmoji}`, dropEmbed).then(async (msg) => {
            await msg.react("🎉");
            const newDrop = new drops_1.default({
                guildID: options.guildID,
                channelID: options.channelID,
                prize: options.prize,
                createdBy: options.createdBy,
                timeCreated: Date.now(),
                messageID: msg.id
            });
            newDrop.save().catch(err => console.log(err));
            const filter = (reaction, user) => reaction.emoji.name == '🎉';
            const collector = msg.createReactionCollector(filter);
            collector.on('collect', async (reaction, user) => {
                if (user.id == message.author.id) {
                    msg.reactions.cache.get("🎉").users.remove(user.id);
                    message.author.send(this.client.createRedEmbed()
                        .setTitle(exports.dropManager)
                        .setDescription(`Your drop entry has been denied!
                            You cannot enter the drop because you are the host of this drop!`)
                        .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`));
                }
                ;
                if (user.bot)
                    msg.reactions.cache.get("🎉").users.remove(user.id);
                if (user.id != message.author.id && !user.bot) {
                    collector.stop();
                    msg.edit(`${this.client.galaxyAlphaEmoji}   **DROP ENDED**   ${this.client.galaxyAlphaEmoji}`, dropEmbed.setDescription(`🏅 **Winner:** ${user}\n${this.client.memberEmoji} **Hosted By:** ${options.createdBy}`));
                    msg.reactions.cache.get("🎉").users.remove(user.id);
                    msg.channel.send(`${user}`).then(msg => msg.delete({ timeout: 1 }));
                    await msg.channel.send(this.client.createEmbed()
                        .setTitle(exports.dropManager)
                        .setDescription(`Congratulations, ${user}! As you were the first, who reacted to the drop message, you won the **${options.prize}**!`)
                        .addField('Additional Links', `[Invite Galaxy Alpha](${this.client.inviteLink}) | [Galaxy Alpha Support](https://discord.gg/qvbFn6bXQX)`));
                }
                ;
            });
            collector.on('end', (collected) => {
                deleteDrop(msg.id);
            });
        });
    }
    ;
    async list(guildID) {
        const guild = this.client.guilds.cache.get(guildID);
        if (guild) {
            const drops = await drops_1.default.find({ guildID: guildID });
            if (drops.length < 1)
                return false;
            const finalDrops = drops.slice(0, 5);
            const array = [];
            finalDrops.map(i => array.push({
                createdBy: i.createdBy,
                prize: i.prize,
                channel: guild.channels.cache.get(i.channelID).toString() ? guild.channels.cache.get(i.channelID).toString() : "Unknown channel"
            }));
            return array;
        }
        else
            return false;
    }
    ;
    async end(messageID) {
        const drop = await drops_1.default.findOne({ messageID: messageID });
        if (!drop)
            return false;
        const channel = this.client.channels.cache.get(drop.channelID);
        if (!channel)
            return false;
        channel.messages.fetch(messageID).then(message => message.edit(`${this.client.galaxyAlphaEmoji}   **DROP ENDED**   ${this.client.galaxyAlphaEmoji}`, message.embeds[0].setDescription(`🏅 **Winner:** Nobody reacted!\n${this.client.memberEmoji} **Hosted By:** ${drop.createdBy}`)));
        deleteDrop(drop.messageID);
        return true;
    }
    ;
}
exports.default = Drop;
;
async function deleteDrop(messageID) {
    return await drops_1.default.findOneAndDelete({
        messageID: messageID
    });
}
exports.deleteDrop = deleteDrop;
;
//# sourceMappingURL=Drop.js.map