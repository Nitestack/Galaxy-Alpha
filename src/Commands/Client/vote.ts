import Command from "@root/Command";

module.exports = class VoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "vote",
            description: "sends a message to show how to vote for the bot or for the support server",
            category: "miscellaneous"
        });
    };
    async run(client, message, args, prefix) {
        return message.channel.send(client.createEmbed()
            .setTitle("🗳️ Vote")
            .addField(`❓ Why I should vote for ${client.user.username}?`, `If you are voting for ${client.user.username}, you help the bot to grow and to get popular!`)
            .addField("💎 What are the perks for every bot and server vote?", "You'll receive 5.000 coins instantly and 25% XP Booster!")
            .addField(`${client.arrowEmoji} Vote for ${client.user.username}`, `[Coming soon!](${client.topGGBot}) or [Discord Bot List](${client.discordBotList})`)
            .addField(`${client.arrowEmoji} Vote for Support Server`, `[top.gg](${client.topGGServer}) or [Discord Server List](${client.discordServerList})`)
            .addField("😫 And if I don't like to vote for the bot, but I want to help?", "Just go to <#790654261968371754> and use `!d bump` to bump our server on [DISBOARD](https://disboard.org/de/server/783440776285651024)!"));
    };
};