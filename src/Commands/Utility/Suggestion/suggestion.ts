import Command, { CommandRunner } from '@root/Command';
import { NewsChannel, WebhookClient, TextChannel } from 'discord.js';

export default class SuggestCommand extends Command {
    constructor() {
        super({
            name: "suggestion",
            category: "utility",
            description: "handles suggestions",
            guildOnly: true,
            usage: "suggestion accept [reason]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (!guildSettings.suggestionChannelID) return client.createArgumentError(message, { title: "Suggestino Manager", description: "This server has no suggestion channel set up!\nAsk the server managers to setup a suggestion channel!" }, this.usage);
        if (args[0]?.toLowerCase() == 'command') {
            const suggestionManager: string = '📩 Suggestion Manager';
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const usage: string = `${prefix}suggest command <suggestion>`
            const suggestion: string = args.slice(1).join(" ");
            const suggestionChannel: WebhookClient = new WebhookClient("815967489493041202", "xpl7e2AIxTUI0hPhks5nH8G4Yta__iMCzxJhxCqb3vFO-QPWOyO2LWxVHOqpzLLjPZfK");
            if (!args[1]) return message.channel.send(client.createRedEmbed(true, usage)
                .setTitle(suggestionManager)
                .setDescription("You have to provide your suggestion! Please write your suggestion in English!"));
            const successEmbed = client.createGreenEmbed(true, usage)
                .setTitle(suggestionManager)
                .setDescription(`Your suggestion was successfully sent to the developers!\n**📝 Suggestion:** ${suggestion}`);
            const suggestionEmbed = client.createEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(suggestionManager)
                .setDescription(`${suggestion}
                
                **🗓️ Suggested on:** ${weekDays[message.createdAt.getUTCDay()]}, ${monthNames[message.createdAt.getUTCMonth()]} ${message.createdAt.getUTCDate()}, ${message.createdAt.getUTCFullYear()}, ${message.createdAt.getUTCHours()}:${message.createdAt.getUTCMinutes()}:${message.createdAt.getUTCSeconds()} UTC
                **${client.memberEmoji} Suggested from:** ${message.author} in **${message.guild.name}**`);
            await suggestionChannel.send(suggestionEmbed);
            return message.channel.send(successEmbed);
        } else if (args[0]?.toLowerCase() == "accept") {
            if (!args[1]) return client.createArgumentError(message, { title: "Suggestion Manager", description: "You have to provide a message ID!" }, this.usage);
            const channel = message.guild.channels.cache.get(guildSettings.suggestionChannelID) as TextChannel | NewsChannel;
            const suggestionMessage = await channel.messages.fetch(args[1]);
            if (!suggestionMessage) return client.createArgumentError(message, { title: "Suggestion Manager", description: "Invalid message ID!" }, this.usage);
            if (!suggestionMessage.embeds[0] || suggestionMessage.author.id != client.user.id || !suggestionMessage.embeds[0].fields.find(field => field.name.toLowerCase().includes("status"))) return client.createArgumentError(message, { title: "Suggestion Manager", description: "This message is not a suggestion!" }, this.usage)
            if (suggestionMessage.embeds[0].hexColor.toLowerCase() == client.util.greenColorHex) return client.createArgumentError(message, { title: "Suggestion Manager", description: "This suggestion was already accepted!" }, this.usage);
            if (suggestionMessage.embeds[0].hexColor.toLowerCase() == client.util.redColorHex) return client.createArgumentError(message, { title: "Suggestion Manager", description: "This suggestion was already declined!" }, this.usage);
            const reason = args.slice(2).join(" ") || "No reason provided!";
            await suggestionMessage.edit(suggestionMessage.embeds[0].spliceFields(0, 1, {
                name: "🚦 Status",
                value: client.util.embedFormatter.fieldValue(`${client.yesEmoji} Accepted!\n📝 ${reason}`)
            }).setColor(client.util.greenColorHex));
            if (suggestionMessage.mentions.users.first() && message.guild.members.cache.has(suggestionMessage.mentions.users.first().id)) suggestionMessage.mentions.users.first().send(client.createGreenEmbed()
                .setTitle("Suggestion Manager")
                .setDescription(`[Your suggestion](${suggestionMessage.url}) was accepted by ${message.author}!`)
                .addField("📝 Reason", client.util.embedFormatter.fieldValue(reason)));
            return client.createSuccess(message, { title: "Suggestion Manager", description: "Suggestion accepted!" });
        } else if (args[0]?.toLowerCase() == "decline") {
            if (!args[1]) return client.createArgumentError(message, { title: "Suggestion Manager", description: "You have to provide a message ID!" }, this.usage);
            const channel = message.guild.channels.cache.get(guildSettings.suggestionChannelID) as TextChannel | NewsChannel;
            const suggestionMessage = await channel.messages.fetch(args[1]);
            if (!suggestionMessage) return client.createArgumentError(message, { title: "Suggestion Manager", description: "Invalid message ID!" }, this.usage);
            if (!suggestionMessage.embeds[0] || suggestionMessage.author.id != client.user.id || !suggestionMessage.embeds[0].fields.find(field => field.name.toLowerCase().includes("status"))) return client.createArgumentError(message, { title: "Suggestion Manager", description: "This message is not a suggestion!" }, this.usage)
            if (suggestionMessage.embeds[0].hexColor.toLowerCase() == client.util.greenColorHex) return client.createArgumentError(message, { title: "Suggestion Manager", description: "This suggestion was already accepted!" }, this.usage);
            if (suggestionMessage.embeds[0].hexColor.toLowerCase() == client.util.redColorHex) return client.createArgumentError(message, { title: "Suggestion Manager", description: "This suggestion was already declined!" }, this.usage);
            const reason = args.slice(2).join(" ") || "No reason provided!";
            await suggestionMessage.edit(suggestionMessage.embeds[0].spliceFields(0, 1, {
                name: "🚦 Status",
                value: client.util.embedFormatter.fieldValue(`${client.noEmoji} Declined!\n📝 ${reason}`)
            }).setColor(client.util.redColorHex));
            if (suggestionMessage.mentions.users.first() && message.guild.members.cache.has(suggestionMessage.mentions.users.first().id)) suggestionMessage.mentions.users.first().send(client.createRedEmbed()
                .setTitle("Suggestion Manager")
                .setDescription(`[Your suggestion](${suggestionMessage.url}) was declined by ${message.author}!`)
                .addField("📝 Reason", client.util.embedFormatter.fieldValue(reason)));
            return client.createSuccess(message, { title: "Suggestion Manager", description: "Suggestion declined!" });
        } else return client.createEmbedForSubCommands(message, { title: "Suggestion Management", description: "Use this commands to handle suggestions!" }, [{
            description: "Accepts a suggestion",
            usage: `${this.name} accept <Message ID> [reason]`
        }, {
            description: "Declines a suggestion",
            usage: `${this.name} decline <Message ID> [reason]`
        }]);
    };
};