import Feature, { FeatureRunner } from "@root/Feature";
import GiveawaySchema from "@models/Giveaways/giveaways";
import DropSchema from "@models/Giveaways/drops";

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
                    return guildSettings.reactionRoles.splice(guildSettings.reactionRoles.indexOf(reactionRole), 1);
                };
            };
        });
        client.on("channelDelete", (channel) => {
        });
    };
};