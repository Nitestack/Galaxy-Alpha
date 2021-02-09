import Command, { CommandRunner } from '@root/Command';
import ProfileSchema, { Profile } from '@models/profile';
import LevelSchema, { Level } from "@models/level";
import VouchSchema, { Vouch } from '@models/vouches';

export default class LeaderboardCommand extends Command {
    constructor(){
        super({
            name: "leaderboard",
            description: "shows the server's leaderboard of a category",
            guildOnly: true,
            usage: "leaderboard <messages/levels/invites/currency/vouches> [user amount]",
            aliases: ["lb"],
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const usage = `${prefix}${this.usage}`;
        if (args[0].toLowerCase() == 'messages') {
            const embed = client.createEmbed().setTitle(`${client.chatEmoji} Leaderboard`);
            let text: string = '';
            let users = (await LevelSchema.find({ guildID: message.guild.id }).sort({
                messages: -1
            }).limit(args[1] && !isNaN((args[1] as unknown as number)) ? parseInt(args[1]) : 10).catch(err => console.log(err)) as Array<Level>);
            users.forEach(user => {
                if (client.cache.levels.has(`${user.userID}-${message.guild.id}`)) users[users.findIndex(u => u.userID == user.userID)] = (client.cache.levels.get(`${user.userID}-${message.guild.id}`) as Level);
            });
            for (let i = 0; i < users.length; i++) {
                let user = message.guild.members.cache.has(users[i].userID) ? message.guild.members.cache.get(users[i].userID).user : false;
                if (user) {
                    if (i == 0) {
                        text += `🥇 ${user} with \`${users[i].messages.toLocaleString()}\` messages\n`;
                    } else if (i == 1) {
                        text += `🥈 ${user} with \`${users[i].messages.toLocaleString()}\` messages\n`;
                    } else if (i == 2) {
                        text += `🥉 ${user} with \`${users[i].messages.toLocaleString()}\` messages\n`;
                    } else {
                        text += `\`${i + 1}.\` ${user} with \`${users[i].messages.toLocaleString()}\` messages\n`;
                    };
                };
            };
            return message.channel.send(embed.setDescription(text));
        } else if (args[0].toLowerCase() == 'levels') {
            const embed = client.createEmbed().setTitle("🎚️ Leaderboard")
            let text: string = "";
            const users = (await LevelSchema.find({ guildID: message.guild.id }).sort({
                xp: -1
            }).limit(args[1] && !isNaN((args[1] as unknown as number)) ? parseInt(args[1]) : 10).catch(err => console.log(err)) as Array<Level>);
            users.forEach(user => {
                if (client.cache.levels.has(`${user.userID}-${message.guild.id}`)) users[users.findIndex(u => u.userID == user.userID)] = (client.cache.levels.get(`${user.userID}-${message.guild.id}`) as Level);
            });
            for (let i = 0; i < users.length; i++){
                let user = message.guild.members.cache.has(users[i].userID) ? message.guild.members.cache.get(users[i].userID) : false;
                if (user){
                    if (i == 0){
                        text += `🥇 ${user} on Level \`${users[i].level.toLocaleString()}\` (\`${users[i].xp.toLocaleString()}\`/\`${xpFor(users[i].level).toLocaleString()}\` XP)\n`
                    } else if (i == 1){
                        text += `🥈 ${user} on Level \`${users[i].level.toLocaleString()}\` (\`${users[i].xp.toLocaleString()}\`/\`${xpFor(users[i].level).toLocaleString()}\` XP)\n`
                    } else if (i == 2){
                        text += `🥉 ${user} on Level \`${users[i].level.toLocaleString()}\` (\`${users[i].xp.toLocaleString()}\`/\`${xpFor(users[i].level).toLocaleString()}\` XP)\n`
                    } else {
                        text += `\`${i + 1}.\` ${user} on Level \`${users[i].level.toLocaleString()}\` (\`${users[i].xp.toLocaleString()}\`/\`${xpFor(users[i].level).toLocaleString()}\` XP)\n`;
                    };
                };
            };
            return message.channel.send(embed.setDescription(text));
        } else if (args[0].toLowerCase() == 'invites') {
            
        } else if (args[0].toLowerCase() == 'currency') {
            const embed = client.createEmbed().setTitle(`💰 Leaderboard`);
            let text: string = '';
            const profilesWallet = (await ProfileSchema.find({}).sort({
                wallet: -1
            }).limit(args[1] && !isNaN((args[1] as unknown as number)) ? parseInt(args[1]) : 10).catch(err => console.log(err)) as Array<Profile>);
            profilesWallet.forEach(profile => {
                if (client.cache.currency.has(profile.userID)) profilesWallet[profilesWallet.findIndex(p => p.userID == profile.userID)] = (client.cache.currency.get(profile.userID) as Profile)
            });
            for (let i = 0; i < profilesWallet.length; i++) {
                let user = message.guild.members.cache.has(profilesWallet[i].userID) ? message.guild.members.cache.get(profilesWallet[i].userID).user : false;
                if (user && !client.developers.includes(user.id)) {
                    if (i == 0) {
                        text += `🥇 ${user} with \`${profilesWallet[i].wallet.toLocaleString()}\`$\n`;
                    } else if (i == 1) {
                        text += `🥈 ${user} with \`${profilesWallet[i].wallet.toLocaleString()}\`$\n`;
                    } else if (i == 2) {
                        text += `🥉 ${user} with \`${profilesWallet[i].wallet.toLocaleString()}\`$\n`;
                    } else {
                        text += `\`${i + 1}.\` ${user} with \`${profilesWallet[i].wallet.toLocaleString()}\`$\n`;
                    };
                };
            };
            return message.channel.send(embed.setDescription(text));
        } else if (args[0].toLowerCase() == 'vouches') {
            const embed = client.createEmbed().setTitle(":people_hugging: Leaderboard");
            let text: string = '';
            const vouches = (await VouchSchema.find({}).sort({
                upVotes: -1
            }).limit(args[1] && !isNaN((args[1] as unknown as number)) ? parseInt(args[1]) : 10).catch(err => console.log(err)) as Array<Vouch>);
            for (let i = 0; i < vouches.length; i++) {
                let user = message.guild.members.cache.has(vouches[i].userID) ? message.guild.members.cache.get(vouches[i].userID).user : false;
                const upVotes = (vouches[i].upVotes - vouches[i].downVotes).toLocaleString();
                if (user) {
                    if (i == 0) {
                        text += `🥇 ${user} with \`${upVotes}\` vouches (\`${vouches[i].upVotes.toLocaleString()}\`/\`${vouches[i].downVotes.toLocaleString()}\`)\n`;
                    } else if (i == 1) {
                        text += `🥈 ${user} with \`${upVotes}\` vouches (\`${vouches[i].upVotes.toLocaleString()}\`/\`${vouches[i].downVotes.toLocaleString()}\`)\n`;
                    } else if (i == 2) {
                        text += `🥉 ${user} with \`${upVotes}\` vouches (\`${vouches[i].upVotes.toLocaleString()}\`/\`${vouches[i].downVotes.toLocaleString()}\`)\n`;
                    } else {
                        text += `\`${i + 1}.\` ${user} with \`${upVotes}\` vouches (\`${vouches[i].upVotes.toLocaleString()}\`/\`${vouches[i].downVotes.toLocaleString()}\`)\n`;
                    };
                };
            };
            return message.channel.send(embed.setDescription(text));
        } else {
            return message.channel.send(client.createRedEmbed(true, usage).setTitle('Leaderboard Manager').setDescription('You have to provide a leaderboard category!'));
        };
    };
};

function xpFor(level: number): number {
    return (level + 1) * (level + 1)* 100;
};