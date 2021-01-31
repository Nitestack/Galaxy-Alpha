import Command from "@root/Command";

module.exports = class RCRegisterCommand extends Command {
    constructor(client){
        super(client, {
            name: "register",
            description: "sends a rocket league code",
            category: "private",
            guildOnly: true
        });
    };
    async run(client, message, args, prefix) {
        if (message.guild.id != "786994097746739231") return;
        return message.author.send(client.createEmbed()
            .setTitle("🏆 Rocket League Tunier")
            .setDescription(`${client.yesEmoji} **Du hast dich erfolgreich registriert!**\n🏎️ **Rocket League Code:** \`mobile161\`\n<:twitch:786676150964322394> **Twitch:** https://www.twitch.tv/mobile_rocket_tuniere`));
    };
};