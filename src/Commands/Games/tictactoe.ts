import Command, { CommandRunner } from '@root/Command';
import { Message, User } from 'discord.js';

export default class TicTacToeCommand extends Command {
    constructor() {
        super({
            name: "tictactoe",
            description: "starts a tic tac toe game",
            usage: "tictactoe [@User/User ID]",
            aliases: ["ttt"],
            guildOnly: true,
            category: "games",
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const tictactoeManager = "⭕ Tic Tac Toe Manager";
        if (client.inGame.has(`${message.author.id}-${message.guild.id}-${this.name}`)) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(tictactoeManager)
            .setDescription("You are already in a tic tac toe game!"));
        let playerTwo: User;
        const usage: string = `${prefix}tictactoe <@User/User ID>`;
        if (message.mentions.users.first()) playerTwo = message.guild.members.cache.get(message.mentions.users.first().id).user;
        if (args[0] && message.guild.members.cache.has(args[0])) playerTwo = message.guild.members.cache.get(args[0]).user;
        if (playerTwo && playerTwo.id == message.author.id) return message.channel.send(client.createRedEmbed(true, usage)
            .setTitle(tictactoeManager)
            .setDescription("You cannot battle yourself!"));
        if (playerTwo && client.inGame.has(`${playerTwo.id}-${message.guild.id}-${this.name}`)) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(tictactoeManager)
            .setDescription(`${playerTwo} is already in a tic tac toe game!`));
        if (playerTwo) message.channel.send(`${playerTwo}`).then(msg => msg.delete({ timeout: 1 }));
        client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed()
            .setTitle(tictactoeManager)
            .setDescription(`${playerTwo ? `${playerTwo}, do you want to accept ${message.author}'s battle request?\n\nYou have 30s to react!` : `Who wants to accept ${message.author}'s battle request?\n\nYou have 30s to react!`}`)), {
            title: tictactoeManager,
            activity: "creating",
            toHandle: "Tic Tac Toe game request"
        }, this.usage, (reaction, user) => {
            if (!playerTwo) playerTwo = user;
            let field: Array<string> = ['⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛'];
            let availableFields: Array<string> = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];
            let playersGo: number = 0;
            let sendMessage: boolean = true;
            let playingGame: boolean = true;
            let tttMessage: Message = null;
            let embedMessage: Message = null;
            let userSelection: number;
            client.inGame.set(`${message.author.id}-${message.guild.id}-${this.name}`, {
                userID: message.author.id,
                guildID: message.guild.id,
                game: "Tic Tac Toe"
            });
            client.inGame.set(`${playerTwo.id}-${message.guild.id}-${this.name}`, {
                userID: playerTwo.id,
                guildID: message.guild.id,
                game: "Tic Tac Toe"
            });
            run();
            async function run() {
                await eval_win()
                if (playingGame == true) {
                    if (playersGo % 2 == 0) {
                        if (sendMessage == true) {
                            let grid = await ttt_grid();
                            if (playersGo == 0) {
                                embedMessage = await message.channel.send(message.author, client.createEmbed()
                                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**
                                    ${message.author}, it's your turn!
                                    To set your marker type the field name (a2, b3) in the channel!
                                    You have 30s to choose a field!
                                    **Available Fields:** ${availableFields.join(", ")}`)
                                    .setTitle("⭕ Tic Tac Toe"));
                                tttMessage = await message.channel.send(grid);
                            } else {
                                tttMessage.edit(grid);
                                embedMessage.edit(message.author, embedMessage.embeds[0]
                                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**
                                    ${message.author}, it's your turn!
                                    To set your marker type the field name (a2, b3) in the channel!
                                    You have 30s to choose a field!
                                    **Available Fields:** ${availableFields.join(", ")}`));
                            };
                        };
                        message.channel.awaitMessages(m => (m.author.id == message.author.id && availableFields.includes(m.content.toLowerCase())) || ((m.author.id == playerTwo.id || m.author.id == message.author.id) && m.content.toLowerCase() == "cancel"),
                            { max: 1, time: 30000 }).then(async collected => {
                                const msg = collected.first();
                                msg.delete();
                                if (msg.content.toLowerCase() == 'a1' && availableFields.includes(msg.content.toLowerCase())) userSelection = 0;
                                if (msg.content.toLowerCase() == 'a2' && availableFields.includes(msg.content.toLowerCase())) userSelection = 1;
                                if (msg.content.toLowerCase() == 'a3' && availableFields.includes(msg.content.toLowerCase())) userSelection = 2;
                                if (msg.content.toLowerCase() == 'b1' && availableFields.includes(msg.content.toLowerCase())) userSelection = 3;
                                if (msg.content.toLowerCase() == 'b2' && availableFields.includes(msg.content.toLowerCase())) userSelection = 4;
                                if (msg.content.toLowerCase() == 'b3' && availableFields.includes(msg.content.toLowerCase())) userSelection = 5;
                                if (msg.content.toLowerCase() == 'c1' && availableFields.includes(msg.content.toLowerCase())) userSelection = 6;
                                if (msg.content.toLowerCase() == 'c2' && availableFields.includes(msg.content.toLowerCase())) userSelection = 7;
                                if (msg.content.toLowerCase() == 'c3' && availableFields.includes(msg.content.toLowerCase())) userSelection = 8;
                                if (msg.content.toLowerCase() == 'cancel') playingGame = false;
                                if (!playingGame) {
                                    embedMessage.edit(embedMessage.embeds[0].setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**\nThe game was cancelled!`).setAuthor(`${msg.author.id == playerTwo.id ? message.author.tag : playerTwo.tag} wons!`, (msg.author.id == playerTwo.id ? message.author : playerTwo).displayAvatarURL({ dynamic: true })));
                                    return end_game(playerTwo, message);
                                };
                                if (availableFields.includes(msg.content.toLowerCase())) {
                                    field[userSelection] = '❌';
                                    const indexOfChoice = availableFields.indexOf(msg.content.toLowerCase());
                                    availableFields.splice(indexOfChoice, 1);
                                    playersGo++;
                                    sendMessage = true;
                                    run();
                                }
                            }).catch(() => {
                                embedMessage.edit(embedMessage.embeds[0].setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**\nThe game has timed out!`).setAuthor(`${playerTwo.tag} wons!`, playerTwo.displayAvatarURL({ dynamic: true })));
                                end_game(playerTwo, message);
                            });
                    };
                    if (playersGo % 2 == 1) {
                        if (sendMessage == true) {
                            let grid = await ttt_grid();
                            tttMessage.edit(grid);
                            embedMessage.edit(playerTwo, embedMessage.embeds[0]
                                .setAuthor(playerTwo.tag, playerTwo.displayAvatarURL({ dynamic: true }))
                                .setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**
                                ${playerTwo}, it's your turn!
                                To set your marker type the field name (a2, b3) in the channel!
                                You have 30s to choose a field!
                                **Available Fields:** ${availableFields.join(", ")}`));
                            message.channel.awaitMessages(m => (m.author.id == playerTwo.id && availableFields.includes(m.content.toLowerCase())) || ((m.author.id == playerTwo.id || m.author.id == message.author.id) && m.content.toLowerCase() == "cancel"),
                                { max: 1, time: 30000 }).then(async collected => {
                                    const msg = collected.first();
                                    msg.delete();
                                    if (msg.content.toLowerCase() == 'a1' && availableFields.includes(msg.content.toLowerCase())) userSelection = 0;
                                    if (msg.content.toLowerCase() == 'a2' && availableFields.includes(msg.content.toLowerCase())) userSelection = 1;
                                    if (msg.content.toLowerCase() == 'a3' && availableFields.includes(msg.content.toLowerCase())) userSelection = 2;
                                    if (msg.content.toLowerCase() == 'b1' && availableFields.includes(msg.content.toLowerCase())) userSelection = 3;
                                    if (msg.content.toLowerCase() == 'b2' && availableFields.includes(msg.content.toLowerCase())) userSelection = 4;
                                    if (msg.content.toLowerCase() == 'b3' && availableFields.includes(msg.content.toLowerCase())) userSelection = 5;
                                    if (msg.content.toLowerCase() == 'c1' && availableFields.includes(msg.content.toLowerCase())) userSelection = 6;
                                    if (msg.content.toLowerCase() == 'c2' && availableFields.includes(msg.content.toLowerCase())) userSelection = 7;
                                    if (msg.content.toLowerCase() == 'c3' && availableFields.includes(msg.content.toLowerCase())) userSelection = 8;
                                    if (msg.content.toLowerCase() == 'cancel') playingGame = false;
                                    if (!playingGame) {
                                        embedMessage.edit(embedMessage.embeds[0].setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**\nThe game was cancelled!`).setAuthor(`${msg.author.id == playerTwo.id ? message.author.tag : playerTwo.tag} wons!`, (msg.author.id == playerTwo.id ? message.author : playerTwo).displayAvatarURL({ dynamic: true })));
                                        return end_game(playerTwo, message);
                                    };
                                    if (availableFields.includes(msg.content.toLowerCase())) {
                                        field[userSelection] = '⭕';
                                        const indexOfChoice = availableFields.indexOf(msg.content.toLowerCase());
                                        availableFields.splice(indexOfChoice, 1);
                                        playersGo++;
                                        sendMessage = true;
                                        run();
                                    };
                                }).catch(() => {
                                    embedMessage.edit(embedMessage.embeds[0].setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**\nThe game has timed out!`).setAuthor(`${message.author.tag} wons!`, message.author.displayAvatarURL({ dynamic: true })));
                                    end_game(playerTwo, message);
                                });
                        };
                    };
                };
            };
            async function ttt_grid() {
                return `⏺️1️⃣2️⃣3️⃣\n:regional_indicator_a:${field[0]}${field[1]}${field[2]}\n:regional_indicator_b:${field[3]}${field[4]}${field[5]}\n:regional_indicator_c:${field[6]}${field[7]}${field[8]}`;
            };
            async function eval_win() {
                const win_combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
                let step_one = -1;
                while (step_one < 7) {
                    step_one++
                    if (field[win_combinations[step_one][0]] == '❌' && field[win_combinations[step_one][1]] == '❌' && field[win_combinations[step_one][2]] == '❌') {
                        tttMessage.edit(await ttt_grid());
                        embedMessage.edit(message.author, embedMessage.embeds[0].setAuthor(`${message.author.tag} wons!`, message.author.displayAvatarURL({ dynamic: true })));
                        end_game(playerTwo, message);
                    };
                    if (field[win_combinations[step_one][0]] == '⭕' && field[win_combinations[step_one][1]] == '⭕' && field[win_combinations[step_one][2]] == '⭕') {
                        tttMessage.edit(await ttt_grid());
                        embedMessage.edit(playerTwo, embedMessage.embeds[0].setAuthor(`${playerTwo.tag} wons!`, playerTwo.displayAvatarURL({ dynamic: true })));
                        end_game(playerTwo, message);
                    };
                    if (playersGo == 9 && step_one == 7) {
                        tttMessage.edit(await ttt_grid());
                        embedMessage.edit(embedMessage.embeds[0].setAuthor("You drew"));
                        end_game(playerTwo, message);
                    };
                };
            };
            const end_game = (playerTwo: User, message: Message) => {
                client.inGame.delete(`${message.author.id}-${message.guild.id}-${this.name}`);
                client.inGame.delete(`${playerTwo.id}-${message.guild.id}-${this.name}`);
                playingGame = false;
                return availableFields = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];
            };
        }, (reaction, user) => (playerTwo ? user.id == playerTwo.id : (user.id != message.author.id && !client.inGame.has(`${user.id}-${message.guild.id}-${this.name}`))) && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID));
    };
};