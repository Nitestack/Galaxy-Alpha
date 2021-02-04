import Command from '@root/Command';

export default class PingCommand extends Command {
    constructor() {
        super({
            name: 'ping',
            description: "Get's the bot's API latency and the ping",
            category: "utility"
        });
    };
    async run (client, message){
        const msgEmbed = client.createEmbed()
            .setTitle(`📡   **PINGING  <a:loading:786705779080036372>**`)
            .setDescription(`❌ If the **Client Latency** and the **API Latency** won't be shown, try it again!`);
        const msg = await message.channel.send(msgEmbed);
        const ping = msg.createdTimestamp - message.createdTimestamp;
        const pong = client.createEmbed()
            .setTitle(`**🏓   PONG!**`)
            .setDescription(`🤖 **Client Latency:** \`${ping}ms\`\n<:members:786705341484236800> **API Latency:** \`${client.ws.ping}ms\``)
            .setThumbnail(client.user.displayAvatarURL());
        message.channel.send(pong);
        msg.delete();
    };
};