import * as chess from './chess.js';

const Figures = {
    'P': chess.Pawn,
    'R': chess.Rook,
    'N': chess.Knight,
    'B': chess.Bishop,
    'Q': chess.Queen,
    'K': chess.King
}

const newGame = new chess.GameState();
//тестова дошка

// newGame.board = [
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', 'WtP', 'WtP', '   ', '   '],
//     ['   ', '   ', '   ', 'BkP', 'WtQ', 'WtP', '   ', '   '],
//     ['   ', '   ', '   ', '   ', 'BkP', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ']
// ]

newGame.addFigureOnBoard(Figures);
chess.reloadBoard(newGame);

const board = document.querySelector('.board');
let takeFigure = true;
let currentFigure = null;
board.addEventListener('click', (event) => {
    const selectedCell = event.target;
    let selectedFigure = newGame.board[selectedCell.dataset.row][selectedCell.dataset.col];
    if (takeFigure && currentFigure == null) {
        selectedFigure.allPosibleMoves(newGame).forEach((move) => {
            let cell = document.querySelector(`[data-row="${move[0]}"][data-col="${move[1]}"]`);
            cell.classList.add('posiblMove');
            if (newGame.board[move[0]][move[1]] !== null) {
                cell.classList.add('posiblAttack');
            }
        });
        currentFigure = selectedFigure;
        takeFigure = false;
    } else if (takeFigure === false && currentFigure == selectedFigure) {
        selectedFigure.allPosibleMoves(newGame).forEach((move) => {
            let cell = document.querySelector(`[data-row="${move[0]}"][data-col="${move[1]}"]`);
            cell.classList.remove('posiblMove');
            cell.classList.remove('posiblAttack');
        });
        takeFigure = true;
        currentFigure = null;
    }
});