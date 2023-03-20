

export class GameState {
    constructor() {
        this.board = [
            ['WtR', 'WtN', 'WtB', 'WtQ', 'WtK', 'WtB', 'WtN', 'WtR'],
            ['WtP', 'WtP', 'WtP', 'WtP', 'WtP', 'WtP', 'WtP', 'WtP'],
            ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
            ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
            ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
            ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
            ['BkP', 'BkP', 'BkP', 'BkP', 'BkP', 'BkP', 'BkP', 'BkP'],
            ['BkR', 'BkN', 'BkB', 'BkQ', 'BkK', 'BkB', 'BkN', 'BkR']
        ]; // Зберігаємо стан дошки в масиві 
        this.currentPlayer = 'white'; // Зберігаємо поточного гравця
        this.check = false; // Чи є шах
        this.checkmate = false; // Чи є мат
        this.stalemate = false; // Чи є пат
    }
    moveFigure(currentRow ,currentCol, newRow, newCol) {
        // Переміщує фігуру на нову позицію на дошці 
        let moveFigure = this.board[currentRow][currentCol];
        this.board[newRow][newCol] = moveFigure;
        this.board[currentRow][currentCol] = null;
        moveFigure.row = newRow;
        moveFigure.col = newCol;
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }
    checkForCheck() {
        // Перевіряє чи є шах
    }
    checkForCheckmate() {
        // Перевіряє чи є мат
    }
    checkForStalemate() {
        // Перевіряє чи є пат
    }
    addFigureOnBoard(Figures) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] !== '   ') {
                    if (this.board[row][col][0] === 'W') {
                        let wfigure = new Figures[this.board[row][col][2]];
                        wfigure.color = 'white';
                        wfigure.row = row;
                        wfigure.col = col;
                        this.board[row][col] = wfigure;
                    } else if (this.board[row][col][0] === 'B') {
                        let bfigure = new Figures[this.board[row][col][2]];
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

export class Pawn extends Figure {
    constructor(color, row, col) {
        super(color, 'pawn', row, col);
        
    }
    allPosibleMoves(GameState) {
        // Повертає правила для пішака
        const AllposibleMoves = [];
        if (this.color === 'white') {
           console.log( GameState.board[this.row + 1][this.col]);
            if (GameState.board[this.row + 1][this.col] === null) {
                // Повертає правила для білого пішака
                AllposibleMoves.push([this.row + 1, this.col]);
            }
            if (this.row === 1 && GameState.board[this.row + 2][this.col] === null) {
                // Повертає правила для першого ходу білого пішака
                AllposibleMoves.push([this.row + 2, this.col]);
            }
            if (GameState.board[this.row + 1][this.col + 1] !== null && this.row + 1 < 8 && this.col + 1 < 8) {
                if (GameState.board[this.row + 1][this.col + 1].color === 'black') {
                    AllposibleMoves.push([this.row + 1, this.col + 1]);
                }
            }
            if (GameState.board[this.row + 1][this.col - 1] !== null && this.row + 1 < 8 && this.col - 1 >= 0) {
                if (GameState.board[this.row + 1][this.col - 1].color === 'black') {
                    AllposibleMoves.push([this.row + 1, this.col - 1]);
                }
            }
        } else if (this.color === 'black') {
            if (GameState.board[this.row - 1][this.col] === null) {
                // Повертає правила для чорного пішака
                AllposibleMoves.push([this.row - 1, this.col]);
            }
            if (this.row === 6 && GameState.board[this.row - 2][this.col] === null) {
                // Повертає правила для першого ходу чорного пішака
                AllposibleMoves.push([this.row - 2, this.col]);
            }
            if (GameState.board[this.row - 1][this.col + 1] !== null && this.row + 1 < 8 && this.col + 1 < 8) {
                if (GameState.board[this.row - 1][this.col + 1].color === 'white') {
                    AllposibleMoves.push([this.row - 1, this.col + 1]);
                }
            }
            if (GameState.board[this.row - 1][this.col - 1] !== null && this.row + 1 < 8 && this.col - 1 >= 0) {
                if (GameState.board[this.row - 1][this.col - 1].color === 'white') {
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
        return AllposibleMoves;
    }
}

