import Command, { Categories } from '@root/Command';
import { MessageEmbed } from 'discord.js';

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: "shows a list of all commands or shows infos about one command",
            category: "miscellaneous",
            usage: "help or help <command name or alias>",
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    };
    async run(client, message, args, prefix) {
        if (args[0]) {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
            if (!command || (command.developerOnly && !client.developers.includes(message.author.id)) || (command.ownerOnly && client.ownerID != message.author.id) || command.category == "private") return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("Command Manager")
                .setDescription(`Cannot find the command \`${args[0].toLowerCase()}\` in the commands list!`));
            let text: string = "";
            let userPermissions: Array<string> = [];
            let clientPermissions: Array<string> = [];
            if (command.userPermissions) {
                command.userPermissions.forEach(permission => {
                    userPermissions.push(client.permissionsShowCase[client.permissions.indexOf(permission)]);
                });
            };
            if (command.clientPermissions) {
                command.clientPermissions.forEach(permission => {
                    clientPermissions.push(client.permissionsShowCase[client.permissions.indexOf(permission)]);
                });
            };
            if (command.name) text += `**Name:** ${command.name}\n`;
            if (command.category) text += `**Category:** ${command.category[0].toUpperCase() + command.category.slice(1).toLowerCase()}\n`
            if (command.description) text += `**Description:** ${command.description}\n`;
            if (command.aliases) text += `**Aliases:** ${command.aliases.join(", ")}\n`;
            if (command.cooldown) text += `**Cooldown:** ${command.cooldown >= 60 ? `${Math.floor(command.cooldown / 60)}m ${command.cooldown - (Math.floor(command.cooldown / 60) * 60)}s` : `${command.cooldown}s`}\n`;
            if (command.userPermissions) text += `**User ${command.userPermissions.length > 1 ? "Permissions" : "Permission"}:** \`${userPermissions.join("`, `")}\`\n`
            if (command.clientPermissions) text += `**Bot ${command.clientPermissions.length > 1 ? "Permissions" : "Permission"}**: \`${clientPermissions.join("`, `")}\`\n`;
            if (command.usage) text += `**Usage:** \`${prefix}${command.usage}\`\n`;
            if (command.dmOnly || command.guildOnly) text += `\n📝 **NOTES:**\n`
            if (command.guildOnly) text += `Works only in servers!\n`;
            if (command.dmOnly) text += `Works only in DM's\n`;
            return message.channel.send(client.createEmbed()
                .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Command Info | ${command.name[0].toUpperCase() + command.name.slice(1).toLowerCase()}`)
                .setDescription(text));
        } else {
            const embedArray: Array<MessageEmbed> = [];
            const helpEmbed = client.createEmbed()
                .setTitle(`❓ ${client.user.username}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`**${client.user.username} is a multifunctional bot with many features! From a ticket system to a basic music bot!**
                **The current server prefix is \`${prefix}\`.**
                **You have a command idea?**\nDo \`${prefix}suggest command <suggestion>\`
                
                **TOPICS**
                ${client.infoEmoji} \`Miscellaneous\`
                ${client.developerToolsEmoji} \`Utility\`
                ${client.desktopEmoji} \`Moderation\`
                🎵 \`Music\`
                🎉 \`Giveaway\`
                🎟️ \`Ticket\`
                💰 \`Currency\`
                <:discord:786334157109592125> \`Management\``);
            embedArray.push(helpEmbed);
            let pages: number = 9;
            const miscEmbed = client.createEmbed().setTitle(`${client.infoEmoji} Miscellaneous`).setFooter(`Page 1/${pages} • <> = REQUIRED | [] = OPTIONAL`);
            const utilityEmbed = client.createEmbed().setTitle(`${client.developerToolsEmoji} Utility`).setFooter(`Page 2/${pages} • <> = REQUIRED | [] = OPTIONAL`);
            const moderationEmbed = client.createEmbed().setTitle(`${client.desktopEmoji} Moderation`).setFooter(`Page 3/${pages} • <> = REQUIRED | [] = OPTIONAL`);
            const musicEmbed = client.createEmbed().setTitle("🎵 Music").setFooter(`Page 4/${pages} • <> = REQUIRED | [] = OPTIONAL`);
            const giveawayEmbed = client.createEmbed().setTitle("🎉 Giveaway").setFooter(`Page 5/${pages} • <> = REQUIRED | [] = OPTIONAL`);
            const ticketEmbed = client.createEmbed().setTitle("🎟️ Ticket").setFooter(`Page 6/${pages} • <> = REQUIRED | [] = OPTIONAL`);
            const currencyEmbed = client.createEmbed().setTitle("💰 Currency").setFooter(`Page 7/${pages} • <> = REQUIRED | [] = OPTIONAL`);
            const managerEmbed = client.createEmbed().setTitle("<:discord:786334157109592125> Management").setFooter(`Page 8/${pages} • <> = REQUIRED | [] = OPTIONAL`);
            const gameEmbed = client.createEmbed().setTitle("🎮 Games").setFooter(`Page 9/${pages} • <> = REQUIRED | [] = OPTIONAL`);
            autoImportCommands("miscellaneous", miscEmbed);
            autoImportCommands("utility", utilityEmbed);
            autoImportCommands("moderation", moderationEmbed);
            autoImportCommands("music", musicEmbed);
            autoImportCommands("giveaway", giveawayEmbed);
            autoImportCommands("ticket", ticketEmbed);
            autoImportCommands("currency", currencyEmbed);
            autoImportCommands("management", managerEmbed);
            autoImportCommands("games", gameEmbed);
            let page: number = 0;
            return message.channel.send(embedArray[0]).then(async msg => {
                await msg.react('ℹ️');
                await msg.react('◀️');
                await msg.react('▶️');
                const filter = (reaction, user) => (reaction.emoji.name == '◀️' || reaction.emoji.name == '▶️' || reaction.emoji.name == 'ℹ️') && user.id == message.author.id;
                const Buttons = msg.createReactionCollector(filter, { time: 24 * 60 * 60 * 1000 });
                Buttons.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name == '◀️') {
                        if (page == 0){
                            if (message.channel.type != "dm"){
                                msg.reactions.cache.get("◀️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[embedArray.length - 1]);
                            page = embedArray.length - 1;
                        } else {
                            page--;
                            if (message.channel.type != "dm"){
                                msg.reactions.cache.get("◀️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[page]);
                        };
                    } else if (reaction.emoji.name == '▶️') {//TO FIX
                        if (page == embedArray.length - 1){
                            if (message.channel.type != "dm"){
                                msg.reactions.cache.get("▶️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[0]);
                            page = 0;
                        } else {
                            page++;
                            if (message.channel.type != "dm"){
                                msg.reactions.cache.get("▶️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[page]);
                        };
                    } else {
                        if (page == 0){
                            if (message.channel.type != "dm"){
                                msg.reactions.cache.get("ℹ️").users.remove(user.id);
                            };
                        } else {
                            if (message.channel.type != "dm"){
                                msg.reactions.cache.get("ℹ️").users.remove(user.id);
                            };
                            await msg.edit(embedArray[0]);
                            page = 0;
                        };
                    };
                });
            });
            function autoImportCommands(category: Categories, embed: MessageEmbed) {
                client.commands.filter(command => command.category == category).forEach(command => {
                    embed.addField(`${command.name}`, `${command.description}\n\`${prefix}${command.usage}\``, true);
                });
                embedArray.push(embed);
            };
        };
    };
};