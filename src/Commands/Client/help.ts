import Command, { CommandRunner, Categories } from '@root/Command';
import { MessageEmbed } from 'discord.js';

export default class HelpCommand extends Command {
    constructor() {
        super({
            name: 'help',
            description: "shows a list of all commands or shows infos about one command",
            category: "miscellaneous",
            aliases: ["info", "invite"],
            usage: "help [command name/command category]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const arrayOfCategories: Array<Categories> = [];
        client.categories.forEach(commands => {
            if (!arrayOfCategories.includes(commands[0].category) && commands[0].category != "developer" && commands[0].category != "private") arrayOfCategories.push(commands[0].category);
        });
        if (args[0]) {
            if (arrayOfCategories.includes((args[0].toLowerCase() as Categories))) {
                const commands = client.commands.filter(command => command.category == args[0].toLowerCase()).keyArray();
                return message.channel.send(client.createEmbed()
                    .setTitle(client.util.toUpperCaseBeginning(args[0]))
                    .setDescription(`In order to more infos about every single command,\nuse the command \`${prefix}help <command name>\`\n\n\`${commands.join("` `")}\``));
            } else {
                const command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
                if (!command || (command.developerOnly && !client.developers.includes(message.author.id)) || (command.ownerOnly && client.ownerID != message.author.id) || command.category == "private") return client.commands.get(this.name).run(client, message, [], prefix);
                let text: string = "";
                let userPermissions: Array<string> = [];
                let clientPermissions: Array<string> = [];
                if (command.userPermissions) command.userPermissions.forEach(permission => {
                    userPermissions.push(client.util.permissionConverted(permission));
                });
                if (command.clientPermissions) command.clientPermissions.forEach(permission => {
                    clientPermissions.push(client.util.permissionConverted(permission));
                });
                if (command.name) text += `**Name:** ${command.name}\n`;
                if (command.category) text += `**Category:** ${client.util.toUpperCaseBeginning(command.category)}\n`
                if (command.description) text += `**Description:** ${command.description}\n`;
                if (command.aliases) text += `**Aliases:** ${command.aliases.join(", ")}\n`;
                if (command.cooldown) text += `**Cooldown:** ${client.humanizer(client.ms(command.cooldown))}\n`;
                if (command.userPermissions) text += `**User ${command.userPermissions.length > 1 ? "Permissions" : "Permission"}:** \`${userPermissions.join("`, `")}\`\n`
                if (command.clientPermissions) text += `**Bot ${command.clientPermissions.length > 1 ? "Permissions" : "Permission"}**: \`${clientPermissions.join("`, `")}\`\n`;
                if (command.usage) text += `**Usage:** \`${prefix}${command.usage}\`\n`;
                if (command.dmOnly || command.guildOnly || command.newsChannelOnly || command.textChannelOnly) text += `\n📝 **NOTES:**\n`
                if (command.guildOnly) text += `Works only in servers!\n`;
                if (command.dmOnly) text += `Works only in DM's\n`;
                if (command.newsChannelOnly) text += `Works only in Announcement channels\n`;
                if (command.textChannelOnly) text += `Works only in Text channels\n`;
                return message.channel.send(client.createEmbed()
                    .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle("Command Info")
                    .setDescription(text));
            };
        } else {
            const embedArray: Array<MessageEmbed> = [];
            let pages: number = arrayOfCategories.length + 1;
            const helpEmbed = client.createEmbed()
                .setTitle(`${client.profileEmoji} ${client.user.username}`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**${client.user.username}** is a bot to improve your server! 
                Better server management and much more utility and fun commands!
                Ticket system, giveaway and drop management, currency system, moderation commands, some game commands and music commands with basic stream quality!
                
                In order to use any commands of this bot send the prefix (\`${prefix}\`) + the command name or alias in a message! 

                You can also suggest commands by doing \`${prefix}suggest command <description>\`

                To report any issues you can also use the suggestion command above!

                Some stats about ${client.user.username}? Use \`${prefix}stats\`
                
                DASHBOARD IS COMING SOON!`)
                .setFooter(`Page 1/${pages} • <> = REQUIRED | [] = OPTIONAL`, client.user.displayAvatarURL({ dynamic: true }))
                .addField("Categories", `\`${arrayOfCategories.map(category => `${client.util.toUpperCaseBeginning(category)}`).join("` `")}\``);
            embedArray.push(helpEmbed);
            for (let i = 0; i < arrayOfCategories.length; i++) {
                const embed = client.createEmbed().setTitle(client.util.toUpperCaseBeginning(arrayOfCategories[i])).setFooter(`Page ${i + 2}/${pages} • <> = REQUIRED | [] = OPTIONAL`);
                const commands = client.commands.filter(command => command.category == arrayOfCategories[i]).keyArray();
                embed.setDescription(`In order to get more infos about a single command,\nuse the command \`${prefix}help <command name>\`\n\n\`${commands.join("` `")}\``);
                embedArray.push(embed);
            };
            let page: number = 0;
            const msg = await message.author.send(embedArray[0]);
            if (message.channel.type != "dm") client.createSuccess(message, { title: "❓ Help", description: "You got an DM from me! Check it out!" });
            await msg.react('ℹ️');
            await msg.react('◀️');
            await msg.react('▶️');
            const Buttons = msg.createReactionCollector((reaction, user) => (reaction.emoji.name == '◀️' || reaction.emoji.name == '▶️' || reaction.emoji.name == 'ℹ️') && user.id == message.author.id, { time: 24 * 60 * 60 * 1000 });
            Buttons.on('collect', async (reaction, user) => {
                if (reaction.emoji.name == '◀️') {
                    if (page == 0) {
                        await msg.edit(embedArray[embedArray.length - 1]);
                        page = embedArray.length - 1;
                    } else {
                        page--;
                        await msg.edit(embedArray[page]);
                    };
                } else if (reaction.emoji.name == '▶️') {
                    if (page == embedArray.length - 1) {
                        await msg.edit(embedArray[0]);
                        page = 0;
                    } else {
                        page++;
                        await msg.edit(embedArray[page]);
                    };
                } else {
                    if (page != 0) {
                        await msg.edit(embedArray[0]);
                        page = 0;
                    };
                };
            });
        };
    };
};