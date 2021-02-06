import Command, { CommandRunner } from "@root/Command";

const WIDTH = 7;
const HEIGHT = 7;
const gameBoard = [];

const reactions = { "1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5, "6️⃣": 6, "7️⃣": 7 }

export default class Connect4Command extends Command {
    constructor() {
        super({
            name: "connect4",
            description: "starts a connect 4 game",
            category: "games"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let gameEmbed = null;
        let inGame = false;
        let redTurn = true;

        function gameBoardToString() {
            let str = "| . 1 | . 2 | 3 | . 4 | . 5 | 6 | . 7 |\n"
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    str += "|" + gameBoard[y * WIDTH + x];
                }
                str += "|\n";
            }
            return str;
        }

        if (inGame)
                return;

            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    gameBoard[y * WIDTH + x] = "⚪";
                }
            }

            inGame = true;
            const embed = client.createEmbed()
                .setTitle('Connect-4')
                .setDescription(gameBoardToString())
                .addField('Turn:', getChipFromTurn())

            message.channel.send(embed).then(emsg => {
                gameEmbed = emsg;
                Object.keys(reactions).forEach(reaction => {
                    gameEmbed.react(reaction);
                });

                waitForReaction();
            });

        function step() {
            redTurn = !redTurn;
            const editEmbed = client.createEmbed()
                .setTitle('Connect-4')
                .setDescription(gameBoardToString())
                .addField('Turn:', getChipFromTurn())
            gameEmbed.edit(editEmbed);

            waitForReaction();
        }

        function gameOver(winner) {
            inGame = false;
            const editEmbed = client.createEmbed()
                .setTitle('Connect-4')
                .setDescription("GAME OVER! " + getWinnerText(winner))
            gameEmbed.edit(editEmbed);
            gameEmbed.reactions.removeAll();
        }

        function filter(reaction, user) {
            return Object.keys(reactions).includes(reaction.emoji.name) && user.id !== gameEmbed.author.id;
        }

        function waitForReaction() {
            gameEmbed.awaitReactions((reaction, user) => filter(reaction, user), { max: 1, time: 300000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    const column = reactions[reaction.emoji.name] - 1;
                    let placedX = -1;
                    let placedY = -1;

                    for (let y = HEIGHT - 1; y >= 0; y--) {
                        const chip = gameBoard[column + (y * WIDTH)];
                        if (chip === "⚪") {
                            gameBoard[column + (y * WIDTH)] = getChipFromTurn();
                            placedX = column;
                            placedY = y;
                            break;
                        }
                    }

                    reaction.users.remove(reaction.users.cache.filter(user => user.id !== gameEmbed.author.id).first().id).then(() => {
                        if (placedY == 0)
                            gameEmbed.reactions.cache.get(reaction.emoji.name).remove();

                        if (hasWon(placedX, placedY)) {
                            gameOver(getChipFromTurn());
                        }
                        else if (isBoardFull()) {
                            gameOver("tie");
                        }
                        else {
                            step();
                        }
                    });
                })
                .catch(collected => {
                    gameOver("timeout");
                });
        }

        function getChipFromTurn() {
            return redTurn ? "🔴" : "🟡";
        }

        function hasWon(placedX, placedY) {
            const chip = getChipFromTurn();

            //Horizontal Check
            const y = placedY * WIDTH;
            for (var i = Math.max(0, placedX - 3); i <= placedX; i++) {
                var adj = i + y;
                if (i + 3 < WIDTH) {
                    if (gameBoard[adj] === chip && gameBoard[adj + 1] === chip && gameBoard[adj + 2] === chip && gameBoard[adj + 3] === chip)
                        return true;
                }
            }

            //Verticle Check
            for (var i = Math.max(0, placedY - 3); i <= placedY; i++) {
                var adj = placedX + (i * WIDTH);
                if (i + 3 < HEIGHT) {
                    if (gameBoard[adj] === chip && gameBoard[adj + WIDTH] === chip && gameBoard[adj + (2 * WIDTH)] === chip && gameBoard[adj + (3 * WIDTH)] === chip)
                        return true;
                }
            }

            //Ascending Diag
            for (var i = -3; i <= 0; i++) {
                var adjX = placedX + i;
                var adjY = placedY + i;
                var adj = adjX + (adjY * WIDTH);
                if (adjX + 3 < WIDTH && adjY + 3 < HEIGHT) {
                    if (gameBoard[adj] === chip && gameBoard[adj + WIDTH + 1] === chip && gameBoard[adj + (2 * WIDTH) + 2] === chip && gameBoard[adj + (3 * WIDTH) + 3] === chip)
                        return true;
                }
            }

            //Descending Diag
            for (var i = -3; i <= 0; i++) {
                var adjX = placedX + i;
                var adjY = placedY - i;
                var adj = adjX + (adjY * WIDTH);
                if (adjX + 3 < WIDTH && adjY - 3 >= 0) {
                    if (gameBoard[adj] === chip && gameBoard[adj - WIDTH + 1] === chip && gameBoard[adj - (2 * WIDTH) + 2] === chip && gameBoard[adj - (3 * WIDTH) + 3] === chip)
                        return true;
                }
            }

            return false;
        }

        function isBoardFull() {
            for (let y = 0; y < HEIGHT; y++)
                for (let x = 0; x < WIDTH; x++)
                    if (gameBoard[y * WIDTH + x] === "⚪")
                        return false;
            return true;
        }

        function getWinnerText(winner) {
            if (winner === "🔴" || winner === "🟡")
                return winner + " Has Won!";
            else if (winner == "tie")
                return "It was a tie!";
            else if (winner == "timeout")
                return "The game went unfinished :(";
        }
    };
};