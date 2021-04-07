import { GuildMember, MessageEmbed, MessageFlags, NewsChannel, TextChannel, User, PermissionString } from "discord.js";
import GalaxyAlpha from "@root/Client";
import client from "@root/index";
import { Guild } from "@models/guild";

interface SlashCommandInfos {
    name: string;
    description: string;
    type: "message" | "deferredResponse";
    data?: InteractionApplicationCommandCallbackData;
    options?: Array<ApplicationCommandOption>;
    cooldown?: string;
    userPermissions?: Array<PermissionString>;
	clientPermissions?: Array<PermissionString>;
	requiredRoles?: Array<keyof Guild>;
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
    (client: GalaxyAlpha, interaction, args: {}, infos: { member?: GuildMember, guild?, user?: User, channel: TextChannel | NewsChannel }): Promise<unknown>;
};

export default class SlashCommand {
    public id: string;
    public name: string;
    public description: string;
    public type: "message" | "deferredResponse";
    public data?: InteractionApplicationCommandCallbackData;
    public options?: Array<ApplicationCommandOption>;
    public cooldown?: string;
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
        this.cooldown = infos.cooldown ? infos.cooldown : "3s";
    };
    public static createInteractionResponse(interaction, slashCommand: SlashCommand) {
        //@ts-ignore
        return client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: slashCommand.type == "message" ? 4 : 5,
                data: {
                    ...slashCommand.data,
                    embeds: slashCommand.data.embeds ? (Array.isArray(slashCommand.data.embeds) ? slashCommand.data.embeds.map(embed => embed.toJSON()) : [slashCommand.data.embeds.toJSON()]) : null
                }
            }
        });
    };
    public run: SlashCommandRunner = async (client: GalaxyAlpha, interaction, args: {}, infos: { member?: GuildMember, user?: User, guild?, channel: TextChannel | NewsChannel }): Promise<unknown> => {
        throw new Error(`${this.constructor.name} doesn't have a run() method.`);
    };
    public static async createSlashCommand(slashCommand: SlashCommand, guildID?: string) {
		return await client.getApp(guildID).commands.post({
			data: {
				name: slashCommand.name,
				description: slashCommand.description,
				options: slashCommand.options
			}
		});
	};
	public static async deleteSlashCommand(slashCommandID: string, guildID?: string) {
		return await client.getApp(guildID).commands(slashCommandID).delete();
	};
	public static async editSlashCommand(slashCommandID: string, slashCommand: SlashCommand, guildID?: string) {
		return await client.getApp(guildID).commands(slashCommandID).patch({
			data: {
				name: slashCommand.name,
				description: slashCommand.description,
				options: slashCommand.options
			}
		});
	};
};

interface InteractionApplicationCommandCallbackData {
    tts?: boolean,
    content?: string,
    embeds?: MessageEmbed | Array<MessageEmbed>,
    allowedMentions?: "roles" | "users" | "everyone",
    flags?: MessageFlags
};