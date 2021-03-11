import SlashCommand, { SlashCommandRunner } from "@root/SlashCommand";

export default class PingSlashCommand extends SlashCommand {
    constructor(){
        super({
            name: "ping",
            description: "Checks the ping of the bot",
            type: "message"
        });
    };
    run: SlashCommandRunner = async (client, interaction, args, infos) => {
        const msgEmbed = client.createEmbed()
            .setTitle(`📡   **PINGING  <a:loading:786705779080036372>**`)
            .setDescription(`❌ If the **Client Latency** and the **API Latency** won't be shown, try it again!`);
        const msg = await infos.channel.send(msgEmbed);
        const ping = msg.createdTimestamp - Date.now();
        msg.delete();
        this.data.embeds = client.createEmbed()
            .setTitle(`**🏓   PONG!**`)
            .setDescription(`🤖 **Client Latency:** \`${ping}ms\`\n<:members:786705341484236800> **API Latency:** \`${client.ws.ping}ms\``)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
    };
};