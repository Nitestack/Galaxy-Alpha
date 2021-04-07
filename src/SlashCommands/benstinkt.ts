import SlashCommand, { SlashCommandRunner } from "@root/SlashCommand";

export default class extends SlashCommand {
    constructor() {
        super({
            name: "ben-stinkt",
            description: "sends a message",
            type: "message"
        });
    };
    run: SlashCommandRunner = async (client, interaction, args, infos) => {
        this.data.embeds = client.createEmbed()
            .setTitle("Message")
            .setDescription("Ben stinkt!");
    };
};