import * as chess from './chess.js';

const whiteFigures = {
    'P': new chess.Pawn('white', 0, 0),
    'R': new chess.Rook('white', 0, 0),
    'N': new chess.Knight('white', 0, 0),
    'B': new chess.Bishop('white', 0, 0),
    'Q': new chess.Queen('white', 0, 0),
    'K': new chess.King('white', 0, 0)
}
const blackFigures = {
    'P': new chess.Pawn('black', 0, 0),
    'R': new chess.Rook('black', 0, 0),
    'N': new chess.Knight('black', 0, 0),
    'B': new chess.Bishop('black', 0, 0),
    'Q': new chess.Queen('black', 0, 0),
    'K': new chess.King('black', 0, 0)
}
const newGame = new chess.GameState();
newGame.addFigureOnBoard(whiteFigures, blackFigures);
chess.reloadBoard(newGame);
