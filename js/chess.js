

export class GameState {
    constructor() {
        this.board = [
            ['BkR', 'BkN', 'BkB', 'BkQ', 'BkK', 'BkB', 'BkN', 'BkR'],
            ['BkP', 'BkP', 'BkP', 'BkP', 'BkP', 'BkP', 'BkP', 'BkP'],
            ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
            ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
            ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
            ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
            ['WtP', 'WtP', 'WtP', 'WtP', 'WtP', 'WtP', 'WtP', 'WtP'],
            ['WtR', 'WtN', 'WtB', 'WtQ', 'WtK', 'WtB', 'WtN', 'WtR']
        ]; // Зберігаємо стан дошки в масиві 
        this.currentPlayer = 'white'; // Зберігаємо поточного гравця
        this.nameFigureList = null;
        this.check = false; // Чи є шах
        this.checkmate = false; // Чи є мат
        this.stalemate = false; // Чи є пат
        this.lastMove = {
            prevPossition: [null, null],
            nextPossition: [null, null],
            lastMovedFigure: null
        }; // Зберігаємо останній хід
    }
    moveFigure(currentRow, currentCol, newRow, newCol) {
        // Переміщує фігуру на нову позицію на дошці 
        let moveFigure = this.board[currentRow][currentCol];
        let king, rook;

        if (moveFigure.type === 'king' && Math.abs(currentCol - newCol) === 2 ) {
            //Робимо рокіровку
            king = moveFigure;
            if (currentCol - newCol === -2) {
                rook = this.board[currentRow][7];
                console.log(rook);
                this.board[currentRow][5] = rook;
                this.board[currentRow][6] = king;
                this.board[currentRow][7] = null;
                this.board[currentRow][4] = null;
                rook.col = 5;
                king.col = 6;
                rook.isFirstMove = false;
                king.isFirstMove = false;
            } else if (currentCol - newCol === 2) {
                rook = this.board[currentRow][0];
                this.board[currentRow][3] = rook;
                this.board[currentRow][2] = king;
                this.board[currentRow][0] = null;
                this.board[currentRow][4] = null;
                rook.col = 3;
                king.col = 2;
                rook.isFirstMove = false;
                king.isFirstMove = false;
            }
        } else if (moveFigure.type === 'rook' && this.board[newRow][newCol] !== null && this.board[newRow][newCol].type === 'king') {
            rook = moveFigure;
            king = this.board[newRow][newCol];
            if (rook.col === 7) {
                console.log(rook);
                this.board[currentRow][5] = rook;
                this.board[currentRow][6] = king;
                this.board[currentRow][7] = null;
                this.board[currentRow][4] = null;
                rook.col = 5;
                king.col = 6;
                rook.isFirstMove = false;
                king.isFirstMove = false;
            } else if (rook.col === 0) {
                this.board[currentRow][3] = rook;
                this.board[currentRow][2] = king;
                this.board[currentRow][0] = null;
                this.board[currentRow][4] = null;
                rook.col = 3;
                king.col = 2;
                rook.isFirstMove = false;
                king.isFirstMove = false;
            }
        } else {
            // Хід en passant
            if (moveFigure.type === 'pawn' && this.board[newRow][newCol] === null && newCol !== currentCol) {
                if (moveFigure.color === 'white') {
                    this.board[newRow + 1][newCol] = null;
                } else if (moveFigure.color === 'black') {
                    this.board[newRow - 1][newCol] = null;
                }
            }
            // Переміщуємо фігуру на нову позицію
            this.board[newRow][newCol] = moveFigure;
            this.board[currentRow][currentCol] = null;
            moveFigure.row = newRow;
            moveFigure.col = newCol;
            moveFigure.hasOwnProperty('isFirstMove') ? moveFigure.isFirstMove = false : null;
        }

        this.lastMove.prevPossition = [currentRow, currentCol];
        this.lastMove.nextPossition = [newRow, newCol];
        this.lastMove.lastMovedFigure = moveFigure;
        // Перевірка на перетворення пішака
        if (moveFigure.type === 'pawn' && moveFigure.color === 'white' && newRow === 0) {
            document.querySelector('.change-pawn').showModal();
        } else if (moveFigure.type === 'pawn' && moveFigure.color === 'black' && newRow === 7) {
            document.querySelector('.change-pawn').showModal();
        }
        this.checkForCheck();

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }
    checkForCheck() {
        // Перевіряє чи є шах
        let oponentColor = this.currentPlayer === 'white' ? 'black' : 'white';
        let kingRow, kingCol;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] !== null && this.board[row][col].type === 'king' && this.board[row][col].color === this.currentPlayer) {
                    kingRow = row;
                    kingCol = col;
                }
            }
        }
        let allOponentMoves = this.allFigureMoves(oponentColor);
        if (allOponentMoves.some(move => move[0] === kingRow && move[1] === kingCol)) {
            this.check = true;
        } else {
            this.check = false;
        }
    }
    checkForCheckmate() {
        // Перевіряє чи є мат
        let allFigure = [];
        let psblMove = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] !== null && this.board[row][col].color === this.currentPlayer) {
                    allFigure.push(this.board[row][col]);
                }
            }
        }
        allFigure.forEach(figure => {
            let figureMoves = [...figure.allPosibleMoves(this, 'attack'),...figure.allPosibleMoves(this, 'move')];
            psblMove.push(...this.possibleBoardState(figure, figureMoves));
        });
        if (this.check && psblMove.length === 0) {
            this.checkmate = true;
        } else {
            this.checkmate = false;
        }
    }
    possibleBoardState(ourFigure, moveList) {
        // Перевіряє чи є можливість зробити хід для фігур, щоб не був відкритий король
        const oldState = _.cloneDeep(this);
        const filtredMoves = [];
        moveList.forEach(move => {
            let localState = _.cloneDeep(oldState);
            localState.moveFigure(ourFigure.row, ourFigure.col, move[0], move[1]);
            localState.check ? null : filtredMoves.push(move);
        });
        return filtredMoves;
    }
    checkForStalemate() {
        // Перевіряє чи є пат
        let allFigure = [];
        let psblMove = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] !== null && this.board[row][col].color === this.currentPlayer) {
                    allFigure.push(this.board[row][col]);
                }
            }
        }
        allFigure.forEach(figure => {
            let figureMoves = [...figure.allPosibleMoves(this, 'attack'),...figure.allPosibleMoves(this, 'move')];
            psblMove.push(...this.possibleBoardState(figure, figureMoves));
        });
        if (!this.check && psblMove.length === 0) {
            this.stalemate = true;
        } else {
            this.stalemate = false;
        }
    }
    allFigureMoves(color) {
        // Повертає всі можливі ходи для атаки всіх фігур певного кольору і захисту союзних фігур
        let allMoves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] !== null && this.board[row][col].color === color) {
                    let figure = this.board[row][col];
                    allMoves.push(...figure.allPosibleMoves(this, 'move'));
                    allMoves.push(...figure.allPosibleMoves(this, 'attack'));
                    allMoves.push(...figure.allPosibleMoves(this, 'protect'));
                }

            }
        }
        return allMoves;
    }
    addFigureOnBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] !== '   ') {
                    if (this.board[row][col][0] === 'W') {
                        let wfigure = new this.nameFigureList[this.board[row][col][2]];
                        wfigure.color = 'white';
                        wfigure.row = row;
                        wfigure.col = col;
                        this.board[row][col] = wfigure;
                    } else if (this.board[row][col][0] === 'B') {
                        let bfigure = new this.nameFigureList[this.board[row][col][2]];
                        bfigure.color = 'black';
                        bfigure.row = row;
                        bfigure.col = col;
                        this.board[row][col] = bfigure;
                    }
                } else {
                    this.board[row][col] = null;
                }
            }
        }
    }
}
export class Figure {
    constructor(color, type, row, col) {
        this.color = color; // Колір фігури
        this.type = type; // Тип фігури
        this.row = row; // Позиція фігури на дошці рядок
        this.col = col; // Позиція фігури на дошці колонка
    }
    allPosibleMoves() {
        // Повертає правила для фігури
        return AllposibleMoves // Масив з правилами для фігури;
    }
}
export function reloadBoard(GameState) {
    // Перезавантажує дошку на сторінці зі станом дошки з GameState
    const figuresList = {
        'white king': '♔',
        'white queen': '♕',
        'white rook': '♖',
        'white bishop': '♗',
        'white knight': '♘',
        'white pawn': '♙',
        'black king': '♚',
        'black queen': '♛',
        'black rook': '♜',
        'black bishop': '♝',
        'black knight': '♞',
        'black pawn': '♟'
    }
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (GameState.board[row][col] !== null) {
                cell.textContent = figuresList[`${GameState.board[row][col].color} ${GameState.board[row][col].type}`];
            } else {
                let cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell.textContent = '';
            }
        }
    }
}

export function upgragePawn(GameState, newFigureName) {
    // Заміняє пішака на фігуру
    let newFigure = new GameState.nameFigureList[newFigureName];
    newFigure.row = GameState.lastMove.nextPossition[0];
    newFigure.col = GameState.lastMove.nextPossition[1];
    newFigure.color = GameState.lastMove.lastMovedFigure.color;
    GameState.board[newFigure.row][newFigure.col] = newFigure;
}

export class Pawn extends Figure {
    constructor(color, row, col) {
        super(color, 'pawn', row, col);

    }
    allPosibleMoves(GameState, typeOfMove) {
        // Повертає правила для пішака
        const posibleMoves = [];
        const posiblAttacks = [];
        const posiblDefence = [];

        if (this.color === 'black') {
            if (this.row + 1 < 8 && GameState.board[this.row + 1][this.col] === null) {
                // Повертає правила для білого пішака
                posibleMoves.push([this.row + 1, this.col]);
            }
            if (this.row === 1 && GameState.board[this.row + 2][this.col] === null) {
                // Повертає правила для першого ходу білого пішака
                posibleMoves.push([this.row + 2, this.col]);
            }
            if (this.row + 1 < 8 && this.col + 1 < 8 && GameState.board[this.row + 1][this.col + 1] !== null) {
                if (GameState.board[this.row + 1][this.col + 1].color === 'white') {
                    posiblAttacks.push([this.row + 1, this.col + 1]);
                } else if (GameState.board[this.row + 1][this.col + 1].color === 'black') {
                    posiblDefence.push([this.row + 1, this.col + 1]);
                } else if (GameState.board[this.row + 1][this.col + 1] === null) {
                    posiblDefence.push([this.row + 1, this.col + 1]);
                }
            } else if (this.row + 1 < 8 && this.col + 1 < 8 && GameState.board[this.row + 1][this.col + 1] === null && GameState.lastMove.lastMovedFigure !== null
                && GameState.lastMove.lastMovedFigure.type === 'pawn' && GameState.lastMove.lastMovedFigure.color === 'white'
                && Math.abs(GameState.lastMove.nextPossition[0] - GameState.lastMove.prevPossition[0]) === 2
                && GameState.lastMove.nextPossition[1] === this.col + 1 && GameState.lastMove.nextPossition[0] === this.row) {
                posiblAttacks.push([this.row + 1, this.col + 1]);
            }

            if (this.row + 1 < 8 && this.col - 1 >= 0 && GameState.board[this.row + 1][this.col - 1] !== null) {
                if (GameState.board[this.row + 1][this.col - 1].color === 'white') {
                    posiblAttacks.push([this.row + 1, this.col - 1]);
                } else if (GameState.board[this.row + 1][this.col - 1].color === 'black') {
                    posiblDefence.push([this.row + 1, this.col - 1]);
                } else if (GameState.board[this.row + 1][this.col - 1] === null) {
                    posiblDefence.push([this.row + 1, this.col - 1]);
                }
            } else if (this.row + 1 < 8 && this.col - 1 >= 0 && GameState.board[this.row + 1][this.col - 1] === null && GameState.lastMove.lastMovedFigure !== null
                && GameState.lastMove.lastMovedFigure.type === 'pawn' && GameState.lastMove.lastMovedFigure.color === 'white'
                && Math.abs(GameState.lastMove.nextPossition[0] - GameState.lastMove.prevPossition[0]) === 2
                && GameState.lastMove.nextPossition[1] === this.col - 1 && GameState.lastMove.nextPossition[0] === this.row) {
                posiblAttacks.push([this.row + 1, this.col - 1]);
            }
        } else if (this.color === 'white') {
            if (this.row - 1 >= 0 && GameState.board[this.row - 1][this.col] === null) {
                // Повертає правила для чорного пішака
                posibleMoves.push([this.row - 1, this.col]);
            }
            if (this.row === 6 && GameState.board[this.row - 2][this.col] === null) {
                // Повертає правила для першого ходу чорного пішака
                posibleMoves.push([this.row - 2, this.col]);
            }
            if (this.row - 1 >= 0 && this.col + 1 < 8 && GameState.board[this.row - 1][this.col + 1] !== null) {
                if (GameState.board[this.row - 1][this.col + 1].color === 'black') {
                    posiblAttacks.push([this.row - 1, this.col + 1]);
                } else if (GameState.board[this.row - 1][this.col + 1].color === 'white') {
                    posiblDefence.push([this.row - 1, this.col + 1]);
                } else if (GameState.board[this.row - 1][this.col + 1] === null) {
                    posiblDefence.push([this.row - 1, this.col + 1]);
                }
            } else if (this.row - 1 >= 0 && this.col + 1 < 8 && GameState.board[this.row - 1][this.col + 1] === null && GameState.lastMove.lastMovedFigure !== null
                && GameState.lastMove.lastMovedFigure.type === 'pawn' && GameState.lastMove.lastMovedFigure.color === 'black'
                && Math.abs(GameState.lastMove.nextPossition[0] - GameState.lastMove.prevPossition[0]) === 2
                && GameState.lastMove.nextPossition[1] === this.col + 1 && GameState.lastMove.nextPossition[0] === this.row) {
                posiblAttacks.push([this.row - 1, this.col + 1]);
            }
            if (this.row - 1 >= 0 && this.col - 1 >= 0 && GameState.board[this.row - 1][this.col - 1] !== null) {
                if (GameState.board[this.row - 1][this.col - 1].color === 'black') {
                    posiblAttacks.push([this.row - 1, this.col - 1]);
                } else if (GameState.board[this.row - 1][this.col - 1].color === 'white') {
                    posiblDefence.push([this.row - 1, this.col - 1]);
                } else if (GameState.board[this.row - 1][this.col - 1] === null) {
                    posiblDefence.push([this.row - 1, this.col - 1]);
                }
            } else if (this.row - 1 >= 0 && this.col - 1 >= 0 && GameState.board[this.row - 1][this.col - 1] === null && GameState.lastMove.lastMovedFigure !== null
                && GameState.lastMove.lastMovedFigure.type === 'pawn' && GameState.lastMove.lastMovedFigure.color === 'black'
                && Math.abs(GameState.lastMove.nextPossition[0] - GameState.lastMove.prevPossition[0]) === 2
                && GameState.lastMove.nextPossition[1] === this.col - 1 && GameState.lastMove.nextPossition[0] === this.row) {
                posiblAttacks.push([this.row - 1, this.col - 1]);
            }
        }

        return typeOfMove === 'move' ? posibleMoves : typeOfMove === 'attack' ? posiblAttacks : posiblDefence;
    }

}

export class Rook extends Figure {
    constructor(color, row, col) {
        super(color, 'rook', row, col);
        this.isFirstMove = true; // Чи перший хід тури
    }
    checkForCastling(GameState) {
        // Перевіряє чи можна зробити рокірування
        if (this.isFirstMove) {
            if (this.color === 'white' && GameState.board[7][4] !== null) {
                if (this.col === 0 && GameState.board[7][1] === null && GameState.board[7][2] === null && GameState.board[7][3] === null) {
                    if (GameState.board[7][4].type === 'king' && GameState.board[7][4].isFirstMove) {
                        return true;
                    }
                } else if (this.col === 7 && GameState.board[7][5] === null && GameState.board[7][6] === null) {
                    if (GameState.board[7][4].type === 'king' && GameState.board[7][4].isFirstMove) {
                        return true;
                    }
                }
            } else if (this.color === 'black' && GameState.board[0][4] !== null) {
                if (this.col === 0 && GameState.board[0][1] === null && GameState.board[0][2] === null && GameState.board[0][3] === null) {
                    if (GameState.board[0][4].type === 'king' && GameState.board[0][4].isFirstMove) {
                        return true;
                    }
                } else if (this.col === 7 && GameState.board[0][5] === null && GameState.board[0][6] === null) {
                    if (GameState.board[0][4].type === 'king' && GameState.board[0][4].isFirstMove) {
                        return true;
                    }
                }
            }
        }
    }

    allPosibleMoves(GameState, typeOfMove) {
        // Повертає правила для тури
        let moveup = true;
        let movedown = true;
        let moveleft = true;
        let moveright = true;
        const posibleMoves = [];
        const posiblAttacks = [];
        const posiblDefence = [];
        for (let i = 1; i < 8; i++) {
            if (this.row + i < 8 && movedown) {
                if (GameState.board[this.row + i][this.col] === null) {
                    posibleMoves.push([this.row + i, this.col]);
                } else if (GameState.board[this.row + i][this.col].color === this.color) {
                    posiblDefence.push([this.row + i, this.col]);
                    movedown = false;
                } else if (GameState.board[this.row + i][this.col].color !== this.color) {
                    posiblAttacks.push([this.row + i, this.col]);
                    movedown = false;
                }
            }

            if (this.row - i >= 0 && moveup) {
                if (GameState.board[this.row - i][this.col] === null) {
                    posibleMoves.push([this.row - i, this.col]);
                } else if (GameState.board[this.row - i][this.col].color === this.color) {
                    posiblDefence.push([this.row - i, this.col]);
                    moveup = false;
                } else if (GameState.board[this.row - i][this.col].color !== this.color) {
                    posiblAttacks.push([this.row - i, this.col]);
                    moveup = false;
                }
            }

            if (this.col + i < 8 && moveright) {
                if (GameState.board[this.row][this.col + i] === null) {
                    posibleMoves.push([this.row, this.col + i]);
                } else if (GameState.board[this.row][this.col + i].color === this.color) {
                    posiblDefence.push([this.row, this.col + i]);
                    moveright = false;
                } else if (GameState.board[this.row][this.col + i].color !== this.color) {
                    posiblAttacks.push([this.row, this.col + i]);
                    moveright = false;
                }
            }

            if (this.col - i >= 0 && moveleft) {
                if (GameState.board[this.row][this.col - i] === null) {
                    posibleMoves.push([this.row, this.col - i]);
                } else if (GameState.board[this.row][this.col - i].color === this.color) {
                    posiblDefence.push([this.row, this.col - i]);
                    moveleft = false;
                } else if (GameState.board[this.row][this.col - i].color !== this.color) {
                    posiblAttacks.push([this.row, this.col - i]);
                    moveleft = false;
                }
            }
        }
        if (this.color === 'white' && this.checkForCastling(GameState)) {
            posibleMoves.push([7, 4]);
        }
        if (this.color === 'black' && this.checkForCastling(GameState)) {
            posibleMoves.push([0, 4]);
        }


        return typeOfMove === 'move' ? posibleMoves : typeOfMove === 'attack' ? posiblAttacks : posiblDefence;
    }

}

export class Knight extends Figure {
    constructor(color, row, col) {
        super(color, 'knight', row, col);
    }
    allPosibleMoves(GameState, typeOfMove) {
        // Повертає правила для коня
        const posibleMoves = [];
        const posiblAttacks = [];
        const posiblDefence = [];
        if (this.row + 2 < 8 && this.col + 1 < 8) {
            if (GameState.board[this.row + 2][this.col + 1] === null) {
                posibleMoves.push([this.row + 2, this.col + 1]);
            } else if (GameState.board[this.row + 2][this.col + 1].color === this.color) {
                posiblDefence.push([this.row + 2, this.col + 1]);
            } else if (GameState.board[this.row + 2][this.col + 1].color !== this.color) {
                posiblAttacks.push([this.row + 2, this.col + 1]);
            }
        }
        if (this.row + 2 < 8 && this.col - 1 >= 0) {
            if (GameState.board[this.row + 2][this.col - 1] === null) {
                posibleMoves.push([this.row + 2, this.col - 1]);
            } else if (GameState.board[this.row + 2][this.col - 1].color === this.color) {
                posiblDefence.push([this.row + 2, this.col - 1]);
            } else if (GameState.board[this.row + 2][this.col - 1].color !== this.color) {
                posiblAttacks.push([this.row + 2, this.col - 1]);
            }
        }
        if (this.row - 2 >= 0 && this.col + 1 < 8) {
            if (GameState.board[this.row - 2][this.col + 1] === null) {
                posibleMoves.push([this.row - 2, this.col + 1]);
            } else if (GameState.board[this.row - 2][this.col + 1].color === this.color) {
                posiblDefence.push([this.row - 2, this.col + 1]);
            } else if (GameState.board[this.row - 2][this.col + 1].color !== this.color) {
                posiblAttacks.push([this.row - 2, this.col + 1]);
            }
        }
        if (this.row - 2 >= 0 && this.col - 1 >= 0) {
            if (GameState.board[this.row - 2][this.col - 1] === null) {
                posibleMoves.push([this.row - 2, this.col - 1]);
            } else if (GameState.board[this.row - 2][this.col - 1].color === this.color) {
                posiblDefence.push([this.row - 2, this.col - 1]);
            } else if (GameState.board[this.row - 2][this.col - 1].color !== this.color) {
                posiblAttacks.push([this.row - 2, this.col - 1]);
            }
        }
        if (this.row + 1 < 8 && this.col + 2 < 8) {
            if (GameState.board[this.row + 1][this.col + 2] === null) {
                posibleMoves.push([this.row + 1, this.col + 2]);
            } else if (GameState.board[this.row + 1][this.col + 2].color === this.color) {
                posiblDefence.push([this.row + 1, this.col + 2]);
            } else if (GameState.board[this.row + 1][this.col + 2].color !== this.color) {
                posiblAttacks.push([this.row + 1, this.col + 2]);
            }
        }
        if (this.row + 1 < 8 && this.col - 2 >= 0) {
            if (GameState.board[this.row + 1][this.col - 2] === null) {
                posibleMoves.push([this.row + 1, this.col - 2]);
            } else if (GameState.board[this.row + 1][this.col - 2].color === this.color) {
                posiblDefence.push([this.row + 1, this.col - 2]);
            } else if (GameState.board[this.row + 1][this.col - 2].color !== this.color) {
                posiblAttacks.push([this.row + 1, this.col - 2]);
            }
        }
        if (this.row - 1 >= 0 && this.col + 2 < 8) {
            if (GameState.board[this.row - 1][this.col + 2] === null) {
                posibleMoves.push([this.row - 1, this.col + 2]);
            } else if (GameState.board[this.row - 1][this.col + 2].color === this.color) {
                posiblDefence.push([this.row - 1, this.col + 2]);
            } else if (GameState.board[this.row - 1][this.col + 2].color !== this.color) {
                posiblAttacks.push([this.row - 1, this.col + 2]);
            }
        }
        if (this.row - 1 >= 0 && this.col - 2 >= 0) {
            if (GameState.board[this.row - 1][this.col - 2] === null) {
                posibleMoves.push([this.row - 1, this.col - 2]);
            } else if (GameState.board[this.row - 1][this.col - 2].color === this.color) {
                posiblDefence.push([this.row - 1, this.col - 2]);
            } else if (GameState.board[this.row - 1][this.col - 2].color !== this.color) {
                posiblAttacks.push([this.row - 1, this.col - 2]);
            }
        }

        return typeOfMove === 'move' ? posibleMoves : typeOfMove === 'attack' ? posiblAttacks : posiblDefence;

    }
}

export class Bishop extends Figure {
    constructor(color, row, col) {
        super(color, 'bishop', row, col);
    }
    allPosibleMoves(GameState, typeOfMove) {
        // Повертає правила для слона
        let moveDownRight = true;
        let moveDownLeft = true;
        let moveUpRight = true;
        let moveUpLeft = true;

        const posibleMoves = [];
        const posiblAttacks = [];
        const posiblDefence = [];
        for (let i = 1; i < 8; i++) {
            if (this.row + i < 8 && this.col + i < 8 && moveDownRight) {
                if (GameState.board[this.row + i][this.col + i] === null) {
                    posibleMoves.push([this.row + i, this.col + i]);
                } else if (GameState.board[this.row + i][this.col + i].color === this.color) {
                    posiblDefence.push([this.row + i, this.col + i]);
                    moveDownRight = false;
                } else if (GameState.board[this.row + i][this.col + i].color !== this.color) {
                    posiblAttacks.push([this.row + i, this.col + i]);
                    moveDownRight = false;
                }
            }

            if (this.row + i < 8 && this.col - i >= 0 && moveDownLeft) {
                if (GameState.board[this.row + i][this.col - i] === null) {
                    posibleMoves.push([this.row + i, this.col - i]);
                } else if (GameState.board[this.row + i][this.col - i].color === this.color) {
                    posiblDefence.push([this.row + i, this.col - i]);
                    moveDownLeft = false;
                } else if (GameState.board[this.row + i][this.col - i].color !== this.color) {
                    posiblAttacks.push([this.row + i, this.col - i]);
                    moveDownLeft = false;
                }
            }

            if (this.row - i >= 0 && this.col + i < 8 && moveUpRight) {
                if (GameState.board[this.row - i][this.col + i] === null) {
                    posibleMoves.push([this.row - i, this.col + i]);
                } else if (GameState.board[this.row - i][this.col + i].color === this.color) {
                    posiblDefence.push([this.row - i, this.col + i]);
                    moveUpRight = false;
                } else if (GameState.board[this.row - i][this.col + i].color !== this.color) {
                    posiblAttacks.push([this.row - i, this.col + i]);
                    moveUpRight = false;
                }
            }

            if (this.row - i >= 0 && this.col - i >= 0 && moveUpLeft) {
                if (GameState.board[this.row - i][this.col - i] === null) {
                    posibleMoves.push([this.row - i, this.col - i]);
                } else if (GameState.board[this.row - i][this.col - i].color === this.color) {
                    posiblDefence.push([this.row - i, this.col - i]);
                    moveUpLeft = false;
                } else if (GameState.board[this.row - i][this.col - i].color !== this.color) {
                    posiblAttacks.push([this.row - i, this.col - i]);
                    moveUpLeft = false;
                }
            }
        }
        return typeOfMove === 'move' ? posibleMoves : typeOfMove === 'attack' ? posiblAttacks : posiblDefence;
    }
}

export class Queen extends Figure {
    constructor(color, row, col) {
        super(color, 'queen', row, col);
    }
    allPosibleMoves(GameState, typeOfMove) {
        // Повертає правила для ферзя
        let moveDownRight = true;
        let moveDownLeft = true;
        let moveUpRight = true;
        let moveUpLeft = true;
        let moveup = true;
        let movedown = true;
        let moveleft = true;
        let moveright = true;
        const posibleMoves = [];
        const posiblAttacks = [];
        const posiblDefence = [];
        for (let i = 1; i < 8; i++) {
            if (this.row + i < 8 && this.col + i < 8 && moveDownRight) {
                if (GameState.board[this.row + i][this.col + i] === null) {
                    posibleMoves.push([this.row + i, this.col + i]);
                } else if (GameState.board[this.row + i][this.col + i].color === this.color) {
                    posiblDefence.push([this.row + i, this.col + i]);
                    moveDownRight = false;
                } else if (GameState.board[this.row + i][this.col + i].color !== this.color) {
                    posiblAttacks.push([this.row + i, this.col + i]);
                    moveDownRight = false;
                }
            }
            if (this.row + i < 8 && this.col - i >= 0 && moveDownLeft) {
                if (GameState.board[this.row + i][this.col - i] === null) {
                    posibleMoves.push([this.row + i, this.col - i]);
                } else if (GameState.board[this.row + i][this.col - i].color === this.color) {
                    posiblDefence.push([this.row + i, this.col - i]);
                    moveDownLeft = false;
                } else if (GameState.board[this.row + i][this.col - i].color !== this.color) {
                    posiblAttacks.push([this.row + i, this.col - i]);
                    moveDownLeft = false;
                }
            }
            if (this.row - i >= 0 && this.col + i < 8 && moveUpRight) {
                if (GameState.board[this.row - i][this.col + i] === null) {
                    posibleMoves.push([this.row - i, this.col + i]);
                } else if (GameState.board[this.row - i][this.col + i].color === this.color) {
                    posiblDefence.push([this.row - i, this.col + i]);
                    moveUpRight = false;
                } else if (GameState.board[this.row - i][this.col + i].color !== this.color) {
                    posiblAttacks.push([this.row - i, this.col + i]);
                    moveUpRight = false;
                }
            }
            if (this.row - i >= 0 && this.col - i >= 0 && moveUpLeft) {
                if (GameState.board[this.row - i][this.col - i] === null) {
                    posibleMoves.push([this.row - i, this.col - i]);
                } else if (GameState.board[this.row - i][this.col - i].color === this.color) {
                    posiblDefence.push([this.row - i, this.col - i]);
                    moveUpLeft = false;
                } else if (GameState.board[this.row - i][this.col - i].color !== this.color) {
                    posiblAttacks.push([this.row - i, this.col - i]);
                    moveUpLeft = false;
                }
            }
            if (this.row + i < 8 && movedown) {
                if (GameState.board[this.row + i][this.col] === null) {
                    posibleMoves.push([this.row + i, this.col]);
                } else if (GameState.board[this.row + i][this.col].color === this.color) {
                    posiblDefence.push([this.row + i, this.col]);
                    movedown = false;
                } else if (GameState.board[this.row + i][this.col].color !== this.color) {
                    posiblAttacks.push([this.row + i, this.col]);
                    movedown = false;
                }
            }
            if (this.row - i >= 0 && moveup) {
                if (GameState.board[this.row - i][this.col] === null) {
                    posibleMoves.push([this.row - i, this.col]);
                } else if (GameState.board[this.row - i][this.col].color === this.color) {
                    posiblDefence.push([this.row - i, this.col]);
                    moveup = false;
                } else if (GameState.board[this.row - i][this.col].color !== this.color) {
                    posiblAttacks.push([this.row - i, this.col]);
                    moveup = false;
                }
            }
            if (this.col + i < 8 && moveright) {
                if (GameState.board[this.row][this.col + i] === null) {
                    posibleMoves.push([this.row, this.col + i]);
                } else if (GameState.board[this.row][this.col + i].color === this.color) {
                    posiblDefence.push([this.row, this.col + i]);
                    moveright = false;
                } else if (GameState.board[this.row][this.col + i].color !== this.color) {
                    posiblAttacks.push([this.row, this.col + i]);
                    moveright = false;
                }
            }
            if (this.col - i >= 0 && moveleft) {
                if (GameState.board[this.row][this.col - i] === null) {
                    posibleMoves.push([this.row, this.col - i]);
                } else if (GameState.board[this.row][this.col - i].color === this.color) {
                    posiblDefence.push([this.row, this.col - i]);
                    moveleft = false;
                } else if (GameState.board[this.row][this.col - i].color !== this.color) {
                    posiblAttacks.push([this.row, this.col - i]);
                    moveleft = false;
                }
            }
        }
        return typeOfMove === 'move' ? posibleMoves : typeOfMove === 'attack' ? posiblAttacks : posiblDefence;
    }
}

export class King extends Figure {
    constructor(color, row, col) {
        super(color, 'king', row, col);
        this.isFirstMove = true; // Чи перший хід короля
    }
    checkForCastling(GameState, typeOfMove) {
        // Перевіряє чи можна зробити рокірування
        let toRight = false;
        let toLeft = false;
        if (this.isFirstMove) {
            if (GameState.board[this.row][this.col + 1] === null && GameState.board[this.row][this.col + 2] === null
                && GameState.board[this.row][7] !== null && GameState.board[this.row][7].isFirstMove) {
                toRight = true;
            }
            if (GameState.board[this.row][this.col - 1] === null && GameState.board[this.row][this.col - 2] === null
                && GameState.board[this.row][this.col - 3] === null && GameState.board[this.row][0] !== null
                && GameState.board[this.row][0].isFirstMove) {
                toLeft = true;
            }
        }
        return [toRight, toLeft];
    }
    allPosibleMoves(GameState, typeOfMove) {
        // Повертає правила для короля
        const posibleMoves = [];
        const posiblAttacks = [];
        const posiblDefence = [];
        if (this.row + 1 < 8) {
            if (GameState.board[this.row + 1][this.col] === null) {
                posibleMoves.push([this.row + 1, this.col]);
            } else if (GameState.board[this.row + 1][this.col].color !== this.color) {
                posiblAttacks.push([this.row + 1, this.col]);
            } else if (GameState.board[this.row + 1][this.col].color === this.color) {
                posiblDefence.push([this.row + 1, this.col]);
            }
        }
        if (this.row - 1 >= 0) {
            if (GameState.board[this.row - 1][this.col] === null) {
                posibleMoves.push([this.row - 1, this.col]);
            } else if (GameState.board[this.row - 1][this.col].color !== this.color) {
                posiblAttacks.push([this.row - 1, this.col]);
            } else if (GameState.board[this.row - 1][this.col].color === this.color) {
                posiblDefence.push([this.row - 1, this.col]);
            }
        }
        if (this.col + 1 < 8) {
            if (GameState.board[this.row][this.col + 1] === null) {
                posibleMoves.push([this.row, this.col + 1]);
            } else if (GameState.board[this.row][this.col + 1].color !== this.color) {
                posiblAttacks.push([this.row, this.col + 1]);
            } else if (GameState.board[this.row][this.col + 1].color === this.color) {
                posiblDefence.push([this.row, this.col + 1]);
            }
        }
        if (this.col - 1 >= 0) {
            if (GameState.board[this.row][this.col - 1] === null) {
                posibleMoves.push([this.row, this.col - 1]);
            } else if (GameState.board[this.row][this.col - 1].color !== this.color) {
                posiblAttacks.push([this.row, this.col - 1]);
            } else if (GameState.board[this.row][this.col - 1].color === this.color) {
                posiblDefence.push([this.row, this.col - 1]);
            }
        }
        if (this.row + 1 < 8 && this.col + 1 < 8) {
            if (GameState.board[this.row + 1][this.col + 1] === null) {
                posibleMoves.push([this.row + 1, this.col + 1]);
            } else if (GameState.board[this.row + 1][this.col + 1].color !== this.color) {
                posiblAttacks.push([this.row + 1, this.col + 1]);
            } else if (GameState.board[this.row + 1][this.col + 1].color === this.color) {
                posiblDefence.push([this.row + 1, this.col + 1]);
            }
        }
        if (this.row + 1 < 8 && this.col - 1 >= 0) {
            if (GameState.board[this.row + 1][this.col - 1] === null) {
                posibleMoves.push([this.row + 1, this.col - 1]);
            } else if (GameState.board[this.row + 1][this.col - 1].color !== this.color) {
                posiblAttacks.push([this.row + 1, this.col - 1]);
            } else if (GameState.board[this.row + 1][this.col - 1].color === this.color) {
                posiblDefence.push([this.row + 1, this.col - 1]);
            }
        }
        if (this.row - 1 >= 0 && this.col + 1 < 8) {
            if (GameState.board[this.row - 1][this.col + 1] === null) {
                posibleMoves.push([this.row - 1, this.col + 1]);
            } else if (GameState.board[this.row - 1][this.col + 1].color !== this.color) {
                posiblAttacks.push([this.row - 1, this.col + 1]);
            } else if (GameState.board[this.row - 1][this.col + 1].color === this.color) {
                posiblDefence.push([this.row - 1, this.col + 1]);
            }
        }
        if (this.row - 1 >= 0 && this.col - 1 >= 0) {
            if (GameState.board[this.row - 1][this.col - 1] === null) {
                posibleMoves.push([this.row - 1, this.col - 1]);
            } else if (GameState.board[this.row - 1][this.col - 1].color !== this.color) {
                posiblAttacks.push([this.row - 1, this.col - 1]);
            } else if (GameState.board[this.row - 1][this.col - 1].color === this.color) {
                posiblDefence.push([this.row - 1, this.col - 1]);
            }
        }
        if (this.checkForCastling(GameState)[0]) {
            posibleMoves.push([this.row, this.col + 2]);
        }
        if (this.checkForCastling(GameState)[1]) {
            posibleMoves.push([this.row, this.col - 2]);
        }
        return typeOfMove === 'move' ? posibleMoves : typeOfMove === 'attack' ? posiblAttacks : posiblDefence

    }
}