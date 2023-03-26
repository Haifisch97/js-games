

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
        if (this.board[newRow][newCol] !== null && this.board[newRow][newCol].color === moveFigure.color) {
            //Робимо рокіровку
            let king, rook;
            if (moveFigure.type === 'king') {
                king = moveFigure;
                rook = this.board[newRow][newCol];
            } else if (moveFigure.type === 'rook') {
                rook = moveFigure;
                king = this.board[newRow][newCol];
            }
            if (rook.col === 0) {
                this.board[currentRow][3] = rook;
                this.board[currentRow][2] = king;
                this.board[currentRow][0] = null;
                this.board[currentRow][4] = null;
                rook.col = 3;
                king.col = 2;
                rook.isFirstMove = false;
                king.isFirstMove = false;
            } else if (rook.col === 7) {
                this.board[currentRow][5] = rook;
                this.board[currentRow][6] = king;
                this.board[currentRow][7] = null;
                this.board[currentRow][4] = null;
                rook.col = 5;
                king.col = 6;
                rook.isFirstMove = false;
                king.isFirstMove = false;
            }
            this.lastMove.prevPossition = [currentRow, currentCol];
            this.lastMove.nextPossition = [newRow, newCol];
            this.lastMove.lastMovedFigure = moveFigure;
        } else {
            // Переміщуємо фігуру на нову позицію
            this.lastMove.prevPossition = [currentRow, currentCol];
            this.lastMove.nextPossition = [newRow, newCol];
            this.lastMove.lastMovedFigure = moveFigure;
            this.board[newRow][newCol] = moveFigure;
            this.board[currentRow][currentCol] = null;
            moveFigure.row = newRow;
            moveFigure.col = newCol;
            moveFigure.hasOwnProperty('isFirstMove') ? moveFigure.isFirstMove = false : null;
        }
        // Перевірка на перетворення пішака
        if (moveFigure.type === 'pawn' && moveFigure.color === 'white' && newRow === 0) {
            document.querySelector('.change-pawn').showModal();
        } else if (moveFigure.type === 'pawn' && moveFigure.color === 'black' && newRow === 7) {
            document.querySelector('.change-pawn').showModal();
        }
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }
    checkForCheck() {
        // Перевіряє чи є шах
        let oponentColor = this.currentPlayer === 'white' ? 'black' : 'white';
        let kingRow, kingCol;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
               if (this.board[row][col] !== null && this.board[row][col].type === 'king' && this.board[row][col].color === this.currentPlayer) {
                console.log(this.board[row][col]);
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
    }
    checkForStalemate() {
        // Перевіряє чи є пат
    }
    allFigureMoves(color) {
        // Повертає всі можливі ходи для атаки всіх фігур певного кольору
        let allMoves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] !== null && this.board[row][col].color === color && this.board[row][col].type !== 'pawn') {
                    let figureMoves = this.board[row][col].allPosibleMoves(this);
                    allMoves.push(...figureMoves);
                } else if (this.board[row][col] !== null && this.board[row][col].color === color && this.board[row][col].type === 'pawn') {
                    if (this.board[row][col].color === 'white') {
                        if (this.board[row - 1][col - 1] === null) {
                            allMoves.push([row - 1, col - 1]);
                        }
                        if (this.board[row - 1][col + 1] === null) {
                            allMoves.push([row - 1, col + 1]);
                        }
                    }
                    if (this.board[row][col].color === 'black') {
                        if (this.board[row + 1][col - 1] === null) {
                            allMoves.push([row + 1, col - 1]);
                        }
                        if (this.board[row + 1][col + 1] === null) {
                            allMoves.push([row + 1, col + 1]);
                        }
                    }
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
    allPosibleMoves(GameState) {
        // Повертає правила для пішака
        const AllposibleMoves = [];
        if (this.color === 'black') {
            if (GameState.board[this.row + 1][this.col] === null) {
                // Повертає правила для білого пішака
                AllposibleMoves.push([this.row + 1, this.col]);
            }
            if (this.row === 1 && GameState.board[this.row + 2][this.col] === null) {
                // Повертає правила для першого ходу білого пішака
                AllposibleMoves.push([this.row + 2, this.col]);
            }
            if (GameState.board[this.row + 1][this.col + 1] !== null && this.row + 1 < 8 && this.col + 1 < 8) {
                if (GameState.board[this.row + 1][this.col + 1].color === 'white') {
                    AllposibleMoves.push([this.row + 1, this.col + 1]);
                }
            }
            if (GameState.board[this.row + 1][this.col - 1] !== null && this.row + 1 < 8 && this.col - 1 >= 0) {
                if (GameState.board[this.row + 1][this.col - 1].color === 'white') {
                    AllposibleMoves.push([this.row + 1, this.col - 1]);
                }
            }
        } else if (this.color === 'white') {
            if (GameState.board[this.row - 1][this.col] === null) {
                // Повертає правила для чорного пішака
                AllposibleMoves.push([this.row - 1, this.col]);
            }
            if (this.row === 6 && GameState.board[this.row - 2][this.col] === null) {
                // Повертає правила для першого ходу чорного пішака
                AllposibleMoves.push([this.row - 2, this.col]);
            }
            if (GameState.board[this.row - 1][this.col + 1] !== null && this.row + 1 < 8 && this.col + 1 < 8) {
                if (GameState.board[this.row - 1][this.col + 1].color === 'black') {
                    AllposibleMoves.push([this.row - 1, this.col + 1]);
                }
            }
            if (GameState.board[this.row - 1][this.col - 1] !== null && this.row + 1 < 8 && this.col - 1 >= 0) {
                if (GameState.board[this.row - 1][this.col - 1].color === 'black') {
                    AllposibleMoves.push([this.row - 1, this.col - 1]);
                }
            }
        }

        return AllposibleMoves;
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

    allPosibleMoves(GameState) {
        // Повертає правила для тури
        let moveup = true;
        let movedown = true;
        let moveleft = true;
        let moveright = true;
        const AllposibleMoves = [];
        for (let i = 1; i < 8; i++) {
            if (this.row + i < 8 && movedown) {
                if (GameState.board[this.row + i][this.col] === null) {
                    AllposibleMoves.push([this.row + i, this.col]);
                } else if (GameState.board[this.row + i][this.col].color === this.color) {
                    movedown = false;
                } else if (GameState.board[this.row + i][this.col].color !== this.color) {
                    AllposibleMoves.push([this.row + i, this.col]);
                    movedown = false;
                }
            }

            if (this.row - i >= 0 && moveup) {
                if (GameState.board[this.row - i][this.col] === null) {
                    AllposibleMoves.push([this.row - i, this.col]);
                } else if (GameState.board[this.row - i][this.col].color === this.color) {
                    moveup = false;
                } else if (GameState.board[this.row - i][this.col].color !== this.color) {
                    AllposibleMoves.push([this.row - i, this.col]);
                    moveup = false;
                }
            }

            if (this.col + i < 8 && moveright) {
                if (GameState.board[this.row][this.col + i] === null) {
                    AllposibleMoves.push([this.row, this.col + i]);
                } else if (GameState.board[this.row][this.col + i].color === this.color) {
                    moveright = false;
                } else if (GameState.board[this.row][this.col + i].color !== this.color) {
                    AllposibleMoves.push([this.row, this.col + i]);
                    moveright = false;
                }
            }

            if (this.col - i >= 0 && moveleft) {
                if (GameState.board[this.row][this.col - i] === null) {
                    AllposibleMoves.push([this.row, this.col - i]);
                } else if (GameState.board[this.row][this.col - i].color === this.color) {
                    moveleft = false;
                } else if (GameState.board[this.row][this.col - i].color !== this.color) {
                    AllposibleMoves.push([this.row, this.col - i]);
                    moveleft = false;
                }
            }
        }
        if (this.color === 'white' && this.checkForCastling(GameState)) {
            AllposibleMoves.push([7, 4]);
        }
        if (this.color === 'black' && this.checkForCastling(GameState)) {
            AllposibleMoves.push([0, 4]);
        }


        return AllposibleMoves;
    }

}

export class Knight extends Figure {
    constructor(color, row, col) {
        super(color, 'knight', row, col);
    }
    allPosibleMoves(GameState) {
        // Повертає правила для коня
        const AllposibleMoves = [];
        if (this.row + 2 < 8 && this.col + 1 < 8 && GameState.board[this.row + 2][this.col + 1] === null) {
            AllposibleMoves.push([this.row + 2, this.col + 1]);
        } else if (this.row + 2 < 8 && this.col + 1 < 8 && GameState.board[this.row + 2][this.col + 1].color !== this.color) {
            AllposibleMoves.push([this.row + 2, this.col + 1]);
        }
        if (this.row + 2 < 8 && this.col - 1 >= 0 && GameState.board[this.row + 2][this.col - 1] === null) {
            AllposibleMoves.push([this.row + 2, this.col - 1]);
        } else if (this.row + 2 < 8 && this.col - 1 >= 0 && GameState.board[this.row + 2][this.col - 1].color !== this.color) {
            AllposibleMoves.push([this.row + 2, this.col - 1]);
        }
        if (this.row - 2 >= 0 && this.col + 1 < 8 && GameState.board[this.row - 2][this.col + 1] === null) {
            AllposibleMoves.push([this.row - 2, this.col + 1]);
        } else if (this.row - 2 >= 0 && this.col + 1 < 8 && GameState.board[this.row - 2][this.col + 1].color !== this.color) {
            AllposibleMoves.push([this.row - 2, this.col + 1]);
        }
        if (this.row - 2 >= 0 && this.col - 1 >= 0 && GameState.board[this.row - 2][this.col - 1] === null) {
            AllposibleMoves.push([this.row - 2, this.col - 1]);
        } else if (this.row - 2 >= 0 && this.col - 1 >= 0 && GameState.board[this.row - 2][this.col - 1].color !== this.color) {
            AllposibleMoves.push([this.row - 2, this.col - 1]);
        }
        if (this.row + 1 < 8 && this.col + 2 < 8 && GameState.board[this.row + 1][this.col + 2] === null) {
            AllposibleMoves.push([this.row + 1, this.col + 2]);
        } else if (this.row + 1 < 8 && this.col + 2 < 8 && GameState.board[this.row + 1][this.col + 2].color !== this.color) {
            AllposibleMoves.push([this.row + 1, this.col + 2]);
        }
        if (this.row + 1 < 8 && this.col - 2 >= 0 && GameState.board[this.row + 1][this.col - 2] === null) {
            AllposibleMoves.push([this.row + 1, this.col - 2]);
        } else if (this.row + 1 < 8 && this.col - 2 >= 0 && GameState.board[this.row + 1][this.col - 2].color !== this.color) {
            AllposibleMoves.push([this.row + 1, this.col - 2]);
        }
        if (this.row - 1 >= 0 && this.col + 2 < 8 && GameState.board[this.row - 1][this.col + 2] === null) {
            AllposibleMoves.push([this.row - 1, this.col + 2]);
        } else if (this.row - 1 >= 0 && this.col + 2 < 8 && GameState.board[this.row - 1][this.col + 2].color !== this.color) {
            AllposibleMoves.push([this.row - 1, this.col + 2]);
        }
        if (this.row - 1 >= 0 && this.col - 2 >= 0 && GameState.board[this.row - 1][this.col - 2] === null) {
            AllposibleMoves.push([this.row - 1, this.col - 2]);
        } else if (this.row - 1 >= 0 && this.col - 2 >= 0 && GameState.board[this.row - 1][this.col - 2].color !== this.color) {
            AllposibleMoves.push([this.row - 1, this.col - 2]);
        }
        return AllposibleMoves;
    }
}

export class Bishop extends Figure {
    constructor(color, row, col) {
        super(color, 'bishop', row, col);
    }
    allPosibleMoves(GameState) {
        // Повертає правила для слона
        let moveDownRight = true;
        let moveDownLeft = true;
        let moveUpRight = true;
        let moveUpLeft = true;

        const AllposibleMoves = [];
        for (let i = 1; i < 8; i++) {
            if (this.row + i < 8 && this.col + i < 8 && moveDownRight) {
                if (GameState.board[this.row + i][this.col + i] === null) {
                    AllposibleMoves.push([this.row + i, this.col + i]);
                } else if (GameState.board[this.row + i][this.col + i].color === this.color) {
                    moveDownRight = false;
                } else if (GameState.board[this.row + i][this.col + i].color !== this.color) {
                    AllposibleMoves.push([this.row + i, this.col + i]);
                    moveDownRight = false;
                }
            }

            if (this.row + i < 8 && this.col - i >= 0 && moveDownLeft) {
                if (GameState.board[this.row + i][this.col - i] === null) {
                    AllposibleMoves.push([this.row + i, this.col - i]);
                } else if (GameState.board[this.row + i][this.col - i].color === this.color) {
                    moveDownLeft = false;
                } else if (GameState.board[this.row + i][this.col - i].color !== this.color) {
                    AllposibleMoves.push([this.row + i, this.col - i]);
                    moveDownLeft = false;
                }
            }

            if (this.row - i >= 0 && this.col + i < 8 && moveUpRight) {
                if (GameState.board[this.row - i][this.col + i] === null) {
                    AllposibleMoves.push([this.row - i, this.col + i]);
                } else if (GameState.board[this.row - i][this.col + i].color === this.color) {
                    moveUpRight = false;
                } else if (GameState.board[this.row - i][this.col + i].color !== this.color) {
                    AllposibleMoves.push([this.row - i, this.col + i]);
                    moveUpRight = false;
                }
            }

            if (this.row - i >= 0 && this.col - i >= 0 && moveUpLeft) {
                if (GameState.board[this.row - i][this.col - i] === null) {
                    AllposibleMoves.push([this.row - i, this.col - i]);
                } else if (GameState.board[this.row - i][this.col - i].color === this.color) {
                    moveUpLeft = false;
                } else if (GameState.board[this.row - i][this.col - i].color !== this.color) {
                    AllposibleMoves.push([this.row - i, this.col - i]);
                    moveUpLeft = false;
                }
            }
        }
        return AllposibleMoves;
    }
}

export class Queen extends Figure {
    constructor(color, row, col) {
        super(color, 'queen', row, col);
    }
    allPosibleMoves(GameState) {
        // Повертає правила для ферзя
        let moveDownRight = true;
        let moveDownLeft = true;
        let moveUpRight = true;
        let moveUpLeft = true;
        let moveup = true;
        let movedown = true;
        let moveleft = true;
        let moveright = true;
        const AllposibleMoves = [];
        for (let i = 1; i < 8; i++) {
            if (this.row + i < 8 && this.col + i < 8 && moveDownRight) {
                if (GameState.board[this.row + i][this.col + i] === null) {
                    AllposibleMoves.push([this.row + i, this.col + i]);
                } else if (GameState.board[this.row + i][this.col + i].color === this.color) {
                    moveDownRight = false;
                } else if (GameState.board[this.row + i][this.col + i].color !== this.color) {
                    AllposibleMoves.push([this.row + i, this.col + i]);
                    moveDownRight = false;
                }
            }
            if (this.row + i < 8 && this.col - i >= 0 && moveDownLeft) {
                if (GameState.board[this.row + i][this.col - i] === null) {
                    AllposibleMoves.push([this.row + i, this.col - i]);
                } else if (GameState.board[this.row + i][this.col - i].color === this.color) {
                    moveDownLeft = false;
                } else if (GameState.board[this.row + i][this.col - i].color !== this.color) {
                    AllposibleMoves.push([this.row + i, this.col - i]);
                    moveDownLeft = false;
                }
            }
            if (this.row - i >= 0 && this.col + i < 8 && moveUpRight) {
                if (GameState.board[this.row - i][this.col + i] === null) {
                    AllposibleMoves.push([this.row - i, this.col + i]);
                } else if (GameState.board[this.row - i][this.col + i].color === this.color) {
                    moveUpRight = false;
                } else if (GameState.board[this.row - i][this.col + i].color !== this.color) {
                    AllposibleMoves.push([this.row - i, this.col + i]);
                    moveUpRight = false;
                }
            }
            if (this.row - i >= 0 && this.col - i >= 0 && moveUpLeft) {
                if (GameState.board[this.row - i][this.col - i] === null) {
                    AllposibleMoves.push([this.row - i, this.col - i]);
                } else if (GameState.board[this.row - i][this.col - i].color === this.color) {
                    moveUpLeft = false;
                } else if (GameState.board[this.row - i][this.col - i].color !== this.color) {
                    AllposibleMoves.push([this.row - i, this.col - i]);
                    moveUpLeft = false;
                }
            }
            if (this.row + i < 8 && movedown) {
                if (GameState.board[this.row + i][this.col] === null) {
                    AllposibleMoves.push([this.row + i, this.col]);
                } else if (GameState.board[this.row + i][this.col].color === this.color) {
                    movedown = false;
                } else if (GameState.board[this.row + i][this.col].color !== this.color) {
                    AllposibleMoves.push([this.row + i, this.col]);
                    movedown = false;
                }
            }
            if (this.row - i >= 0 && moveup) {
                if (GameState.board[this.row - i][this.col] === null) {
                    AllposibleMoves.push([this.row - i, this.col]);
                } else if (GameState.board[this.row - i][this.col].color === this.color) {
                    moveup = false;
                } else if (GameState.board[this.row - i][this.col].color !== this.color) {
                    AllposibleMoves.push([this.row - i, this.col]);
                    moveup = false;
                }
            }
            if (this.col + i < 8 && moveright) {
                if (GameState.board[this.row][this.col + i] === null) {
                    AllposibleMoves.push([this.row, this.col + i]);
                } else if (GameState.board[this.row][this.col + i].color === this.color) {
                    moveright = false;
                } else if (GameState.board[this.row][this.col + i].color !== this.color) {
                    AllposibleMoves.push([this.row, this.col + i]);
                    moveright = false;
                }
            }
            if (this.col - i >= 0 && moveleft) {
                if (GameState.board[this.row][this.col - i] === null) {
                    AllposibleMoves.push([this.row, this.col - i]);
                } else if (GameState.board[this.row][this.col - i].color === this.color) {
                    moveleft = false;
                } else if (GameState.board[this.row][this.col - i].color !== this.color) {
                    AllposibleMoves.push([this.row, this.col - i]);
                    moveleft = false;
                }
            }
        }
        return AllposibleMoves;
    }
}

export class King extends Figure {
    constructor(color, row, col) {
        super(color, 'king', row, col);
        this.isFirstMove = true; // Чи перший хід короля
    }
    checkForCastling(GameState) {
        // Перевіряє чи можна зробити рокірування
        let toRight = false;
        let toLeft = false;
        if (this.isFirstMove) {
            if (GameState.board[this.row][this.col + 1] === null && GameState.board[this.row][this.col + 2] === null) {
                if (GameState.board[this.row][7] !== null) {
                    if (GameState.board[this.row][7].isFirstMove) {
                        toRight = true;
                    }
                }
            }
            if (GameState.board[this.row][this.col - 1] === null && GameState.board[this.row][this.col - 2] === null && GameState.board[this.row][this.col - 3] === null) {
                if (GameState.board[this.row][0] !== null) {
                    if (GameState.board[this.row][0].isFirstMove) {
                        toLeft = true;
                    }
                }
            }
        }
        return [toRight, toLeft];
    }
    allPosibleMoves(GameState) {
        // Повертає правила для короля
        const AllposibleMoves = [];
        if (this.row + 1 < 8) {
            if (GameState.board[this.row + 1][this.col] === null) {
                AllposibleMoves.push([this.row + 1, this.col]);
            } else if (GameState.board[this.row + 1][this.col].color !== this.color) {
                AllposibleMoves.push([this.row + 1, this.col]);
            }
        }
        if (this.row - 1 >= 0) {
            if (GameState.board[this.row - 1][this.col] === null) {
                AllposibleMoves.push([this.row - 1, this.col]);
            } else if (GameState.board[this.row - 1][this.col].color !== this.color) {
                AllposibleMoves.push([this.row - 1, this.col]);
            }
        }
        if (this.col + 1 < 8) {
            if (GameState.board[this.row][this.col + 1] === null) {
                AllposibleMoves.push([this.row, this.col + 1]);
            } else if (GameState.board[this.row][this.col + 1].color !== this.color) {
                AllposibleMoves.push([this.row, this.col + 1]);
            }
        }
        if (this.col - 1 >= 0) {
            if (GameState.board[this.row][this.col - 1] === null) {
                AllposibleMoves.push([this.row, this.col - 1]);
            } else if (GameState.board[this.row][this.col - 1].color !== this.color) {
                AllposibleMoves.push([this.row, this.col - 1]);
            }
        }
        if (this.row + 1 < 8 && this.col + 1 < 8) {
            if (GameState.board[this.row + 1][this.col + 1] === null) {
                AllposibleMoves.push([this.row + 1, this.col + 1]);
            } else if (GameState.board[this.row + 1][this.col + 1].color !== this.color) {
                AllposibleMoves.push([this.row + 1, this.col + 1]);
            }
        }
        if (this.row + 1 < 8 && this.col - 1 >= 0) {
            if (GameState.board[this.row + 1][this.col - 1] === null) {
                AllposibleMoves.push([this.row + 1, this.col - 1]);
            } else if (GameState.board[this.row + 1][this.col - 1].color !== this.color) {
                AllposibleMoves.push([this.row + 1, this.col - 1]);
            }
        }
        if (this.row - 1 >= 0 && this.col + 1 < 8) {
            if (GameState.board[this.row - 1][this.col + 1] === null) {
                AllposibleMoves.push([this.row - 1, this.col + 1]);
            } else if (GameState.board[this.row - 1][this.col + 1].color !== this.color) {
                AllposibleMoves.push([this.row - 1, this.col + 1]);
            }
        }
        if (this.row - 1 >= 0 && this.col - 1 >= 0) {
            if (GameState.board[this.row - 1][this.col - 1] === null) {
                AllposibleMoves.push([this.row - 1, this.col - 1]);
            } else if (GameState.board[this.row - 1][this.col - 1].color !== this.color) {
                AllposibleMoves.push([this.row - 1, this.col - 1]);
            }
        }
        if (this.checkForCastling(GameState)[0]) {
            AllposibleMoves.push([this.row, this.col + 3]);
        }
        if (this.checkForCastling(GameState)[1]) {
            AllposibleMoves.push([this.row, this.col - 4]);
        }
        return AllposibleMoves;

    }
}