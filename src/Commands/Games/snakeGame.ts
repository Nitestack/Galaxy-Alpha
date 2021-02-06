import Command, { CommandRunner } from "@root/Command";

const WIDTH = 15;
const HEIGHT = 10;
const gameBoard = [];
const apple = { x: 1, y: 1 };

export default class SnakeGameCommand extends Command {
    constructor() {
        super({
            name: "snake",
            description: "starts a snake game",
            category: "games"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let snake = [{ x: 5, y: 5 }];
        let snakeLength = 1;
        let score = 0;
        let gameEmbed = null;
        let inGame = false;
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                gameBoard[y * WIDTH + x] = "🟦";
            }
        }
        function gameBoardToString() {
            let str = ""
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (x == apple.x && y == apple.y) {
                        str += "🍎";
                        continue;
                    }

                    let flag = true;
                    for (let s = 0; s < snake.length; s++) {
                        if (x == snake[s].x && y == snake[s].y) {
                            str += "🟩";
                            flag = false;
                        }
                    }

                    if (flag)
                        str += gameBoard[y * WIDTH + x];
                }
                str += "\n";
            }
            return str;
        }
        function isLocInSnake(pos) {
            return snake.find(sPos => sPos.x == pos.x && sPos.y == pos.y);
        };

        function newAppleLoc() {
            let newApplePos = { x: 0, y: 0 };
            do {
                newApplePos = { x: parseInt(Math.random() * WIDTH), y: parseInt(Math.random() * HEIGHT) };
            } while (isLocInSnake(newApplePos))

            apple.x = newApplePos.x;
            apple.y = newApplePos.y;
        }
        if (inGame)
            return;

        inGame = true;
        score = 0;
        snakeLength = 1;
        snake = [{ x: 5, y: 5 }];
        newAppleLoc();
        const embed = client.createEmbed()
            .setTitle('Snake Game')
            .setDescription(gameBoardToString())

        message.channel.send(embed).then(emsg => {
            gameEmbed = emsg;
            gameEmbed.react('⬅️');
            gameEmbed.react('⬆️');
            gameEmbed.react('⬇️');
            gameEmbed.react('➡️');

            waitForReaction();
        });

        function step() {
            if (apple.x == snake[0].x && apple.y == snake[0].y) {
                score += 1;
                snakeLength++;
                newAppleLoc();
            }

            const editEmbed = client.createEmbed()
                .setTitle('Snake Game')
                .setDescription(gameBoardToString())
            gameEmbed.edit(editEmbed);

            waitForReaction();
        }

        function gameOver() {
            inGame = false;
            const editEmbed = client.createEmbed()
                .setTitle('Snake Game')
                .setDescription("GAME OVER!\nSCORE: " + score)
            gameEmbed.edit(editEmbed);

            gameEmbed.reactions.removeAll()
        }

        function filter(reaction, user) {
            return ['⬅️', '⬆️', '⬇️', '➡️'].includes(reaction.emoji.name) && user.id !== gameEmbed.author.id;
        }

        function waitForReaction() {
            gameEmbed.awaitReactions((reaction, user) => filter(reaction, user), { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();

                    const snakeHead = snake[0];
                    const nextPos = { x: snakeHead.x, y: snakeHead.y };
                    if (reaction.emoji.name === '⬅️') {
                        let nextX = snakeHead.x - 1;
                        if (nextX < 0)
                            nextX = WIDTH - 1;
                        nextPos.x = nextX;
                    }
                    else if (reaction.emoji.name === '⬆️') {
                        let nextY = snakeHead.y - 1;
                        if (nextY < 0)
                            nextY = HEIGHT - 1;
                        nextPos.y = nextY;
                    }
                    else if (reaction.emoji.name === '⬇️') {
                        let nextY = snakeHead.y + 1;
                        if (nextY >= HEIGHT)
                            nextY = 0;
                        nextPos.y = nextY;
                    }
                    else if (reaction.emoji.name === '➡️') {
                        let nextX = snakeHead.x + 1;
                        if (nextX >= WIDTH)
                            nextX = 0;
                        nextPos.x = nextX;
                    }

                    reaction.users.remove(reaction.users.cache.filter(user => user.id !== gameEmbed.author.id).first().id).then(() => {
                        if (isLocInSnake(nextPos)) {
                            gameOver();
                        }
                        else {
                            snake.unshift(nextPos);
                            if (snake.length > snakeLength)
                                snake.pop();

                            step();
                        }
                    });
                })
                .catch(collected => {
                    gameOver();
                });
        }
    }
};