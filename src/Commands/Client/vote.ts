import Command, { CommandRunner } from "@root/Command";

export default class VoteCommand extends Command {
    constructor() {
        super({
            name: "vote",
            description: "sends a message to show how to vote for the bot or for the support server",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        return message.channel.send(client.createEmbed()
            .setTitle("🗳️ Vote")
            .setDescription(`**❓ Why I should vote for ${client.user.username}?**
            If you are voting for ${client.user.username}, you help our developement! Every vote is new power to create much featured commands!
            
            **💎 What are the perks for every bot and server vote?**
            You'll receive \`5.000\`$ instantly and 25% XP Booster! (coming soon)
            
            **${client.arrowEmoji} Vote for ${client.user.username}**
            Vote on [top.gg (coming soon)](${client.topGGBot}) or on [Discord Bot List](${client.discordBotList})
            
            **${client.arrowEmoji} Vote for Support Server**
            Vote on [top.gg](${client.topGGServer}) or on [Discord Server List](${client.discordServerList})
            
            **😫 And if I don't like to vote for the bot, but I want to help?**
            Just go to <#790654261968371754> and use \`!d bump\` to bump our server on [DISBOARD](https://disboard.org/de/server/783440776285651024)!`));
    };
};