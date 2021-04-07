import Command, { CommandRunner } from "@root/Command";

export default class extends Command {
    constructor() {
        super({
            name: "minesweeper",
            description: "starts a minesweeper game",
            category: "games",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {

    };
};
import Discord, { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
interface GameResult {
    result: ResultType;
    error?: string;
    name?: string;
};
enum ResultType {
    TIMEOUT,
    FORCE_END,
    WINNER,
    TIE,
    ERROR,
};
const WIDTH = 9;
const HEIGHT = 8;
const gameBoard: string[] = [];
const bombLocs: boolean[] = [];
const charMap = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
class MinesweeperGame {
    private flagging = false;
    private gameStarter: User;
    private player2: User;
    private reactions: Array<string>;
    private gameEmbed: Message;
    private gameBoardToString(links = true): string {
        let str = "";
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const index = y * WIDTH + x;
                if (gameBoard[index] == "⬜" || gameBoard[index] == "🚩") {
                    if (links) str += "[" + gameBoard[index] + "](http://theturkey.dev/" + charMap[x] + charMap[y] + (x == 2 && y == 2 ? "2" : "") + ")";
                    else str += gameBoard[index];
                } else str += gameBoard[index];
            };
            str += "\n";
        };
        return str;
    };
    public newGame(msg: Message, player2: User | null): void {
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                gameBoard[y * WIDTH + x] = "⬜";
                bombLocs[y * WIDTH + x] = false;
            };
        };
        for (let i = 0; i < 7; i++) {
            const x = this.getRandomInt(WIDTH);
            const y = this.getRandomInt(HEIGHT);
            const index = y * WIDTH + x;
            if (!bombLocs[index]) bombLocs[index] = true;
            else i--;
        };
        this.flagging = false;
        this.gameStarter = msg.author;
        this.player2 = player2;
        this.reactions = ['👆', '🚩'];
        msg.channel.send(msg.author, this.getEmbed()).then(async emsg => {
            this.gameEmbed = emsg;
            for (const emoji of this.reactions) await emsg.react(emoji);
            const filter = (reaction: MessageReaction, user: User): boolean => {
                if (this.reactions.includes(reaction.emoji.name)) {
                    if (this.player1Turn && user.id === this.gameStarter.id) return true;
                    if (!this.player1Turn && this.player2 != null && user.id === this.player2.id) return true;
                    if (!this.player1Turn && this.player2 === null && user.id === this.gameStarter.id) return true;
                };
                return false;
            };
        });
    };
    private waitForReaction() {
        this.gameEmbed.awaitReactions((reaction: MessageReaction, user: User) => filter(reaction, user), { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                if (reaction !== undefined) this.onReaction(reaction);
            }).catch(collected => {
                if (typeof collected === 'string') this.gameOver({ result: ResultType.ERROR, error: collected });
                else this.gameOver({ result: ResultType.TIMEOUT });
            });
    };
    private getEmbed(): MessageEmbed {
        return new Discord.MessageEmbed()
            .setColor('#c7c7c7')
            .setTitle('Minesweeper')
            .setAuthor("Made By: TurkeyDev", "https://site.theturkey.dev/images/turkey_avatar.png", "https://twitter.com/turkeydev")
            .setDescription(this.gameBoardToString())
            .addField(this.flagging ? 'Flagging' : 'Clicking', this.flagging ? '🚩' : '👆', false)
            .addField('How To Play:', 'Click on a square above and visit the url to reveal, or flag the tile!', false)
            .setFooter(`Currently Playing: ${this.gameStarter.username}`)
            .setTimestamp();
    };
    private getGameOverEmbed(result: GameResult): MessageEmbed {
        return new Discord.MessageEmbed()
            .setColor('#c7c7c7')
            .setTitle('Minesweeper')
            .setAuthor("Made By: TurkeyDev", "https://site.theturkey.dev/images/turkey_avatar.png", "https://twitter.com/turkeydev")
            .setDescription(`**GAME OVER!**\n${result.name}\n\n${this.gameBoardToString(false)}`)
            .setTimestamp();
    };
    private step(): void {
        let lose = false;
        let win = true;
        for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
            const index = y * WIDTH + x;
            if (gameBoard[index] == "⬜" && !bombLocs[index]) win = false;
            if (gameBoard[index] == "💣") lose = true;
            if (gameBoard[index] == "🚩" && !bombLocs[index]) win = false;
        };
        if (win) this.gameOver({ result: ResultType.WINNER, name: "YOU WON" });
        else if (lose) {
            this.showBombs();
            this.gameOver({ result: ResultType.WINNER, name: "YOU LOST" });
        } else {
            this.gameEmbed.edit(this.getthis.getEmbed());
            this.waitForReaction();
        };
    };
    private onReaction(reaction: MessageReaction): void {
        if (reaction.emoji.name == '👆') this.flagging = false;
        else if (reaction.emoji.name == '🚩') this.flagging = true;
        reaction.users.remove(reaction.users.cache.filter(user => user.id !== this.gameEmbed.author.id).first()?.id).then(() => {
            this.step();
        });
    };
    private showBombs(): void {
        for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) if (bombLocs[y * WIDTH + x]) gameBoard[y * WIDTH + x] = "💣";
    };
    private uncover(col: number, row: number) {
        const index = row * WIDTH + col;
        if (bombLocs[index]) gameBoard[index] = "💣";
        else {
            let bombsArround = 0;
            for (let y = -1; y < 2; y++) for (let x = -1; x < 2; x++) {
                if (col + x < 0 || col + x >= WIDTH || row + y < 0 || row + y >= HEIGHT) continue;
                if (x == 0 && y == 0) continue;
                const i2 = (row + y) * WIDTH + (col + x);
                if (bombLocs[i2]) bombsArround++;
            };
            if (bombsArround == 0) {
                gameBoard[index] = "⬛";
                for (let y = -1; y < 2; y++) for (let x = -1; x < 2; x++) {
                    if (col + x < 0 || col + x >= WIDTH || row + y < 0 || row + y >= HEIGHT) continue;
                    if (x == 0 && y == 0) continue;
                    const i2 = (row + y) * WIDTH + (col + x);
                    if (gameBoard[i2] == "⬜") this.uncover(col + x, row + y);
                };
            } else if (bombsArround == 1) {
                gameBoard[index] = "1️⃣";
            } else if (bombsArround == 2) {
                gameBoard[index] = "2️⃣";
            } else if (bombsArround == 3) {
                gameBoard[index] = "3️⃣";
            } else if (bombsArround == 4) {
                gameBoard[index] = "4️⃣";
            } else if (bombsArround == 5) {
                gameBoard[index] = "5️⃣";
            } else if (bombsArround == 6) {
                gameBoard[index] = "6️⃣";
            } else if (bombsArround == 7) {
                gameBoard[index] = "7️⃣";
            } else if (bombsArround == 8) {
                gameBoard[index] = "8️⃣";
            };
        };
    };
    public makeMove(col: number, row: number) {
        const index = row * WIDTH + col;
        if (gameBoard[index] == "⬜") {
            if (this.flagging) gameBoard[index] = "🚩";
            else this.uncover(col, row);
            this.step();
        } else if (gameBoard[index] == "🚩" && this.flagging) gameBoard[index] = "⬜";
    };
    private getRandomInt(max: number): number {
        return Math.floor(Math.random() * Math.floor(max));
    };
};