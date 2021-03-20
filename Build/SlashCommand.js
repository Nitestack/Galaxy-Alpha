"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("@root/index"));
;
;
;
class SlashCommand {
    constructor(infos) {
        this.client = index_1.default;
        this.run = async (client, interaction, args, infos) => {
            throw new Error(`${this.constructor.name} doesn't have a run() method.`);
        };
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
    }
    ;
    static createInteractionResponse(interaction, slashCommand) {
        //@ts-ignore
        return this.client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: slashCommand.type == "message" ? 4 : 5,
                data: {
                    ...slashCommand.data,
                    embeds: slashCommand.data.embeds ? (Array.isArray(slashCommand.data.embeds) ? slashCommand.data.embeds.map(embed => embed.toJSON()) : [slashCommand.data.embeds.toJSON()]) : null
                }
            }
        });
    }
    ;
    static async createSlashCommand(slashCommand, guildID) {
        return await index_1.default.getApp(guildID).commands.post({
            data: {
                name: slashCommand.name,
                description: slashCommand.description,
                options: slashCommand.options
            }
        });
    }
    ;
    static async deleteSlashCommand(slashCommandID, guildID) {
        return await index_1.default.getApp(guildID).commands(slashCommandID).delete();
    }
    ;
    static async editSlashCommand(slashCommandID, slashCommand, guildID) {
        return await index_1.default.getApp(guildID).commands(slashCommandID).patch({
            data: {
                name: slashCommand.name,
                description: slashCommand.description,
                options: slashCommand.options
            }
        });
    }
    ;
}
exports.default = SlashCommand;
;
;
//# sourceMappingURL=SlashCommand.js.map