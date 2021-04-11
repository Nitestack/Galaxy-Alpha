import Command, { CommandRunner } from "@root/Command";

export default class extends Command {
    constructor() {
        super({
            name: "configuration",
            aliases: ["config"],
            description: "shows the server's configuration",
            category: "management"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const guildSettings = await client.cache.getGuild(message.guild.id);
        return message.channel.send(client.createEmbed()
            .setTitle(`${client.workingGearEmoji} Configuration`)
            .addField("Server Manager Role", `<@&${guildSettings.serverManagerRoleID}>`)
            .addField("Suggestion", `**Channel:** <#${guildSettings.suggestion.channelID || "Not set!"}>
            **Manager:** ${guildSettings.suggestion.managerRoleID || "Not set!"}`));
    };
};