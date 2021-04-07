import Feature, { FeatureRunner } from "@root/Feature";
import axios from "axios";

export default class extends Feature {
    constructor() {
        super({
            name: "chatbot"
        });
    };
    run: FeatureRunner = async (client) => {
        const apiKey = "hm8iMsJZlgtraDyMZyJdEav9M";
        client.on("message", async (message) => {
            if (message.author.bot) return;
            if (!(await client.cache.getGuild(message.guild.id)).chatBot.includes(message.channel.id) || message.author.bot) return;
            const results = await axios.get(`https://api.monkedev.com/fun/chat?msg=${encodeURIComponent(message.content)}&uid=${message.author.id}&key=${apiKey}`);
            if (results.status != 200) return;
            return message.lineReply(results.data.response);
        });
    };
};