import GalaxyAlpha from "@root/Client";
import Feature, { FeatureRunner } from "@root/Feature";
import { APIMessage, APIMessageContentResolvable, MessageTarget, NewsChannel, TextChannel } from "discord.js";

export default class SlashCommandFeature extends Feature {
    constructor() {
        super({
            name: "slashcommand"
        });
    };
    run: FeatureRunner = async (client) => {
        client.ws.on("INTERACTION_CREATE", async interaction => {
            const args = this.getArrayFromOptions(interaction.data.options);
            const infos = {
                member: client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id),
                guild: client.guilds.cache.get(interaction.guild_id),
                channel: client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id) as TextChannel | NewsChannel
            }
            const usedCommand = interaction.data.name.toLowerCase();
            const command = client.slashCommands.get(usedCommand);
            if (!command) return;
            try {
                await command.run(client, interaction, args, infos);
                command.interactionResponse(interaction, command);
            } catch(error) {
                console.log(error);
            };
        });
    };
    private async createAPIMessage(client: GalaxyAlpha, interaction, content: APIMessageContentResolvable) {
        const { data, files } = await APIMessage.create(
            client.channels.resolve(interaction.channel_id) as MessageTarget,
            content
        ).resolveData().resolveFiles();
        return { ...data, files };
    };
    private getArrayFromOptions(options?: Array<{ name: string, value: string | number }>): {} {
        const args: {} = {};
        if (!options) return args;
        for (const option of options) args[option.name] = option.value;
        return args;
    }
};
