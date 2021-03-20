import Command, { CommandRunner } from '@root/Command';

export default class PrefixCommand extends Command {
    constructor(){
        super({
            name: "prefix",
            description: "prefix commands",
            category: "management",
            guildOnly: true,
            usage: "prefix set <new prefix>",
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args: Array<string>, prefix) => {
        if (args[0]?.toLowerCase() == "set") {
            const prefixManager = `${client.workingGearEmoji} Prefix Manager`;
            if (!args[1]) return client.createArgumentError(message, { title: prefixManager, description: "You have to provide a new prefix!" }, `${this.name} set <new prefix>`);
            const newPrefix = args.slice(1).join(" ");
            if (newPrefix == prefix) return client.createArgumentError(message, { title: prefixManager, description: "This prefix is already the server prefix!" }, `${this.name} set <new prefix>`);
            return client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed()
                .setTitle(prefixManager)
                .setDescription(`Do you really want the prefix from\n\`${prefix}\`\nto\n\`${newPrefix}\`?`)), {
                    title: prefixManager,
                    activity: "setting",
                    toHandle: "new prefix"
                }, `${this.name} set <new prefix>`, async (reaction, user) => {
                    await client.cache.updateGuild(message.guild.id, {
                        prefix: newPrefix
                    });
                    return client.createSuccess(message, { title: prefixManager, description: "Your server prefix has been successfully updated!" });
                });
        } else return message.channel.send(client.createEmbed()
            .setTitle(`${client.workingGearEmoji} Prefix`)
            .setDescription(`The current server prefix is:\n\`${prefix}\``));
    };
};