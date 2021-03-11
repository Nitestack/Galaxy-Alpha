import SlashCommand, { SlashCommandRunner } from "@root/SlashCommand";
import axios from "axios";
import { MessageEmbed } from "discord.js";

export default class extends SlashCommand {
    constructor() {
        super({
            name: "djsdocs",
            description: "Searches a query in the DJS Documentation",
            type: "message",
            options: [{
                name: "query",
                description: "The query to search for",
                type: 3,
                required: true
            }]
        });
    };
    run: SlashCommandRunner = async (client, interaction, args, infos) => {
        const result = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.query.toLowerCase())}`);
        if (result.status == 200 && result.data) {
            result.data.author = {
                name: infos.member.user.tag,
                icon_url: infos.member.user.displayAvatarURL({ dynamic: true })
            };
            result.data.color = client.util.embedColorHex;
            this.data.embeds = new MessageEmbed(result.data);
        } else this.data.embeds = client.createRedEmbed().setTitle("🔖 DiscordJS Documentation Manager").setDescription(`Cannot find any results, that includes\n\`${args.query}\`!`);
    };
};