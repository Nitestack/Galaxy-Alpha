import Command, { CommandRunner } from "@root/Command";

export default class ListBansCommand extends Command {
    constructor(){
        super({
            name: "listbans",
            description: "lists all members banned from the server",
            category: "games",
            guildOnly: true,
            userPermissions: ["BAN_MEMBERS", "ADMINISTRATOR"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const fetchedBans = await message.guild.fetchBans();
        if (fetchedBans.size == 0) return client.createArgumentError(message, { title: "🔨 Ban Manager", description: "Nobody was banned in this server!" }, this.usage);
        const bannedMembers = fetchedBans.map(member => `**${member.user.tag}**: *${member.reason || "No reason provided!"}*`);
        return message.channel.send(client.createEmbed()
            .setTitle("🔨 Bans")
            .setDescription(bannedMembers.join("\n")));
    };
};