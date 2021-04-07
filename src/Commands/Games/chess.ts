import { Message, MessageEmbed, User } from 'discord.js';
import { Position, GameResult, ResultType } from "@commands/Games/Constants";
import Command, { CommandRunner } from "@root/Command";

const pawnEvalWhite: Array<Array<number>> =
    [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
        [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
        [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
        [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
        [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
        [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    ];
const pawnEvalBlack: Array<Array<number>> = pawnEvalWhite.slice().reverse();
const knightEval: Array<Array<number>> =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
        [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
        [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
        [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
        [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
        [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];
const bishopEvalWhite: Array<Array<number>> = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];
const bishopEvalBlack: Array<Array<number>> = bishopEvalWhite.slice().reverse();
const rookEvalWhite: Array<Array<number>> = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
];
const rookEvalBlack: Array<Array<number>> = rookEvalWhite.slice().reverse();
const evalQueen: Array<Array<number>> = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];
const kingEvalWhite: Array<Array<number>> = [

    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
];
const kingEvalBlack: Array<Array<number>> = kingEvalWhite.slice().reverse();
interface Move {
    fx: number;
    fy: number;
    tx: number;
    ty: number;
    replaced: number;
};
interface MoveCheck {
    valid: boolean;
    msg: string;
};

export default class ChessCommand extends Command {
    constructor() {
        super({
            name: "chess",
            description: "starts a chess game",
            category: "games",
            guildOnly: true,
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    };
    run: CommandRunner = async (client, message, args: Array<string>, prefix) => {
        const usage: string = `${prefix}tictactoe <@User/User ID>`;
        const tictactoeManager = "♟️ Chess Manager";
        if (client.inGame.has(`${message.author.id}-${message.guild.id}-${this.name}`)) return message.channel.send(client.createRedEmbed(true, `${prefix}${usage}`)
            .setTitle(tictactoeManager)
            .setDescription("You are already in a chess game!"));
        const startGame = async (user: User | "BOT") => {
            let aiMoveStack: Array<Move> = [];
            let playerOneTurn: boolean;
            let gameBoard: Array<number> = [];
            let selectedMove: Move = { fx: -1, fy: -1, tx: -1, ty: -1, replaced: -1 };
            let selecting = true;
            let errorMessage = "\u200b";
            let gameEmbed: Message;
            const playerTwo: User = user != "BOT" ? user : client.user;
            client.inGame.set(`${message.author.id}-${message.guild.id}-${this.name}`, {
                userID: message.author.id,
                guildID: message.guild.id,
                game: "Chess"
            });
            if (playerTwo.id != client.user.id) client.inGame.set(`${playerTwo.id}-${message.guild.id}-${this.name}`, {
                userID: playerTwo.id,
                guildID: message.guild.id,
                game: "Chess"
            });
            gameBoard = [
                2, 3, 4, 5, 6, 4, 3, 2,
                1, 1, 1, 1, 1, 1, 1, 1,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                11, 11, 11, 11, 11, 11, 11, 11,
                12, 13, 14, 15, 16, 14, 13, 12
            ];
            playerOneTurn = true;
            selectedMove = { fx: -1, fy: -1, tx: -1, ty: -1, replaced: -1 };
            selecting = true;
            errorMessage = "\u200b";
            gameEmbed = await message.channel.send(message.author, getEmbed());
            await waitForMessage();
            function getDisplayForTurn(): User {
                return playerOneTurn ? message.author : playerTwo;
            };
            async function step() {
                gameEmbed.edit(getDisplayForTurn(), getEmbed());
                await waitForMessage();
            };
            async function waitForMessage() {
                const filter = (message: Message) => {
                    if (playerOneTurn && message.author.id == message.author.id) return true;
                    if (!playerOneTurn && playerTwo != null && message.author.id == playerTwo.id) return true;
                    if (!playerOneTurn && playerTwo == null && message.author.id == message.author.id) return true;
                };
                const msg = (await message.channel.awaitMessages(m => filter(m), { max: 1 })).first();
                if (msg) {
                    if (msg.content.toLowerCase() == "cancel") {
                        playerOneTurn = !playerOneTurn;
                        return gameOver({ result: ResultType.FORCE_END, name: getDisplayForTurn().username })
                    };
                    //A1-B2
                    await msg.delete();
                    if (msg.content.trim().length != 5) {
                        errorMessage = "Invalid move syntax!";
                        await step();
                    };
                    const validLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
                    const validNumbers = ["1", "2", "3", "4", "5", "6", "7", "8"];
                    const firstMove1 = msg.content.trim()[0].toUpperCase();
                    const firstMove2 = msg.content.trim()[1].toUpperCase();
                    const secondMove1 = msg.content.trim()[3].toUpperCase();
                    const secondMove2 = msg.content.trim()[4].toUpperCase();
                    if (!validLetters.includes(firstMove1) || !validLetters.includes(secondMove1) || !validNumbers.includes(firstMove2) || !validNumbers.includes(secondMove2)) {
                        errorMessage = "Invalid move syntax!";
                        await step();
                    };
                    onMessage(firstMove1);
                    onMessage(firstMove2);
                    onMessage("accept");
                    onMessage(secondMove1);
                    onMessage(secondMove2);
                    onMessage("accept", true);
                };
            };
            function getEmbed(): MessageEmbed {
                return client.createEmbed()
                    .setTitle("♟️ Chess")
                    .setAuthor(getDisplayForTurn().tag, getDisplayForTurn().displayAvatarURL({ dynamic: true }))
                    .setDescription(`**${message.author.tag} vs. ${playerTwo.tag}**
                        ${getDisplayForTurn()}, it's your turn!
                        To move a piece, just send a message in the message.channel with this format: \`A1-B2\` (Piece on A1 moves to B2)!`)
                    .setImage(`https://api.theturkey.dev/discordgames/genchessboard?gb=${gameBoard.join(",")}&s1=${selectedMove.fx},${selectedMove.fy}&s2=${selectedMove.tx},${selectedMove.ty}`)
                    .addField("Message:", errorMessage)
                    .addField("How to cancel?", "Simply type `cancel` to cancel the process!");
            };
            function getGameOverEmbed(result: GameResult): MessageEmbed {
                return client.createEmbed()
                    .setTitle("♟️ Chess")
                    .setAuthor(`${getDisplayForTurn().tag} wons!`, getDisplayForTurn().displayAvatarURL({ dynamic: true }))
                    .setDescription(getWinnerText(result))
                    .setImage(`https://api.theturkey.dev/discordgames/genchessboard?gb=${gameBoard.join(",")}&s1=${selectedMove.fx},${selectedMove.fy}&s2=${selectedMove.tx},${selectedMove.ty}`)
            };
            function getWinnerText(result: GameResult) {
                if (result.result == ResultType.TIE) return 'It was a tie!';
                else if (result.result == ResultType.TIMEOUT) return 'The game went unfinished :(';
                else if (result.result == ResultType.FORCE_END) return 'The game was ended';
                else if (result.result == ResultType.ERROR) return 'ERROR: ' + result.error;
                else return result.name + ' has won!';
            };
            function endTurn(): void {
                let blackKing = false;
                let whiteKing = false;
                for (const p of gameBoard) {
                    if (p == 6) blackKing = true;
                    else if (p == 16) whiteKing = true;
                };
                if (!blackKing || !whiteKing) gameOver({ result: ResultType.WINNER, name: getDisplayForTurn().username });
                playerOneTurn = !playerOneTurn;
                if (!playerOneTurn && playerTwo.id == client.user.id) {
                    makeBestMove();
                    endTurn();
                };
            };
            function gameOver(result: GameResult) {
                gameEmbed.edit(getGameOverEmbed(result));
            };
            function onMessage(move: string, stepBoolean?: boolean): void {
                const reactions = new Map([
                    ["1", 0],
                    ["2", 1],
                    ["3", 2],
                    ["4", 3],
                    ["5", 4],
                    ["6", 5],
                    ["7", 6],
                    ["8", 7],
                    ["A", 10],
                    ["B", 11],
                    ["C", 12],
                    ["D", 13],
                    ["E", 14],
                    ["F", 15],
                    ["G", 16],
                    ["H", 17],
                    ["accept", 20],
                    ["🔙", 21]
                ]);
                const index = reactions.get(move);
                if (index == undefined) return;
                let progress = false;
                errorMessage = "-";
                if (index == 20) progress = true; /* ACCEPT */
                else if (index == 21 && !selecting) { /* BACK */
                    selecting = true;
                    selectedMove.tx = -1;
                    selectedMove.ty = -1;
                } else if (index >= 10) { /* A, B, C, D, E, F, G, H */
                    if (selecting) selectedMove.fx = index % 10;
                    else selectedMove.tx = index % 10;
                } else { /* 1, 2, 3, 4, 5, 6, 7, 8 */
                    if (selecting) selectedMove.fy = index;
                    else selectedMove.ty = index;
                };
                const currX = selecting ? selectedMove.fx : selectedMove.tx;
                const currY = selecting ? selectedMove.fy : selectedMove.ty;
                if (progress && currY != -1 && currX != -1) {
                    const index = (selectedMove.fy * 8) + selectedMove.fx;
                    if (selecting) {
                        const piece = gameBoard[index];
                        if (piece >= 10 && playerOneTurn) {
                            errorMessage = "\u200b";
                            selecting = false;
                            selectedMove.tx = selectedMove.fx;
                            selectedMove.ty = selectedMove.fy;
                        } else if (piece > 0 && piece < 10 && !playerOneTurn) {
                            errorMessage = "\u200b";
                            selecting = false;
                            selectedMove.tx = selectedMove.fx;
                            selectedMove.ty = selectedMove.fy;
                        } else if (piece == 0) errorMessage = "There is no piece at that location!";
                        else errorMessage = "You cannot move that piece!";
                    } else {
                        const piece = gameBoard[index];
                        const moveInfo = canPieceMoveTo(piece, selectedMove);
                        if (moveInfo.valid) {
                            gameBoard[index] = 0;
                            gameBoard[(selectedMove.ty * 8) + selectedMove.tx] = piece;
                            selectedMove = { fx: -1, fy: -1, tx: -1, ty: -1, replaced: -1 };
                            selecting = true;
                            endTurn();
                        } else errorMessage = moveInfo.msg;
                    };
                };
                if (stepBoolean) step();
            };
            function canPieceMoveTo(piece: number, selectedMove: Move): MoveCheck {
                const blackPiece = piece < 10;
                switch (piece % 10) {
                    case 1: return checkPawnMove(blackPiece, selectedMove);
                    case 2: return checkRookMove(blackPiece, selectedMove);
                    case 3: return checkKnightMove(blackPiece, selectedMove);
                    case 4: return checkBishopMove(blackPiece, selectedMove);
                    case 5:
                        const rookMove = checkRookMove(blackPiece, selectedMove);
                        if (!rookMove.valid) return checkBishopMove(blackPiece, selectedMove);
                        return rookMove;
                    case 6: return checkKingMove(blackPiece, selectedMove);
                };
                return { valid: false, msg: "Invalid Piece!" };
            };
            function checkPawnMove(blackPiece: boolean, selectedMove: Move): MoveCheck {
                const xDiff = selectedMove.fx - selectedMove.tx;
                const yDiff = selectedMove.fy - selectedMove.ty;
                const pieceAt = gameBoard[(selectedMove.ty * 8) + selectedMove.tx];
                if (pieceAt != 0 && ((blackPiece && pieceAt < 10) || (!blackPiece && pieceAt > 10))) return { valid: false, msg: "You already have a piece there!" };
                const pieceAtDiff = pieceAt != 0 && ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));
                if (Math.abs(xDiff) > 1) return { valid: false, msg: "A Pawn cannot move like that!" };
                else if (xDiff == 0) {
                    if (yDiff > 0 && !blackPiece) {
                        const checkJump = checkJumps([{ x: selectedMove.fx, y: selectedMove.fy - 1 }]);
                        if (checkJump.valid) {
                            if ((yDiff == 2 && selectedMove.fy == 6) || (yDiff == 1 && !pieceAtDiff)) return { valid: true, msg: "A Pawn cannot top that position!" };
                            return { valid: false, msg: "" };
                        } else return checkJump;
                    } else if (yDiff < 0 && blackPiece) {
                        const checkJump = checkJumps([{ x: selectedMove.fx, y: selectedMove.fy + 1 }]);
                        if (checkJump.valid) {
                            if ((yDiff == -2 && selectedMove.fy == 1) || (yDiff == -1 && !pieceAtDiff)) return { valid: true, msg: "A Pawn cannot top that position!" };
                            return { valid: false, msg: "" };
                        } else return checkJump;
                    } else return { valid: false, msg: "A Pawn cannot top that position!" };
                } else {
                    if (Math.abs(yDiff) == 1 && pieceAtDiff) return { valid: true, msg: "" };
                    return { valid: false, msg: "You cannot take that piece!" };
                };
            };
            function checkRookMove(blackPiece: boolean, selectedMove: Move): MoveCheck {
                const xDiff = selectedMove.fx - selectedMove.tx;
                const yDiff = selectedMove.fy - selectedMove.ty;
                const pieceAt = gameBoard[(selectedMove.ty * 8) + selectedMove.tx];
                const pieceAtDiff = pieceAt == 0 || ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));
                if (xDiff != 0 && yDiff == 0 && pieceAtDiff) {
                    const betweenPos = [];
                    const inc = -(xDiff / Math.abs(xDiff));
                    for (let i = selectedMove.fx + inc; i != selectedMove.tx; i += inc) betweenPos.push({ x: i, y: selectedMove.fy });
                    return checkJumps(betweenPos);
                } else if (yDiff != 0 && xDiff == 0 && pieceAtDiff) {
                    const betweenPos = [];
                    const inc = -(yDiff / Math.abs(yDiff));
                    for (let i = selectedMove.fy + inc; i != selectedMove.ty; i += inc) betweenPos.push({ x: selectedMove.fx, y: i });
                    return checkJumps(betweenPos);
                };
                return { valid: false, msg: "A Rook cannot move like that" };
            };
            function checkKnightMove(blackPiece: boolean, selectedMove: Move): MoveCheck {
                const xDiff = selectedMove.fx - selectedMove.tx;
                const yDiff = selectedMove.fy - selectedMove.ty;
                const pieceAt = gameBoard[(selectedMove.ty * 8) + selectedMove.tx];
                const pieceAtDiff = pieceAt == 0 || ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));
                if (Math.abs(xDiff) == 2 && Math.abs(yDiff) == 1 && pieceAtDiff) return { valid: true, msg: "" };
                else if (Math.abs(xDiff) == 1 && Math.abs(yDiff) == 2 && pieceAtDiff) return { valid: true, msg: "" };
                return { valid: false, msg: "A Knight cannot move like that" };
            };
            function checkBishopMove(blackPiece: boolean, selectedMove: Move): MoveCheck {
                const xDiff = selectedMove.fx - selectedMove.tx;
                const yDiff = selectedMove.fy - selectedMove.ty;
                const pieceAt = gameBoard[(selectedMove.ty * 8) + selectedMove.tx];
                const pieceAtDiff = pieceAt == 0 || ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));
                if (Math.abs(xDiff) == Math.abs(yDiff) && pieceAtDiff) {
                    const betweenPos = [];
                    const incx = -(xDiff / Math.abs(xDiff));
                    const incy = -(yDiff / Math.abs(yDiff));
                    let j = selectedMove.fy + incy;
                    for (let i = selectedMove.fx + incx; i != selectedMove.tx; i += incx) {
                        betweenPos.push({ x: i, y: j });
                        j += incy;
                    };
                    return checkJumps(betweenPos);
                };
                return { valid: false, msg: "A Bishop cannot move like that" };
            };
            function checkKingMove(blackPiece: boolean, selectedMove: Move): MoveCheck {
                const xDiff = selectedMove.fx - selectedMove.tx;
                const yDiff = selectedMove.fy - selectedMove.ty;
                const pieceAt = gameBoard[(selectedMove.ty * 8) + selectedMove.tx];
                const pieceAtDiff = pieceAt == 0 || ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));
                if (Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1 && pieceAtDiff) return { valid: true, msg: "" };
                return { valid: false, msg: "A King cannot move like that" };
            };
            function checkJumps(positions: Position[]): MoveCheck {
                for (let i = 0; i < positions.length; i++) if (gameBoard[(positions[i].y * 8) + positions[i].x] != 0) return { valid: false, msg: "Cannot jump over piece at " + positions[i].x + ", " + positions[i].y };
                return { valid: true, msg: "" };
            };
            /**
             * This AI below is reworked from https://github.com/lhartikk/simple-chess-ai and is not my own original work
             */
            function makeBestMove(): void {
                const depth: number = 4;
                const bestMove: Move = minimaxRoot(depth, true);
                gameBoard[bestMove.ty * 8 + bestMove.tx] = gameBoard[bestMove.fy * 8 + bestMove.fx];
                gameBoard[bestMove.fy * 8 + bestMove.fx] = 0;
            };
            function minimaxRoot(depth: number, isMaximisingPlayer: boolean): Move {
                const newGameMoves: Move[] = getValidMoves();
                let bestMove: number = -9999;
                let bestMoveFound!: Move;
                for (const gameMove of newGameMoves) {
                    makeTempMove(gameMove);
                    const value: number = minimax(depth - 1, -10000, 10000, !isMaximisingPlayer);
                    undoTempMove();
                    if (value >= bestMove) {
                        bestMove = value;
                        bestMoveFound = gameMove;
                    };
                };
                return bestMoveFound;
            };
            function minimax(depth: number, alpha: number, beta: number, isMaximisingPlayer: boolean): number {
                if (depth === 0) return -evaluateBoard();
                const newGameMoves: Move[] = getValidMoves();
                let bestMove: number = isMaximisingPlayer ? -9999 : 9999;
                newGameMoves.forEach(gameMove => {
                    makeTempMove(gameMove);
                    if (isMaximisingPlayer) {
                        bestMove = Math.max(bestMove, minimax(depth - 1, alpha, beta, !isMaximisingPlayer));
                        undoTempMove();
                        alpha = Math.max(alpha, bestMove);
                    } else {
                        bestMove = Math.min(bestMove, minimax(depth - 1, alpha, beta, !isMaximisingPlayer));
                        undoTempMove();
                        beta = Math.min(beta, bestMove);
                    };
                    if (beta <= alpha) return bestMove;
                });
                return bestMove;
            };
            function evaluateBoard(): number {
                let totalEvaluation = 0;
                for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) totalEvaluation = totalEvaluation + getPieceValue(gameBoard[y * 8 + x], x, y);
                return totalEvaluation;
            };
            function getPieceValue(piece: number, x: number, y: number): number {
                if (piece == 0) return 0;
                const absoluteValue = getAbsoluteValue(piece, piece < 10, x, y);
                return piece < 10 ? absoluteValue : -absoluteValue;
            };
            function getAbsoluteValue(piece: number, isWhite: boolean, x: number, y: number): number {
                switch (piece % 10) {
                    case 1: return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
                    case 2: return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
                    case 3: return 30 + knightEval[y][x];
                    case 4: return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
                    case 5: return 90 + evalQueen[y][x];
                    case 6: return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
                    default: throw "Unknown piece type: " + piece;
                };
            };
            function getValidMoves(): Move[] {
                const validMoves: Move[] = [];
                for (let x = 0; x < 8; x++) {
                    for (let y = 0; y < 8; y++) {
                        const piece = gameBoard[y * 8 + x];
                        if (piece != 0 && piece < 10) for (let tx = 0; tx < 8; tx++) for (let ty = 0; ty < 8; ty++) {
                            const move: Move = { fx: x, fy: y, tx: tx, ty: ty, replaced: -1 };
                            if (canPieceMoveTo(piece, move).valid) validMoves.push(move);
                        };
                    };
                };
                return validMoves;
            };
            function makeTempMove(move: Move): void {
                move.replaced = gameBoard[move.ty * 8 + move.tx];
                aiMoveStack.push(move);
                const piece = gameBoard[move.fy * 8 + move.fx];
                gameBoard[move.fy * 8 + move.fx] = 0;
                gameBoard[move.ty * 8 + move.tx] = piece;
            };
            function undoTempMove(): void {
                const move = aiMoveStack.pop();
                if (move != undefined) {
                    gameBoard[move.fy * 8 + move.fx] = gameBoard[move.ty * 8 + move.tx];
                    gameBoard[move.ty * 8 + move.tx] = move.replaced;
                };
            };
        };
        if (args[0]?.toLowerCase() == "bot") return startGame("BOT");
        let playerTwo: User;
        if (message.mentions.users.first()) playerTwo = message.guild.members.cache.filter(member => !member.user.bot).get(message.mentions.users.first().id).user;
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).has(args[0])) playerTwo = message.guild.members.cache.get(args[0]).user;
        if (playerTwo && playerTwo.id == message.author.id) return message.channel.send(client.createRedEmbed(true, usage)
            .setTitle(tictactoeManager)
            .setDescription("You cannot battle yourself!"));
        if (playerTwo && client.inGame.has(`${playerTwo.id}-${message.guild.id}-${this.name}`)) return message.channel.send(client.createRedEmbed(true, `${prefix}${usage}`)
            .setTitle(tictactoeManager)
            .setDescription(`${playerTwo} is already in a chess game!`));
        if (playerTwo) message.channel.send(`${playerTwo}`).then(msg => msg.delete({ timeout: 1 }));
        client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed()
            .setTitle(tictactoeManager)
            .setDescription(`${playerTwo ? `${playerTwo}, do you want to accept ${message.author}'s battle request?\n\nYou have 30s to react!` : `Who wants to accept ${message.author}'s battle request?\n\nYou have 30s to react!`}`)), {
            title: tictactoeManager,
            activity: "creating",
            toHandle: "Chess game request"
        }, usage, async (reaction, user) => {
            if (!playerTwo) playerTwo = user;
            startGame(playerTwo);
        }, (reaction, user) => (playerTwo ? user.id == playerTwo.id : (user.id != message.author.id && !client.inGame.has(`${user.id}-${message.guild.id}-${this.name}`))) && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID));
    };
};