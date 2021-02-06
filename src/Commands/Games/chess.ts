import Command, { CommandRunner } from "@root/Command";

const reactions = {
    "1️⃣": 0, "2️⃣": 1, "3️⃣": 2, "4️⃣": 3, "5️⃣": 4, "6️⃣": 5, "7️⃣": 6, "8️⃣": 7,
    "🇦": 10, "🇧": 11, "🇨": 12, "🇩": 13, "🇪": 14, "🇫": 15, "🇬": 16, "🇭": 17,
    "✔️": 20, "🔙": 21
}

var gameBoard = [];
var aiMoveStack = [];

export default class ChessCommand extends Command {
    constructor() {
        super({
            name: "chess",
            description: "starts a chess game",
            category: "games"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let gameMessage = null;
        let inGame = false;
        let blackTurn = true;
        let selected1X = -1;
        let selected1Y = -1;
        let selected2X = -1;
        let selected2Y = -1;
        let selecting = true;
        let msg = "";
        function gameBoardDisplay() {
            return "https://api.theturkey.dev/discordchess/genboard?gb=" + gameBoard.join(",") + "&s1=" + selected1X + "," + selected1Y + "&s2=" + selected2X + "," + selected2Y + "\n"
                + "```\n"
                + "Welcome to Chess!\n"
                + "Ignore the above link! That is simply our hack to generate the game board below!\n"
                + "To play simply use the reactions provided to first select your piece you want to move\n"
                + "Next hit the check reaction\n"
                + "Now select where you want that peice to be moved!\n"
                + "To go back to the piece selection hit the back reaction!\n"
                + "Hit the check reaction to confirm your movement!\n"
                + "If the piece dose not move check below to possibly see why!\n"
                + "You do play against an AI, however the AI is not particularly very smart!\n"
                + "There is no castling and you must actually take the king to win!\n"
                + "INFO:\n"
                + "\tTurn: " + (blackTurn ? "CPU" : "Player") + "\n"
                + "\tState: " + (selecting ? "Selecting Piece" : "Moving Piece") + "\n\n"
                + (msg !== "" ? message : "") + "\n"
                + "```";
        };
        if (inGame)
            return;
        gameBoard = [
            2, 3, 4, 6, 5, 4, 3, 2,
            1, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            11, 11, 11, 11, 11, 11, 11, 11,
            12, 13, 14, 15, 16, 14, 13, 12
        ];
        inGame = true;
        blackTurn = false;
        selected1X = -1;
        selected1Y = -1;
        selected2X = -1;
        selected2Y = -1;
        selecting = true;
        msg = "";
        message.channel.send(gameBoardDisplay()).then(emsg => {
            gameMessage = emsg;
            Object.keys(reactions).forEach(reaction => {
                gameMessage.react(reaction);
            });

            waitForReaction();
        });

        function step() {
            if (inGame) {
                gameMessage.edit(gameBoardDisplay());
                waitForReaction();
            }
        }

        function endTurn() {
            let blackKing = false;
            let whiteKing = false;

            gameBoard.forEach(p => {
                if (p == 6)
                    blackKing = true;
                else if (p == 16)
                    whiteKing = true;
            });

            if (blackKing && whiteKing) {
                blackTurn = true;
                gameMessage.edit(gameBoardDisplay());
                makeBestMove();
                blackTurn = false;
            }
            else {
                gameOver("Player");
                return;
            }

            blackKing = false;
            whiteKing = false;

            gameBoard.forEach(p => {
                if (p == 6)
                    blackKing = true;
                else if (p == 16)
                    whiteKing = true;
            });

            if (!blackKing || !whiteKing) {
                gameOver("Computer");
            }
        }

        function gameOver(winner) {
            inGame = false;
            gameMessage.edit("GAME OVER! " + getWinnerText(winner));
            gameMessage.reactions.removeAll();
        }

        function filter(reaction, user) {
            return Object.keys(reactions).includes(reaction.emoji.name) && user.id !== gameMessage.author.id;
        }

        function waitForReaction() {
            gameMessage.awaitReactions((reaction, user) => filter(reaction, user), { max: 1, time: 300000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                const index = reactions[reaction.emoji.name];
                let progress = false;
                msg = "";

                if (index == 20) {
                    progress = true;
                }
                else if (index == 21 && !selecting) {
                    selecting = true;
                    selected2X = -1;
                    selected2Y = -1;
                }
                else if (index >= 10) {
                    if (selecting)
                        selected1X = index % 10;
                    else
                        selected2X = index % 10;
                }
                else {
                    if (selecting)
                        selected1Y = index;
                    else
                        selected2Y = index;
                }

                const currX = selecting ? selected1X : selected2X;
                const currY = selecting ? selected1Y : selected2Y;

                reaction.users.remove(reaction.users.cache.filter(user => user.id !== gameMessage.author.id).first().id);
                if (progress && currY != -1 && currX != -1) {
                    const index = (selected1Y * 8) + selected1X;
                    if (selecting) {

                        const piece = gameBoard[index];
                        if (piece >= 10) {
                            msg = "";
                            selecting = false;
                        }
                        else if (piece == 0) {
                            msg = "There is no piece at that location!";
                        }
                        else {
                            msg = "You cannot move that piece!";
                        }
                    }
                    else {
                        const piece = gameBoard[index];
                        const moveInfo = canPieceMoveTo(piece, selected1X, selected1Y, selected2X, selected2Y);
                        if (moveInfo.valid) {
                            gameBoard[index] = 0;
                            gameBoard[(selected2Y * 8) + selected2X] = piece;
                            selected1X = -1;
                            selected1Y = -1;
                            selected2X = -1;
                            selected2Y = -1;
                            selecting = true;
                            endTurn();

                        }
                        else {
                            msg = moveInfo.msg;
                        }
                    }
                }
                step();
            })
                .catch(collected => {
                    if (typeof collected === 'string')
                        gameOver(collected);
                    else
                        gameOver("The game was not finished!");
                });
        }

        function getWinnerText(winner) {
            if (winner === "Player" || winner === "Computer")
                return "The " + winner + " has won!";
            else if (winner == "tie")
                return "It was a tie!";
            else
                return winner;
        }

        function canPieceMoveTo(piece, fx, fy, tx, ty) {
            const blackPiece = piece < 10;

            switch (piece % 10) {
                case 1:
                    return checkPawnMove(blackPiece, fx, fy, tx, ty);
                case 2:
                    return checkRookMove(blackPiece, fx, fy, tx, ty);
                case 3:
                    return checkKnightMove(blackPiece, fx, fy, tx, ty);
                case 4:
                    return checkBishopMove(blackPiece, fx, fy, tx, ty);
                case 5:
                    const rookMove = checkRookMove(blackPiece, fx, fy, tx, ty);
                    if (rookMove.valid)
                        return checkBishopMove(blackPiece, fx, fy, tx, ty);
                    return rookMove;
                case 6:
                    return checkKingMove(blackPiece, fx, fy, tx, ty);
            }
        }

        function checkPawnMove(blackPiece, fx, fy, tx, ty) {
            const xDiff = fx - tx;
            const yDiff = fy - ty;
            const pieceAt = gameBoard[(ty * 8) + tx];
            if (pieceAt != 0 && ((blackPiece && pieceAt < 10) || (!blackPiece && pieceAt > 10)))
                return { valid: false, msg: "You already have a piece there!" };

            const pieceAtDiff = pieceAt != 0 && ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));

            if (Math.abs(xDiff) > 1) {
                return { valid: false, msg: "A Pawn cannot move like that!" };
            }
            else if (xDiff == 0) {
                if (yDiff > 0 && !blackPiece) {
                    const checkJump = checkJumps([{ x: fx, y: fy - 1 }]);
                    if (checkJump.valid) {
                        if ((yDiff == 2 && fy == 6) || (yDiff == 1 && !pieceAtDiff))
                            return { valid: true, msg: "A Pawn cannot top that position!" };
                        return { valid: false, msg: "" };
                    }
                    else {
                        return checkJump;
                    }
                }
                else if (yDiff < 0 && blackPiece) {
                    const checkJump = checkJumps([{ x: fx, y: fy + 1 }]);
                    if (checkJump.valid) {
                        if ((yDiff == -2 && fy == 1) || (yDiff == -1 && !pieceAtDiff))
                            return { valid: true, msg: "A Pawn cannot top that position!" };
                        return { valid: false, msg: "" };
                    }
                    else {
                        return checkJump;
                    }
                }
                else {
                    return { valid: false, msg: "A Pawn cannot top that position!" };
                }
            }
            else {
                if (Math.abs(yDiff) == 1 && pieceAtDiff)
                    return { valid: true, msg: "" };
                return { valid: false, msg: "You cannot take that piece!" };
            }
        }

        function checkRookMove(blackPiece, fx, fy, tx, ty) {
            const xDiff = fx - tx;
            const yDiff = fy - ty;
            const pieceAt = gameBoard[(ty * 8) + tx];
            const pieceAtDiff = pieceAt == 0 || ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));

            if (xDiff != 0 && yDiff == 0 && pieceAtDiff) {
                const betweenPos = [];
                const inc = -(xDiff / Math.abs(xDiff));
                for (let i = fx + inc; i != tx; i += inc)
                    betweenPos.push({ x: i, y: fy });
                return checkJumps(betweenPos);
            }
            else if (yDiff != 0 && xDiff == 0 && pieceAtDiff) {
                const betweenPos = [];
                const inc = -(yDiff / Math.abs(yDiff));
                for (let i = fy + inc; i != ty; i += inc)
                    betweenPos.push({ x: fx, y: i });
                return checkJumps(betweenPos);
            }
            return { valid: false, msg: "A Rook cannot move like that" };
        }

        function checkKnightMove(blackPiece, fx, fy, tx, ty) {
            const xDiff = fx - tx;
            const yDiff = fy - ty;
            const pieceAt = gameBoard[(ty * 8) + tx];
            const pieceAtDiff = pieceAt == 0 || ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));
            if (Math.abs(xDiff) == 2 && Math.abs(yDiff) == 1 && pieceAtDiff)
                return { valid: true, msg: "" };
            else if (Math.abs(xDiff) == 1 && Math.abs(yDiff) == 2 && pieceAtDiff)
                return { valid: true, msg: "" };
            return { valid: false, msg: "A Knight cannot move like that" };
        }

        function checkBishopMove(blackPiece, fx, fy, tx, ty) {
            const xDiff = fx - tx;
            const yDiff = fy - ty;
            const pieceAt = gameBoard[(ty * 8) + tx];
            const pieceAtDiff = pieceAt == 0 || ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));

            if (Math.abs(xDiff) == Math.abs(yDiff) && pieceAtDiff) {
                const betweenPos = [];
                const incx = -(xDiff / Math.abs(xDiff));
                const incy = -(yDiff / Math.abs(yDiff));
                let j = fy + incy;
                for (let i = fx + incx; i != tx; i += incx) {
                    betweenPos.push({ x: i, y: j });
                    j += incy;
                }
                return checkJumps(betweenPos);
            }
            return { valid: false, msg: "A Bishop cannot move like that" };
        }

        function checkKingMove(blackPiece, fx, fy, tx, ty) {
            const xDiff = fx - tx;
            const yDiff = fy - ty;
            const pieceAt = gameBoard[(ty * 8) + tx];
            const pieceAtDiff = pieceAt == 0 || ((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));

            if (Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1 && pieceAtDiff) {
                return { valid: true, msg: "" };
            }
            return { valid: false, msg: "A King cannot move like that" };
        }

        function checkJumps(positions) {
            for (let i = 0; i < positions.length; i++)
                if (gameBoard[(positions[i].y * 8) + positions[i].x] != 0)
                    return { valid: false, msg: "Cannot jump over piece at " + positions[i].x + ", " + positions[i].y };
            return { valid: true, msg: "" };
        }


        /**
         * This AI below is reworked from https://github.com/lhartikk/simple-chess-ai and is not my own original work
         */

        function makeBestMove() {
            const depth = 4;
            const bestMove = minimaxRoot(depth, true);
            gameBoard[bestMove.ty * 8 + bestMove.tx] = gameBoard[bestMove.fy * 8 + bestMove.fx];
            gameBoard[bestMove.fy * 8 + bestMove.fx] = 0;
        }

        function minimaxRoot(depth, isMaximisingPlayer) {
            const newGameMoves = getValidMoves();
            let bestMove = -9999;
            let bestMoveFound;

            newGameMoves.forEach(gameMove => {
                makeTempMove(gameMove);
                const value = minimax(depth - 1, -10000, 10000, !isMaximisingPlayer);
                undoTempMove();
                if (value >= bestMove) {
                    bestMove = value;
                    bestMoveFound = gameMove;
                }
            })
            return bestMoveFound;
        }

        function minimax(depth, alpha, beta, isMaximisingPlayer) {
            if (depth === 0)
                return -evaluateBoard();

            const newGameMoves = getValidMoves();

            let bestMove = isMaximisingPlayer ? -9999 : 9999;
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
                }

                if (beta <= alpha)
                    return bestMove;
            });
            return bestMove;
        }

        function evaluateBoard() {
            let totalEvaluation = 0;
            for (let x = 0; x < 8; x++)
                for (let y = 0; y < 8; y++)
                    totalEvaluation = totalEvaluation + getPieceValue(gameBoard[y * 8 + x], x, y);
            return totalEvaluation;
        }

        function getPieceValue(piece, x, y) {
            if (piece == 0)
                return 0;

            const absoluteValue = getAbsoluteValue(piece, piece < 10, x, y);
            return piece < 10 ? absoluteValue : -absoluteValue;
        }

        function getAbsoluteValue(piece, isWhite, x, y) {
            switch (piece % 10) {
                case 1:
                    return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
                case 2:
                    return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
                case 3:
                    return 30 + knightEval[y][x];
                case 4:
                    return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
                case 5:
                    return 90 + evalQueen[y][x];
                case 6:
                    return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
                default:
                    throw "Unknown piece type: " + piece.type;
            }
        };

        function getValidMoves() {
            const validMoves = [];
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    const piece = gameBoard[y * 8 + x];
                    if (piece != 0 && piece < 10) {
                        for (let tx = 0; tx < 8; tx++) {
                            for (let ty = 0; ty < 8; ty++) {
                                if (canPieceMoveTo(piece, x, y, tx, ty).valid) {
                                    validMoves.push({ fx: x, fy: y, tx: tx, ty: ty });
                                }
                            }
                        }
                    }
                }
            }
            return validMoves;
        }

        function makeTempMove(move) {
            move.replaced = gameBoard[move.ty * 8 + move.tx];
            aiMoveStack.push(move);
            const piece = gameBoard[move.fy * 8 + move.fx];
            gameBoard[move.fy * 8 + move.fx] = 0;
            gameBoard[move.ty * 8 + move.tx] = piece;
        }

        function undoTempMove() {
            const move = aiMoveStack.pop();
            gameBoard[move.fy * 8 + move.fx] = gameBoard[move.ty * 8 + move.tx];
            gameBoard[move.ty * 8 + move.tx] = move.replaced;
        }
    };
};

const pawnEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
];

const pawnEvalBlack = pawnEvalWhite.slice().reverse();

const knightEval = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
];

const bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

const bishopEvalBlack = bishopEvalWhite.slice().reverse();

const rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
];

const rookEvalBlack = rookEvalWhite.slice().reverse();

const evalQueen = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

const kingEvalWhite = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
];

const kingEvalBlack = kingEvalWhite.slice().reverse();