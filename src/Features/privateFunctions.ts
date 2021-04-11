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
            //GAMMEL SERVER
            if (message.channel.type != "dm" && message.guild.id == "813437935465660467") {
                if (message.author.id == "408557219735666688") await message.react("🏳️‍🌈");
                if (message.attachments.first()) await message.react("✅");
                if (message.attachments.first() && message.author.id == "358303166845943808") await message.react("🦦");
                else if (message.attachments.first() && message.author.id == "686228650760339499") await message.react("🍴");
            };
            if (message.channel.id == "813825642021126168") {
                const embed = client.createEmbed()
                    .setTitle("ANNOUNCEMENT" + ` (Update Log: \`${message.createdAt.toLocaleString()}\`)`)
                    .setDescription(client.util.embedFormatter.description(message.content))
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .addField("Want to suggest something?", `Do \`${client.globalPrefix}suggest <suggestion here>\` to submit a suggestion!`)
                    .addField("Need support?", `Do \`${client.globalPrefix}ticketcreate [optional reason]\` to create a support ticket!`)
                    .addField("---------------------------------------------", "React with ✅, if you read this announcement!");
                if (message.attachments.first()) embed.setImage(message.attachments.first().url);
                if (message.deletable) await message.delete();
                const msg = await message.channel.send(embed);
                await msg.react("✅");
                await msg.crosspost();
            };
        });
    };
};