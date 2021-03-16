import Command, { CommandRunner } from '@root/Command';
import ProfileSchema from '@models/profile';
import LevelSchema, { Level } from "@models/level";
import VouchSchema from '@models/vouches';

export default class LeaderboardCommand extends Command {
    constructor() {
        super({
            name: "leaderboard",
            description: "shows the server's leaderboard of a category",
            guildOnly: true,
            usage: "leaderboard <messages/levels/currency/vouches> [user amount]",
            aliases: ["lb"],
            category: "miscellaneous",
            args: [{
                type: "certainString",
                required: true,
                certainStrings: ["levels", "currency", "messages", "vouches"],
                index: 1,
                errorTitle: "Leaderboard Manager",
                errorMessage: "You have to provide a leaderboard category!\n`vouches`, `levels`, `messages`, `currency`"
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const usage = `${prefix}${this.usage}`;
        if (args[0]?.toLowerCase() == 'messages') {
            const embed = client.createEmbed().setTitle(`${client.chatEmoji} Leaderboard`);
            let text: string = '';
            let messages: Array<Level> = await LevelSchema.find({ guildID: message.guild.id }).limit(args[1] && !isNaN((args[1] as unknown as number)) ? parseInt(args[1]) : 10);
            if (messages) for (const user of messages) {
                if (!client.cache.levels.has(user.userID)) client.cache.levels.set(`${user.userID}-${message.guild.id}`, {
                    userID: user.userID,
                    guildID: message.guild.id,
                    level: user.level,
                    xp: user.xp,
                    messages: user.messages,
                    lastUpdated: user.lastUpdated
                });
            };
            const users = client.cache.levels.filter(user => user.guildID == message.guild.id).array().sort((a, b) => b.messages - a.messages);
            if (users.length == 0) return client.createArgumentError(message, { title: "Leaderboard Manager", description: "This server sent no messages! Send some messages to gain xp!" }, this.usage);
            for (let i = 0; i < users.length; i++) {
                let user = message.guild.members.cache.has(users[i].userID) ? message.guild.members.cache.get(users[i].userID).user : false;
                if (user) {
                    if (i == 0) text += `🥇 ${user} with \`${users[i].messages.toLocaleString()}\` messages\n`;
                    else if (i == 1) text += `🥈 ${user} with \`${users[i].messages.toLocaleString()}\` messages\n`;
                    else if (i == 2) text += `🥉 ${user} with \`${users[i].messages.toLocaleString()}\` messages\n`;
                    else text += `\`${i + 1}.\` ${user} with \`${users[i].messages.toLocaleString()}\` messages\n`;
                };
            };
            return message.channel.send(embed.setDescription(text));
        } else if (args[0]?.toLowerCase() == 'levels') {
            const embed = client.createEmbed().setTitle("🎚️ Leaderboard")
            let text: string = "";
            const level = await LevelSchema.find({ guildID: message.guild.id }).limit(args[1] && !isNaN((args[1] as unknown as number)) ? parseInt(args[1]) : 10);
            if (level) for (const user of level){
                if (!client.cache.levels.has(user.userID)) client.cache.levels.set(`${user.userID}-${message.guild.id}`, {
                    userID: user.userID,
                    guildID: message.guild.id,
                    level: user.level,
                    xp: user.xp,
                    messages: user.messages,
                    lastUpdated: user.lastUpdated
                });
            };
            const users = client.cache.levels.filter(user => user.guildID == message.guild.id).array().sort((a, b) => b.xp - a.xp);
            if (users.length == 0) return client.createArgumentError(message, { title: "Leaderboard Manager", description: "There are no levels in this server! Send some messages to gain xp!" }, this.usage);
            for (let i = 0; i < users.length; i++) {
                let user = message.guild.members.cache.has(users[i].userID) ? message.guild.members.cache.get(users[i].userID) : false;
                if (user) {
                    if (i == 0) text += `🥇 ${user} on Level \`${users[i].level.toLocaleString()}\` (\`${users[i].xp.toLocaleString()}\`/\`${xpFor(users[i].level).toLocaleString()}\` XP)\n`
                    else if (i == 1) text += `🥈 ${user} on Level \`${users[i].level.toLocaleString()}\` (\`${users[i].xp.toLocaleString()}\`/\`${xpFor(users[i].level).toLocaleString()}\` XP)\n`
                    else if (i == 2) text += `🥉 ${user} on Level \`${users[i].level.toLocaleString()}\` (\`${users[i].xp.toLocaleString()}\`/\`${xpFor(users[i].level).toLocaleString()}\` XP)\n`
                    else text += `\`${i + 1}.\` ${user} on Level \`${users[i].level.toLocaleString()}\` (\`${users[i].xp.toLocaleString()}\`/\`${xpFor(users[i].level).toLocaleString()}\` XP)\n`;
                };
            };
            return message.channel.send(embed.setDescription(text));
        } else if (args[0]?.toLowerCase() == 'invites') {

        } else if (args[0]?.toLowerCase() == 'currency') {
            const embed = client.createEmbed().setTitle(`💰 Leaderboard`);
            let text: string = '';
            const currencies = await ProfileSchema.find({}).limit(args[1] && !isNaN((args[1] as unknown as number)) ? parseInt(args[1]) : 10);
            if (currencies) for (const user of currencies){
                if (!client.cache.currency.has(user.userID)) client.cache.currency.set(user.userID, {
                    userID: user.userID,
                    bank: user.bank,
                    wallet: user.wallet,
                    profileCreatedAt: user.profileCreatedAt,
                    items: user.items,
                    passive: user.passive,
                    messageCount: user.messageCount
                });
            };
            const profilesWallet = client.cache.currency.filter(profile => message.guild.members.cache.has(profile.userID)).array().sort((a, b) => (b.wallet + b.bank) - (a.wallet + a.bank));
            if (profilesWallet.length == 0) return client.createArgumentError(message, { title: "Leaderboard Manager", description: "There is nobody having coins!\nUse the currency commands to gain coins!" }, this.usage);
            for (let i = 0; i < profilesWallet.length; i++) {
                let user = message.guild.members.cache.has(profilesWallet[i].userID) ? message.guild.members.cache.get(profilesWallet[i].userID).user : false;
                if (user) {
                    if (i == 0) text += `🥇 ${user} with an total of \`${(profilesWallet[i].wallet + profilesWallet[i].bank).toLocaleString()}\`$\n`;
                    else if (i == 1) text += `🥈 ${user} with an total of \`${(profilesWallet[i].wallet + profilesWallet[i].bank).toLocaleString()}\`$\n`;
                    else if (i == 2) text += `🥉 ${user} with an total of \`${(profilesWallet[i].wallet + profilesWallet[i].bank).toLocaleString()}\`$\n`;
                    else text += `\`${i + 1}.\` ${user} with an total of \`${(profilesWallet[i].wallet + profilesWallet[i].bank).toLocaleString()}\`$\n`;
                };
            };
            return message.channel.send(embed.setDescription(text));
        } else if (args[0]?.toLowerCase() == 'vouches') {
            const embed = client.createEmbed().setTitle(":people_hugging: Leaderboard");
            let text: string = '';
            const vouches = await VouchSchema.find({}).sort({
                upVotes: -1
            }).limit(args[1] && !isNaN((args[1] as unknown as number)) ? parseInt(args[1]) : 10);
            for (let i = 0; i < vouches.length; i++) {
                let user = message.guild.members.cache.has(vouches[i].userID) ? message.guild.members.cache.get(vouches[i].userID).user : false;
                const upVotes = (vouches[i].upVotes - vouches[i].downVotes).toLocaleString();
                if (user) {
                    if (i == 0) text += `🥇 ${user} with \`${upVotes}\` vouches (\`${vouches[i].upVotes.toLocaleString()}\`/\`${vouches[i].downVotes.toLocaleString()}\`)\n`;
                    else if (i == 1) text += `🥈 ${user} with \`${upVotes}\` vouches (\`${vouches[i].upVotes.toLocaleString()}\`/\`${vouches[i].downVotes.toLocaleString()}\`)\n`;
                    else if (i == 2) text += `🥉 ${user} with \`${upVotes}\` vouches (\`${vouches[i].upVotes.toLocaleString()}\`/\`${vouches[i].downVotes.toLocaleString()}\`)\n`;
                    else text += `\`${i + 1}.\` ${user} with \`${upVotes}\` vouches (\`${vouches[i].upVotes.toLocaleString()}\`/\`${vouches[i].downVotes.toLocaleString()}\`)\n`;
                };
            };
            return message.channel.send(embed.setDescription(text));
        } else {
            return message.channel.send(client.createRedEmbed(true, usage).setTitle('Leaderboard Manager').setDescription('You have to provide a leaderboard category!\n`vouches`, `levels`, `messages`, `currency`'));
        };
    };
};

function xpFor(level: number): number {
    return (level + 1) * (level + 1) * 100;
};