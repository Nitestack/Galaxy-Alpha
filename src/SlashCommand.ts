import { Guild, GuildMember, MessageEmbed, MessageFlags, NewsChannel, TextChannel } from "discord.js";
import GalaxyAlpha from "@root/Client";
import client from "@root/index";

interface SlashCommandInfos {
    name: string;
    description: string;
    type: "message" | "deferredResponse";
    data?: InteractionApplicationCommandCallbackData;
    options?: Array<ApplicationCommandOption>;
};

interface ApplicationCommandOption {
    /**
     * `1` = `SUB_COMMAND`, `2` = `SUB_COMMAND_GROUP`, `3` = `STRING`, `4` = `NUMBER`, `5` = `BOOLEAN`, `6` = `USER`, `7` = `CHANNEL`, `8` = `ROLE`
     */
    type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    name: string,
    description: string,
    required?: boolean,
    choices?: Array<{
        name: string,
        value: string | number
    }>,
    options?: Array<ApplicationCommandOption>
};

export interface SlashCommandRunner {
    (client: GalaxyAlpha, interaction, args: {}, infos: { member: GuildMember, guild: Guild, channel: TextChannel | NewsChannel }): Promise<unknown>;
};

export default class SlashCommand {
    public client: GalaxyAlpha = client;
    public name: string;
    public description: string;
    public type: "message" | "deferredResponse";
    public data?: InteractionApplicationCommandCallbackData;
    public options?: Array<ApplicationCommandOption>;
    constructor(infos: SlashCommandInfos) { 
        this.name = infos.name;
        this.description = infos.description;
        this.type = infos.type;
        this.data = {
            tts: false,
            content: null,
            embeds: null,
            allowedMentions: "everyone",
            flags: null,
            ...infos.data
        };
        this.options = infos.options;
    };
    public interactionResponse(interaction, slashCommand: SlashCommand) {
        return this.client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: slashCommand.type == "message" ? 4 : 5,
                data: {
                    ...slashCommand.data,
                    embeds: slashCommand.data.embeds ? (Array.isArray(slashCommand.data.embeds) ? slashCommand.data.embeds.map(embed => embed.toJSON()) : [slashCommand.data.embeds.toJSON()]) : null
                }
            }
        });
    };
    public run: SlashCommandRunner = async (client: GalaxyAlpha, interaction, args: {}, infos: { member: GuildMember, guild: Guild, channel: TextChannel | NewsChannel }): Promise<unknown> => {
        throw new Error(`${this.constructor.name} doesn't have a run() method.`);
    };
};

interface InteractionApplicationCommandCallbackData {
    tts?: boolean,
    content?: string,
    embeds?: MessageEmbed | Array<MessageEmbed>,
    allowedMentions?: "roles" | "users" | "everyone",
    flags?: MessageFlags
};