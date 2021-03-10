import SlashCommand, { SlashCommandRunner } from "@root/SlashCommand";

export default class EmbedSlashCommand extends SlashCommand {
    constructor() {
        super({
            name: "embed",
            description: "Generates an embed",
            type: "message",
            options: [{
                name: "title",
                description: "The title",
                required: true,
                type: 3
            }, {
                name: "description",
                description: "The description",
                required: true,
                type: 3
            }]
        });
    };
    run: SlashCommandRunner = async (client, interaction, args, infos) => {
        this.data.embeds = client.createEmbed().setTitle(args.title).setDescription(args.description);
    };
};
