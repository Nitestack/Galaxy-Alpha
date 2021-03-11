import SlashCommand, { SlashCommandRunner } from "@root/SlashCommand";

export default class SnipeSlashCommand extends SlashCommand {
    constructor() {
        super({
            name: "snipe",
            description: "Get's the latest deleted message of the channel",
            type: "message"
        });
    };
    run: SlashCommandRunner = async (client, interaction, args, infos) => {
        if (client.snipes.has(infos.channel.id)) {
            const snipes = client.snipes.get(infos.channel.id);
            const embed = client.createEmbed()
                .setAuthor(snipes.author.tag, snipes.author.displayAvatarURL({ dynamic: true }))
                .setDescription(snipes.content)
                .setTimestamp(snipes.createdTimestamp);
            if (snipes.attachments.first()) embed.setImage(snipes.attachments.first().proxyURL);
            this.data.embeds = embed;
        } else this.data.embeds = client.createRedEmbed()
            .setTitle("🔫 Snipe Manager")
            .setDescription("There is nothing to snipe!");
    };
};
