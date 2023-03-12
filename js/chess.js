

export class GameState {
    constructor() {
        this.board = [
            ['W-R', 'W-N', 'W-B', 'W-Q', 'W-K', 'W-B', 'W-N', 'W-R'],
            ['W-P', 'W-P', 'W-P', 'W-P', 'W-P', 'W-P', 'W-P', 'W-P'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['B-P', 'B-P', 'B-P', 'B-P', 'B-P', 'B-P', 'B-P', 'B-P'],
            ['B-R', 'B-N', 'B-B', 'B-Q', 'B-K', 'B-B', 'B-N', 'B-R']
        ]; // Зберігаємо стан дошки в масиві 
        this.currentPlayer = 'white'; // Зберігаємо поточного гравця
        this.check = false; // Чи є шах
        this.checkmate = false; // Чи є мат
        this.stalemate = false; // Чи є пат
    }
    moveFigure(figure, newPos) {
        // Переміщує фігуру на нову позицію на дошці
        let moveFigure = this.board[figure.row][figure.col];
        this.board[figure.row][figure.col] = '';
        this.board[newPos[0]][newPos[1]] = moveFigure;
        figure.row = newPos[0];
        figure.col = newPos[1];
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
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.dataset.figure = GameState.board[row][col];
            cell.textContent = GameState.board[row][col];
        }
    }
}

export function checkPosibleMoves() {
    // Перевіряє чи можна перемістити фігуру і повертає масив з можливими ходами
}

export class Pawn extends Figure {
    constructor(color, row, col) {
        super(color, 'pawn', row, col);
        this.isFirstMove = true; // Чи перший хід пішака
    }
    allPosibleMoves(GameState) {
        // Повертає правила для пішака
        const AllposibleMoves = [];
        if (this.color === 'white') {
            if (GameState.board[this.row + 1][this.col] === '') {
                // Повертає правила для білого пішака
                if (this.isFirstMove) {
                    // Повертає правила для першого ходу білого пішака
                    AllposibleMoves.push([this.row + 2, this.col]);
                    this.isFirstMove = false;
                }
                AllposibleMoves.push([this.row + 1, this.col]);
            }
            if (GameState.board[this.row + 1][this.col + 1].test(/B-/)) {
                AllposibleMoves.push([this.row + 1, this.col + 1]);
            }
            if (GameState.board[this.row + 1][this.col - 1].test(/B-/)) {
                AllposibleMoves.push([this.row + 1, this.col - 1]);
            }
        } else {
            // Повертає правила для чорного пішака
            if (this.isFirstMove) {
                // Повертає правила для першого ходу чорного пішака
                AllposibleMoves.push([this.row - 2, this.col]);
                this.isFirstMove = false;
            }
            AllposibleMoves.push([this.row - 1, this.col]);
            if (GameState.board[this.row - 1][this.col + 1].test(/W-/)) {
                AllposibleMoves.push([this.row - 1, this.col + 1]);
            }
            if (GameState.board[this.row - 1][this.col - 1].test(/W-/)) {
                AllposibleMoves.push([this.row - 1, this.col - 1]);
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
                if (GameState.board[this.row + i][this.col][0] === this.color[0].toUpperCase()) {
                    movedown = false;
                }
                if (GameState.board[this.row + i][this.col] === '') {
                    AllposibleMoves.push([this.row + i, this.col]);
                }
                if (GameState.board[this.row + i][this.col][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row + i, this.col]);
                    movedown = false;
                }
            }
            if (this.row - i >= 0 && moveup) {
                if (GameState.board[this.row - i][this.col][0] === this.color[0].toUpperCase()) {
                    moveup = false;
                }
                if (GameState.board[this.row - i][this.col] === '') {
                    AllposibleMoves.push([this.row - i, this.col]);
                }
                if (GameState.board[this.row - i][this.col][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row - i, this.col]);
                    moveup = false;
                }
            }
            if (this.col + i < 8 && moveright) {
                if (GameState.board[this.row][this.col + i][0] === this.color[0].toUpperCase()) {
                    moveright = false;
                }
                if (GameState.board[this.row][this.col + i] === '') {
                    AllposibleMoves.push([this.row, this.col + i]);
                }
                if (GameState.board[this.row][this.col + i][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row, this.col + i]);
                    moveright = false;
                }
            }
            if (this.col - i >= 0 && moveleft) {
                if (GameState.board[this.row][this.col - i][0] === this.color[0].toUpperCase()) {
                    moveleft = false;
                }
                if (GameState.board[this.row][this.col - i] === '') {
                    AllposibleMoves.push([this.row, this.col - i]);
                }
                if (GameState.board[this.row][this.col - i][0] !== this.color[0].toUpperCase()) {
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
    allPosibleMoves() {
        // Повертає правила для коня
        const AllposibleMoves = [];
        if (this.row + 2 < 8 && this.col + 1 < 8 && GameState.board[this.row + 2][this.col + 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row + 2, this.col + 1]);
        }
        if (this.row + 2 < 8 && this.col - 1 >= 0 && GameState.board[this.row + 2][this.col - 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row + 2, this.col - 1]);
        }
        if (this.row - 2 >= 0 && this.col + 1 < 8 && GameState.board[this.row - 2][this.col + 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row - 2, this.col + 1]);
        }
        if (this.row - 2 >= 0 && this.col - 1 >= 0 && GameState.board[this.row - 2][this.col - 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row - 2, this.col - 1]);
        }
        if (this.row + 1 < 8 && this.col + 2 < 8 && GameState.board[this.row + 1][this.col + 2][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row + 1, this.col + 2]);
        }
        if (this.row + 1 < 8 && this.col - 2 >= 0 && GameState.board[this.row + 1][this.col - 2][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row + 1, this.col - 2]);
        }
        if (this.row - 1 >= 0 && this.col + 2 < 8 && GameState.board[this.row - 1][this.col + 2][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row - 1, this.col + 2]);
        }
        if (this.row - 1 >= 0 && this.col - 2 >= 0 && GameState.board[this.row - 1][this.col - 2][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row - 1, this.col - 2]);
        }

        return AllposibleMoves;
    }
}

export class Bishop extends Figure {
    constructor(color, row, col) {
        super(color, 'bishop', row, col);
    }
    allPosibleMoves() {
        // Повертає правила для слона
        let moveDownRight = true;
        let moveDownLeft = true;
        let moveUpRight = true;
        let moveUpLeft = true;
        
        const AllposibleMoves = [];
        for (let i = 0; i < 8; i++) {
            if (this.row + i < 8 && this.col + i < 8 && moveDownRight) {
                if (GameState.board[this.row + i][this.col + i][0] === this.color[0].toUpperCase()) {
                    moveDownRight = false;
                }
                if (GameState.board[this.row + i][this.col + i] === '') {
                    AllposibleMoves.push([this.row + i, this.col + i]);
                }
                if (GameState.board[this.row + i][this.col + i][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row + i, this.col + i]);
                    moveDownRight = false;
                }
            }
            if (this.row + i < 8 && this.col - i >= 0 && moveDownLeft) {
                if (GameState.board[this.row + i][this.col - i][0] === this.color[0].toUpperCase()) {
                    moveDownLeft = false;
                }
                if (GameState.board[this.row + i][this.col - i] === '') {
                    AllposibleMoves.push([this.row + i, this.col - i]);
                }
                if (GameState.board[this.row + i][this.col - i][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row + i, this.col - i]);
                    moveDownLeft = false;
                }
            }
            if (this.row - i >= 0 && this.col + i < 8 && moveUpRight) {
                if (GameState.board[this.row - i][this.col + i][0] === this.color[0].toUpperCase()) {
                    moveUpRight = false;
                }
                if (GameState.board[this.row - i][this.col + i] === '') {
                    AllposibleMoves.push([this.row - i, this.col + i]);
                }
                if (GameState.board[this.row - i][this.col + i][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row - i, this.col + i]);
                    moveUpRight = false;
                }
            }
            if (this.row - i >= 0 && this.col - i >= 0 && moveUpLeft) {
                if (GameState.board[this.row - i][this.col - i][0] === this.color[0].toUpperCase()) {
                    moveUpLeft = false;
                }
                if (GameState.board[this.row - i][this.col - i] === '') {
                    AllposibleMoves.push([this.row - i, this.col - i]);
                }
                if (GameState.board[this.row - i][this.col - i][0] !== this.color[0].toUpperCase()) {
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
    allPosibleMoves() {
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
        for (let i = 0; i < 8; i++) {
            if (this.row + i < 8 && this.col + i < 8 && moveDownRight) {
                if (GameState.board[this.row + i][this.col + i][0] === this.color[0].toUpperCase()) {
                    moveDownRight = false;
                }
                if (GameState.board[this.row + i][this.col + i] === '') {
                    AllposibleMoves.push([this.row + i, this.col + i]);
                }
                if (GameState.board[this.row + i][this.col + i][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row + i, this.col + i]);
                    moveDownRight = false;
                }
            }
            if (this.row + i < 8 && this.col - i >= 0 && moveDownLeft) {
                if (GameState.board[this.row + i][this.col - i][0] === this.color[0].toUpperCase()) {
                    moveDownLeft = false;
                }
                if (GameState.board[this.row + i][this.col - i] === '') {
                    AllposibleMoves.push([this.row + i, this.col - i]);
                }
                if (GameState.board[this.row + i][this.col - i][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row + i, this.col - i]);
                    moveDownLeft = false;
                }
            }
            if (this.row - i >= 0 && this.col + i < 8 && moveUpRight) {
                if (GameState.board[this.row - i][this.col + i][0] === this.color[0].toUpperCase()) {
                    moveUpRight = false;
                }
                if (GameState.board[this.row - i][this.col + i] === '') {
                    AllposibleMoves.push([this.row - i, this.col + i]);
                }
                if (GameState.board[this.row - i][this.col + i][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row - i, this.col + i]);
                    moveUpRight = false;
                }
            }
            if (this.row - i >= 0 && this.col - i >= 0 && moveUpLeft) {
                if (GameState.board[this.row - i][this.col - i][0] === this.color[0].toUpperCase()) {
                    moveUpLeft = false;
                }
                if (GameState.board[this.row - i][this.col - i] === '') {
                    AllposibleMoves.push([this.row - i, this.col - i]);
                }
                if (GameState.board[this.row - i][this.col - i][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row - i, this.col - i]);
                    moveUpLeft = false;
                }
            }
            if (this.row + i < 8 && movedown) {
                if (GameState.board[this.row + i][this.col][0] === this.color[0].toUpperCase()) {
                    movedown = false;
                }
                if (GameState.board[this.row + i][this.col] === '') {
                    AllposibleMoves.push([this.row + i, this.col]);
                }
                if (GameState.board[this.row + i][this.col][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row + i, this.col]);
                    movedown = false;
                }
            }
            if (this.row - i >= 0 && moveup) {
                if (GameState.board[this.row - i][this.col][0] === this.color[0].toUpperCase()) {
                    moveup = false;
                }
                if (GameState.board[this.row - i][this.col] === '') {
                    AllposibleMoves.push([this.row - i, this.col]);
                }
                if (GameState.board[this.row - i][this.col][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row - i, this.col]);
                    moveup = false;
                }
            }
            if (this.col + i < 8 && moveright) {
                if (GameState.board[this.row][this.col + i][0] === this.color[0].toUpperCase()) {
                    moveright = false;
                }
                if (GameState.board[this.row][this.col + i] === '') {
                    AllposibleMoves.push([this.row, this.col + i]);
                }
                if (GameState.board[this.row][this.col + i][0] !== this.color[0].toUpperCase()) {
                    AllposibleMoves.push([this.row, this.col + i]);
                    moveright = false;
                }
            }
            if (this.col - i >= 0 && moveleft) {
                if (GameState.board[this.row][this.col - i][0] === this.color[0].toUpperCase()) {
                    moveleft = false;
                }
                if (GameState.board[this.row][this.col - i] === '') {
                    AllposibleMoves.push([this.row, this.col - i]);
                }
                if (GameState.board[this.row][this.col - i][0] !== this.color[0].toUpperCase()) {
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
    allPosibleMoves() {
        // Повертає правила для короля
        const AllposibleMoves = [];
        if (this.row + 1 < 8 && this.col + 1 < 8 && GameState.board[this.row + 1][this.col + 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row + 1, this.col + 1]);
        }
        if (this.row + 1 < 8 && this.col - 1 >= 0 && GameState.board[this.row + 1][this.col - 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row + 1, this.col - 1]);
        }
        if (this.row - 1 >= 0 && this.col + 1 < 8 && GameState.board[this.row - 1][this.col + 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row - 1, this.col + 1]);
        }
        if (this.row - 1 >= 0 && this.col - 1 >= 0 && GameState.board[this.row - 1][this.col - 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row - 1, this.col - 1]);
        }
        if (this.row + 1 < 8 && GameState.board[this.row + 1][this.col][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row + 1, this.col]);
        }
        if (this.row - 1 >= 0 && GameState.board[this.row - 1][this.col][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row - 1, this.col]);
        }
        if (this.col + 1 < 8 && GameState.board[this.row][this.col + 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row, this.col + 1]);
        }
        if (this.col - 1 >= 0 && GameState.board[this.row][this.col - 1][0] !== this.color[0].toUpperCase()) {
            AllposibleMoves.push([this.row, this.col - 1]);
        }

        return AllposibleMoves;
    }
}

