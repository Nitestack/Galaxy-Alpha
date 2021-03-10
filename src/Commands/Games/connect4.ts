import Command, { CommandRunner } from "@root/Command";
import { Message, MessageReaction, User } from "discord.js";

const gameBoard = [];

const reactions = { "1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5, "6️⃣": 6, "7️⃣": 7 }

export default class Connect4Command extends Command {
    constructor() {
        super({
            name: "connect4",
            description: "starts a connect 4 game",
            category: "games",
            guildOnly: true,
            aliases: ["c4"],
            usage: "connect4 [@User/User ID]",
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const connect4Manager = "🟡 Connect 4 Manager";
        if (client.inGame.has(`${message.author.id}-${message.guild.id}-${this.name}`)) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(connect4Manager)
            .setDescription("You are already in a connect 4 game!"));
        let playerTwo: User;
        if (message.mentions.users.first() && message.guild.members.cache.has(message.mentions.users.first().id)) playerTwo = message.mentions.users.first();
        if (args[0] && message.guild.members.cache.has(args[0])) playerTwo = message.guild.members.cache.get(args[0]).user;
        if (playerTwo && playerTwo.id == message.author.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(connect4Manager)
            .setDescription("You cannot battle yourself!"));
        if (playerTwo && client.inGame.has(`${playerTwo.id}-${message.guild.id}-${this.name}`)) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(connect4Manager)
            .setDescription(`${playerTwo} is already in a connect 4 game!`));
        if (playerTwo) message.channel.send(`${playerTwo}`).then(msg => msg.delete({ timeout: 1 }));
        client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed()
            .setTitle(connect4Manager)
            .setDescription(`${playerTwo ? `${playerTwo}, do you want to accept ${message.author}'s battle request?\n\nYou have 30s to react!` : `Who wants to accept ${message.author}'s battle request?\n\nYou have 30s to react!`}`)), {
            title: connect4Manager,
            activity: "creating",
            toHandle: "Connect 4 game request"
        }, this.usage, (reaction, user) => {
            if (!playerTwo) playerTwo = user;
            let gameEmbed: Message = null;
            let boardMessage: Message = null;
            let redTurn = true;
            function gameBoardToString() {
                let str = "|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|\n"
                for (let y = 0; y < 7; y++) {
                    for (let x = 0; x < 7; x++) {
                        str += "|" + gameBoard[y * 7 + x];
                    };
                    str += "|\n";
                };
                return str;
            };
            for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) gameBoard[y * 7 + x] = "⚪";
            const gameOver = (winner: "🔴" | "🟡" | "tie") => {
                if (winner != "tie") gameEmbed.edit(winner == "🔴" ? message.author : playerTwo, gameEmbed.embeds[0].setAuthor(winner == "🔴" ? `${message.author.tag} wons!` : `${playerTwo.tag} wons!`, winner == "🔴" ? message.author.displayAvatarURL({ dynamic: true }) : playerTwo.displayAvatarURL({ dynamic: true })));
                else gameEmbed.edit(gameEmbed.embeds[0].setDescription(`There was a tie in this game!`));
                gameEmbed.reactions.removeAll();
                client.inGame.delete(`${message.author.id}-${message.guild.id}-${this.name}`);
                client.inGame.delete(`${playerTwo.id}-${message.guild.id}-${this.name}`);
                return;
            };
            message.channel.send(message.author, client.createEmbed()
                .setTitle('🟡 Connect 4')
                .setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**
                    ${message.author}, it's your turn!
                    To choose a field, use the reactions down below this embed and react with it!
                    You habe 30s to choose a field!`)).then(async emsg => {
                    gameEmbed = emsg;
                    Object.keys(reactions).forEach(async reaction => {
                        await gameEmbed.react(reaction);
                    });
                    await gameEmbed.react("❌");
                    waitForReaction();
                });
            return message.channel.send(gameBoardToString()).then(msg => boardMessage = msg);
            function step() {
                redTurn = !redTurn;
                gameEmbed.edit(playerTwo, gameEmbed.embeds[0].setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**
                    ${playerTwo}, it's your turn!
                    To choose a field, use the reactions down below this embed and react with it!
                    You habe 30s to choose a field!`));
                boardMessage.edit(gameBoardToString());
                waitForReaction();
            };
            function waitForReaction() {
                const turnReaction = gameEmbed.createReactionCollector((reaction: MessageReaction, user: User) => (Object.keys(reactions).includes(reaction.emoji.name) && (redTurn ? message.author.id == user.id : playerTwo.id == user.id)) || (reaction.emoji.name == "❌" && (message.author.id == user.id || playerTwo.id == user.id)), { max: 1, time: 30000 });
                turnReaction.on("collect", (reaction, user) => {
                    if (reaction.emoji.name == "❌") {
                        return gameOver(user.id == message.author.id ? "🟡" : "🔴");
                    } else {
                        const column = reactions[reaction.emoji.name] - 1;
                        let placedX = -1;
                        let placedY = -1;
                        for (let y = 7 - 1; y >= 0; y--) {
                            const chip = gameBoard[column + (y * 7)];
                            if (chip === "⚪") {
                                gameBoard[column + (y * 7)] = getChipFromTurn();
                                placedX = column;
                                placedY = y;
                                break;
                            };
                        };
                        reaction.users.remove(user.id).then(() => {
                            if (placedY == 0) gameEmbed.reactions.cache.get(reaction.emoji.name).remove();
                            if (hasWon(placedX, placedY)) gameOver(getChipFromTurn());
                            else if (isBoardFull()) gameOver("tie");
                            else step();
                            function isBoardFull() {
                                for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) if (gameBoard[y * 7 + x] === "⚪") return false;
                                return true;
                            };
                        });
                    };
                });
                turnReaction.on("end", (collected, reason) => {
                    if (collected.size == 0) return gameEmbed.edit(gameEmbed.embeds[0].setDescription(`The game has timed out!`).setAuthor(redTurn ? playerTwo.tag : message.author.tag, redTurn ? playerTwo.displayAvatarURL({ dynamic: true }) : message.author.displayAvatarURL({ dynamic: true })));
                });
            };
            function getChipFromTurn() {
                return redTurn ? "🔴" : "🟡";
            };
            function hasWon(placedX: number, placedY: number) {
                const chip = getChipFromTurn();
                //HORIZONTAL
                const y = placedY * 7;
                for (var i = Math.max(0, placedX - 3); i <= placedX; i++) {
                    var adj = i + y;
                    if (i + 3 < 7) if (gameBoard[adj] === chip && gameBoard[adj + 1] === chip && gameBoard[adj + 2] === chip && gameBoard[adj + 3] === chip) return true;
                };
                //VERTICLE
                for (var i = Math.max(0, placedY - 3); i <= placedY; i++) {
                    var adj = placedX + (i * 7);
                    if (i + 3 < 7) if (gameBoard[adj] === chip && gameBoard[adj + 7] === chip && gameBoard[adj + (2 * 7)] === chip && gameBoard[adj + (3 * 7)] === chip) return true;
                };
                //ASCENDING
                for (var i = -3; i <= 0; i++) {
                    var adjX = placedX + i;
                    var adjY = placedY + i;
                    var adj = adjX + (adjY * 7);
                    if (adjX + 3 < 7 && adjY + 3 < 7) if (gameBoard[adj] === chip && gameBoard[adj + 7 + 1] === chip && gameBoard[adj + (2 * 7) + 2] === chip && gameBoard[adj + (3 * 7) + 3] === chip) return true;
                };
                //DESCENDING
                for (var i = -3; i <= 0; i++) {
                    var adjX = placedX + i;
                    var adjY = placedY - i;
                    var adj = adjX + (adjY * 7);
                    if (adjX + 3 < 7 && adjY - 3 >= 0) if (gameBoard[adj] === chip && gameBoard[adj - 7 + 1] === chip && gameBoard[adj - (2 * 7) + 2] === chip && gameBoard[adj - (3 * 7) + 3] === chip) return true;
                };
                return false;
            };
        }, (reaction, user) => (playerTwo ? user.id == playerTwo.id : (user.id != message.author.id && !client.inGame.has(`${user.id}-${message.guild.id}-${this.name}`))) && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID));
    };
};