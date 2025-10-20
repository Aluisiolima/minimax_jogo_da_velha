const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let board;
const aiPlayer = 'X';
const humanPlayer = 'O';

const cells = document.querySelectorAll('td');

function start() {
    startGame();
}

function pause() {
    cells.forEach(cell => {
        cell.removeEventListener("click", turnClick, false);
    });
}

function reload() {
    cells.forEach(cell => {
        cell.innerText = '';
        cell.addEventListener('click', turnClick, false);
        cell.style.background = "none";
    });
}
function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function setOldImg(path) {
    document.getElementById("old_img").src = path;
}

function startGame() {
    board = Array.from(Array(9).keys());
    cells.forEach(cell => {
        cell.addEventListener('click', turnClick, false);
    });
    // const openingMoves = [0, 2, 4, 6, 8];
    // const firstMove = openingMoves[Math.floor(Math.random() * openingMoves.length)];
    // turn(firstMove, aiPlayer);
}

async function turnClick(square) {
    if (typeof board[square.target.id] === "number") {
        turn(square.target.id, humanPlayer);
        setOldImg("assets/Design_velhinha2.png");
        await delay(1000);
        setOldImg("assets/Design_velhinha4.png");
        if (!checkWin(board, humanPlayer) && !checkTie()) turn(await bestSpot(), aiPlayer);
        setOldImg("assets/Design_velhinha3.png");
    }
}

function turn(target, player) {
    board[target] = player;
    document.getElementById(target).innerText = player;

    let gameWon = checkWin(board, player);
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { "index": index, "player": player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombinations[gameWon.index]) {
        document.getElementById(index).style.background = gameWon.player == humanPlayer ? "blue" : "red";
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
}

function emptySquares() {
    return board.filter(s => typeof s === 'number');
}

async function bestSpot() {
    await delay(4000);
    return minimax(board, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.background = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        return true;
    }
    return false;
}

function minimax(board, player) {
    const availSpots = emptySquares().sort(() => Math.random() - 0.5);

    if (checkWin(board, humanPlayer)) {
        return { score: -1 };
    } else if (checkWin(board, aiPlayer)) {
        return { score: 1 };
    } else if (availSpots.length == 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = board[availSpots[i]];
        board[availSpots[i]] = player;

        if (player == aiPlayer) {
            let result = minimax(board, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(board, aiPlayer);
            move.score = result.score;
        }

        board[availSpots[i]] = move.index;
        moves.push(move)
    }

    let bestMove;

    if (player === aiPlayer) {
        let bestScore = -Infinity;
        let bestMoves = [];
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMoves = [i];
            } else if (moves[i].score === bestScore) {
                bestMoves.push(i);
            }
        }
        bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    } else {
        let bestScore = Infinity;
        let bestMoves = [];
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMoves = [i];
            } else if (moves[i].score === bestScore) {
                bestMoves.push(i);
            }
        }
        bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }

    return moves[bestMove];
}
