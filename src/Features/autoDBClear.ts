import Feature, { FeatureRunner } from "@root/Feature";
import GiveawaySchema from "@models/Giveaways/giveaways";
import DropSchema from "@models/Giveaways/drops";
import LevelSchema from "@models/level";
import { GuildChannel, DMChannel } from "discord.js";
import CounterSchema from "@models/counter";

export default class AutoDBClearFeature extends Feature {
    constructor() {
        super({
            name: "autodbclear"
        });
    };
    run: FeatureRunner = async (client) => {
        client.on("messageDelete", async (message) => {
            if (await GiveawaySchema.findOne({ messageID: message.id })) await GiveawaySchema.findOneAndDelete({ messageID: message.id });
            if (await DropSchema.findOne({ messageID: message.id })) await DropSchema.findOneAndDelete({ messageID: message.id });
            const guildSettings = await client.cache.getGuild(message.guild.id);
            if (!guildSettings.reactionRoles || !guildSettings.reactionRoles[0]) return;
            for (const reactionRole of guildSettings.reactionRoles) {
                if (Object.keys(reactionRole).includes(message.id)) {
                    guildSettings.reactionRoles.filter(reactionRoleFilter => reactionRoleFilter != reactionRole);
                };
            };
        });
        client.on("channelDelete", async (channel: DMChannel | GuildChannel)=> {
            if (channel.type == "dm") return;
            const guildSettings = await client.cache.getGuild(channel.guild.id);
            if (Object.values(guildSettings).includes(channel.id)) {

            };
            const counter = await CounterSchema.findOne({ guildID: channel.guild.id });
            if (Object.values(counter).includes(channel.guild.id)) {

            };
        });
        client.on("guildMemberRemove", async member => {
            await LevelSchema.findOneAndDelete({ guildID: member.guild.id, userID: member.id });
        });
        client.on("emojiDelete", async emoji => {
            const guildSettings = await client.cache.getGuild(emoji.guild.id);
            for (const reactionRole of guildSettings.reactionRoles){
                if (Object.values(reactionRole).includes(emoji.createdTimestamp ? reactionRole.emojiID : emoji.name.toString())){
                    guildSettings.reactionRoles.filter(reactionRoleFilter => reactionRoleFilter != reactionRole);
                };
            };
        });
    };
};