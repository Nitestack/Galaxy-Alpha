import GalaxyAlpha from "@root/Client";
import Feature, { FeatureRunner } from "@root/Feature";
import { APIMessage, APIMessageContentResolvable, MessageEmbed, MessageTarget, NewsChannel, TextChannel } from "discord.js";
import SlashCommand from "@root/SlashCommand";

export default class SlashCommandFeature extends Feature {
    constructor() {
        super({
            name: "slashcommand"
        });
    };
    run: FeatureRunner = async (client) => {
        //@ts-ignore
        client.ws.on("INTERACTION_CREATE", async interaction => {
            const usedCommand = interaction.data.name.toLowerCase();
            const command = client.slashCommands.get(usedCommand);
            if (!command) return;
            command.id = interaction.data.id;
            const infos = {
                member: interaction.member ? client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id) : null,
                guild: interaction.guild_id ? client.guilds.cache.get(interaction.guild_id) : null,
                channel: client.channels.cache.get(interaction.channel_id) as TextChannel | NewsChannel,
                user: interaction.user ? client.users.cache.get(interaction.user.id) : null
            };
            if (infos.member && client.cooldowns.has(`${infos.member.id}-${command.name}`)) return await this.send(interaction, client.createRedEmbed()
                .setTitle('🕐 Cooldown Manager')
                .setDescription(`You are on a cooldown!\nYou have to wait ${client.humanizer(client.cooldowns.get(`${infos.member ? infos.member.id : infos.user.id}-${command.name}`) - Date.now(), { units: ["mo", "w", "d", "h", "m", "s"], round: true })}`));
            //SLASHCOMMAND RUNNER\\
            try {
                await command.run(client, interaction, this.getArrayFromOptions(interaction.data.options), infos);
                SlashCommand.createInteractionResponse(interaction, command);
            } catch (error) {
                if (error && infos.member && client.developers.includes(infos.member.id)) {
                    await this.send(interaction, client.createRedEmbed().setTitle("ERROR").setDescription(`${error}`));
                    console.log(error);
                };
            };
            //COOLDOWN\\
            if (infos.member ? !client.developers.includes(infos.member.id) : infos.guild.id == client.supportGuild.id ? !client.developers.includes(infos.member.id) : true) {
                client.cooldowns.set(`${infos.member}-${command.name}`, Date.now() + client.ms(command.cooldown));
                setTimeout(() => {
                    client.cooldowns.delete(`${infos.member}-${command.name}`);
                }, client.ms(command.cooldown));
                return;
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
    };
    private async send(interaction, content: string | MessageEmbed) {
        return SlashCommand.createInteractionResponse(interaction, new SlashCommand({
            name: "any",
            description: "any",
            type: "message",
            data: typeof content == "string" ? { content: content } : { embeds: content }
        }));
    };
};
