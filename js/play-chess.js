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
//Прослуховувач подій для вибору фігури і відображення можливих ходів
board.addEventListener('click', (event) => {
    const selectedCell = event.target;
    
    let selectedFigure = newGame.board[selectedCell.dataset.row][selectedCell.dataset.col];
    console.log(selectedFigure);
    if (selectedFigure === null) return;
    
    if (takeFigure && currentFigure == null) {
        currentFigure = selectedFigure;
        takeFigure = false;
        if (selectedFigure.allPosibleMoves(newGame).length === 0) {
            takeFigure = true;
            currentFigure = null;
            return;
        }
        selectedFigure.allPosibleMoves(newGame).forEach((move) => {
            let cell = document.querySelector(`[data-row="${move[0]}"][data-col="${move[1]}"]`);
            cell.classList.add('posiblMove');
            if (newGame.board[move[0]][move[1]] !== null) {
                cell.classList.add('posiblAttack');
            }
        });
        
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
//Прослуховувач подій для переміщення фігури
board.addEventListener('click', (event) => {
    const selectedCell = event.target;
    if (selectedCell.classList.contains('posiblMove') || selectedCell.classList.contains('posiblAttack')) {
        newGame.moveFigure(currentFigure.row, currentFigure.col,Number(selectedCell.dataset.row), Number(selectedCell.dataset.col));
        chess.reloadBoard(newGame);
        const cellsMoves = document.querySelectorAll('.posiblMove');
        const cellsAttack = document.querySelectorAll('.posiblAttack');
        cellsMoves.forEach((cell) => {
            cell.classList.remove('posiblMove');
        });
        cellsAttack.forEach((cell) => {
            cell.classList.remove('posiblAttack');
        });
        
        takeFigure = true;
        currentFigure = null;
    }
});