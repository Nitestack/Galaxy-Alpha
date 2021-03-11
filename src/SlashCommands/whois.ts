import SlashCommand, { SlashCommandRunner } from "@root/SlashCommand";

export default class extends SlashCommand {
    constructor() {
        super({
            name: "whois",
            description: "Get's some infos about a member",
            type: "message",
            options: [{
                type: 6,
                name: "member",
                description: "The member to get the information of"
            }]
        });
    };
    run: SlashCommandRunner = async (client, interaction, args, infos) => {
        const member = args.member ? infos.guild.members.cache.get(args.member) : infos.member;
        let roles = member.roles.cache.map((r) => `${r}`);
        roles.splice(roles.length - 1, 1);
        this.data.embeds = client.createEmbed()
            .setColor(member.roles.highest.hexColor)
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member.user}`)
            .addField("Nickname (username if they don't have one)", member.displayName)
            .addField('ID', member.user.id)
            .addField('Avatar', `[Link](${member.user.displayAvatarURL({ dynamic: true })})`)
            .addField('Registered on Discord', `${client.util.dateFormatter(member.user.createdAt)}`)
            .addField('Joined this server', `${client.util.dateFormatter(member.joinedAt)}`)
            .addField(`Roles [${roles.length}]`, roles.join(' '));
    };
};
