import Feature, { FeatureRunner } from "@root/Feature";

export default class extends Feature {
    constructor() {
        super({
            name: "privatefunctions"
        });
    };
    run: FeatureRunner = async (client) => {
        client.on("message", async (message) => {
            if (message.author.bot) return;
            if (message.channel.id == "813825642021126168") {
                if (message.deletable) await message.delete();
                const msg = await message.channel.send(client.createEmbed()
                    .setTitle("ANNOUNCEMENT")
                    .setDescription(client.util.embedFormatter.description(message.content + "\n\n" + 
                    "React with ✅, if you read this announcement!"))
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true })));
                await msg.react("✅")
                await msg.crosspost();
            };
        });
    };
};