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
newGame.nameFigureList = Figures;
//тестова дошка

// newGame.board = [
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', 'BkK'],
//     ['   ', '   ', '   ', '   ', '   ', '   ', 'BkP', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', 'WtQ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', 'WtK', '   ', '   ', '   ', '   ', '   ']
// ]

//тестова дошка

// newGame.board = [
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', 'BkK'],
//     ['   ', '   ', '   ', '   ', '   ', '   ', 'BkP', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', 'WtQ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', 'WtK', '   ', '   ', '   ', '   ', '   ']
// ]

//тестова дошка

// newGame.board = [
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', 'BkK'],
//     ['   ', '   ', '   ', '   ', '   ', '   ', 'BkP', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', 'WtQ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
//     ['   ', '   ', 'WtK', '   ', '   ', '   ', '   ', '   ']
// ]

newGame.addFigureOnBoard(Figures);
chess.reloadBoard(newGame);

const board = document.querySelector('.board');
let takeFigure = true;
let currentFigure = null;
let currentFigureMoves = null;
//Прослуховувач подій для вибору фігури і відображення можливих ходів
board.addEventListener('click', visiblePossibleMove);
function visiblePossibleMove (event) {
    const selectedCell = event.target;
    let selectedFigure = newGame.board[selectedCell.dataset.row][selectedCell.dataset.col];
    if (selectedFigure === null) return;
    if (selectedFigure.color !== newGame.currentPlayer) return;
    if (takeFigure && currentFigure == null) {
        currentFigure = selectedFigure;
        takeFigure = false;
        let selectedFigureMoves = selectedFigure.allPosibleMoves(newGame, 'move').concat(selectedFigure.allPosibleMoves(newGame, 'attack'));
        selectedFigureMoves = newGame.possibleBoardState( selectedFigure, selectedFigureMoves);
        currentFigureMoves = selectedFigureMoves;
        
        if (selectedFigureMoves.length === 0) {
            takeFigure = true;
            currentFigure = null;
            return;
        }
        selectedFigureMoves.forEach((move) => {
            let cell = document.querySelector(`[data-row="${move[0]}"][data-col="${move[1]}"]`);
            cell.classList.add('posiblMove');
            if (newGame.board[move[0]][move[1]] !== null && newGame.board[move[0]][move[1]].color !== selectedFigure.color) {
                cell.classList.add('posiblAttack');
            }
        });

    } else if (takeFigure === false && currentFigure == selectedFigure) {
        selectedFigure.allPosibleMoves(newGame, 'move').forEach((move) => {
            let cell = document.querySelector(`[data-row="${move[0]}"][data-col="${move[1]}"]`);
            cell.classList.remove('posiblMove');
            cell.classList.remove('posiblAttack');
        });
        selectedFigure.allPosibleMoves(newGame, 'attack').forEach((move) => {
            let cell = document.querySelector(`[data-row="${move[0]}"][data-col="${move[1]}"]`);
            cell.classList.remove('posiblAttack');
            cell.classList.remove('posiblMove');
        });
        takeFigure = true;
        currentFigure = null;
    }
}
//Прослуховувач подій для переміщення фігури
board.addEventListener('click', moveFigureOnBoard);
function moveFigureOnBoard (event) {
    const selectedCell = event.target;
    if ((selectedCell.classList.contains('posiblMove') || selectedCell.classList.contains('posiblAttack')) && currentFigure !== null) {
        newGame.moveFigure(currentFigure.row, currentFigure.col, Number(selectedCell.dataset.row), Number(selectedCell.dataset.col));
        indicatorLastMove(newGame);
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
        indicatorLastMove(newGame);
    }    
    newGame.checkForCheck();
    newGame.checkForCheckmate();
    newGame.checkForStalemate();
    checkIndicator(newGame);
    checkStalemate(newGame);
    gameOver(newGame);

}
// Прослуховувач подій для вибору фігури для заміни пішака
const modalWindow = document.querySelector('.change-pawn');
modalWindow.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        let newFigureName = event.target.dataset.name;
        chess.upgragePawn(newGame, newFigureName);
        chess.reloadBoard(newGame);
        modalWindow.close();
        newGame.checkForCheck();
        newGame.checkForCheckmate();
        newGame.checkForStalemate();
        checkIndicator(newGame);
        checkStalemate(newGame);
        gameOver(newGame);
    
    }
});
// Функція для відображення попереднього ходу
function indicatorLastMove(GameState) {
    const prevMove = document.querySelectorAll('.lastMove');
    prevMove.forEach((cell) => {
        cell.classList.remove('lastMove');
    });
    let nextMove = [GameState.lastMove.prevPossition, GameState.lastMove.nextPossition];
    nextMove.forEach((move) => {
        let cell = document.querySelector(`[data-row="${move[0]}"][data-col="${move[1]}"]`);
        cell.classList.add('lastMove');
    });

}

//Функція для відображення чеку
function checkIndicator(GameState) {
    const check = document.querySelector('.check');
    if (GameState.check) {
        check.textContent = `${GameState.currentPlayer} is in check`;
    } else {
        check.textContent = '';
    }
}

//Функція для відображення шаху та мату
function gameOver(GameState) {
    const check = document.querySelector('.check');
    if (GameState.checkmate) {
        check.textContent = `${GameState.currentPlayer} is in checkmate`;
        board.removeEventListener('click', moveFigureOnBoard);
        board.removeEventListener('click', visiblePossibleMove);
    }
}

//Функція для відображення пату
function checkStalemate(GameState) {
    const check = document.querySelector('.check');
    if (GameState.stalemate) {
        check.textContent = `Stalemate`;
        board.removeEventListener('click', moveFigureOnBoard);
        board.removeEventListener('click', visiblePossibleMove);
    }
}