

class GameState {
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

class Figure {
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

function reloadBoard(GameState) {   
    // Перезавантажує дошку на сторінці зі станом дошки з GameState
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.dataset.figure = GameState.board[row][col];
            cell.textContent = GameState.board[row][col];
        }
    }
}

function checkPosibleMoves() {
    // Перевіряє чи можна перемістити фігуру і повертає масив з можливими ходами
}

class Pawn extends Figure {
    constructor(color, row, col) {
        super(color, 'pawn', row, col);
        this.isFirstMove = true; // Чи перший хід пішака
    }
    allPosibleMoves() {
        const AllposibleMoves = [];
        if (this.color === 'white') {
            // Повертає правила для білого пішака
            if (this.isFirstMove) {
                // Повертає правила для першого ходу білого пішака
                AllposibleMoves.push([this.row - 2, this.col]);
                this.isFirstMove = false;
            }
            AllposibleMoves.push([this.row - 1, this.col]);
        } else {
            // Повертає правила для чорного пішака
            if (this.isFirstMove) {
                // Повертає правила для першого ходу чорного пішака
                AllposibleMoves.push([this.row + 2, this.col]);
                this.isFirstMove = false;
            }
            AllposibleMoves.push([this.row + 1, this.col]);
        }
        // Повертає правила для пішака

        return AllposibleMoves;
    }

}

class Rook extends Figure {
    constructor(color, row, col) {
        super(color, 'rook', row, col);
        this.isFirstMove = true; // Чи перший хід тури
    }
    get checkForCastling() {
        // Перевіряє чи можна зробити рокірування
    }

    allPosibleMoves() {
        // Повертає правила для тури
        const AllposibleMoves = [];
        for (let i = 0; i < 8; i++) {
            AllposibleMoves.push([this.row, i]);
            AllposibleMoves.push([i, this.col]);
        }
        return AllposibleMoves;
    }

}

class Knight extends Figure {
    constructor(color, row, col) {
        super(color, 'knight', row, col);
    }
    allPosibleMoves() {
        // Повертає правила для коня
        const AllposibleMoves = [];
        AllposibleMoves.push([this.row + 2, this.col + 1]);
        AllposibleMoves.push([this.row + 2, this.col - 1]);
        AllposibleMoves.push([this.row - 2, this.col + 1]);
        AllposibleMoves.push([this.row - 2, this.col - 1]);
        AllposibleMoves.push([this.row + 1, this.col + 2]);
        AllposibleMoves.push([this.row + 1, this.col - 2]);
        AllposibleMoves.push([this.row - 1, this.col + 2]);
        AllposibleMoves.push([this.row - 1, this.col - 2]);

        return AllposibleMoves;
    }
}

class Bishop extends Figure {
    constructor(color, row, col) {
        super(color, 'bishop', row, col);
    }
    allPosibleMoves() {
        // Повертає правила для слона
        const AllposibleMoves = [];
        for (let i = 0; i < 8; i++) {
            AllposibleMoves.push([this.row + i, this.col + i]);
            AllposibleMoves.push([this.row + i, this.col - i]);
            AllposibleMoves.push([this.row - i, this.col + i]);
            AllposibleMoves.push([this.row - i, this.col - i]);
        }
        return AllposibleMoves;
    }
}

class Queen extends Figure {
    constructor(color, row, col) {
        super(color, 'queen', row, col);
    }
    allPosibleMoves() {
        // Повертає правила для ферзя
        const AllposibleMoves = [];
        for (let i = 0; i < 8; i++) {
            AllposibleMoves.push([this.row, i]);
            AllposibleMoves.push([i, this.col]);
            AllposibleMoves.push([this.row + i, this.col + i]);
            AllposibleMoves.push([this.row + i, this.col - i]);
            AllposibleMoves.push([this.row - i, this.col + i]);
            AllposibleMoves.push([this.row - i, this.col - i]);
        }
        return AllposibleMoves;
    }
}

class King extends Figure {
    constructor(color, row, col) {
        super(color, 'king', row, col);
        this.isFirstMove = true; // Чи перший хід короля
    }
    get checkForCastling() {
        // Перевіряє чи можна зробити рокірування
    }
    allPosibleMoves() {
        // Повертає правила для короля
        const AllposibleMoves = [];
        AllposibleMoves.push([this.row + 1, this.col + 1]);
        AllposibleMoves.push([this.row + 1, this.col - 1]);
        AllposibleMoves.push([this.row - 1, this.col + 1]);
        AllposibleMoves.push([this.row - 1, this.col - 1]);
        AllposibleMoves.push([this.row + 1, this.col]);
        AllposibleMoves.push([this.row - 1, this.col]);
        AllposibleMoves.push([this.row, this.col + 1]);
        AllposibleMoves.push([this.row, this.col - 1]);
        return AllposibleMoves;
    }
}


const newGame = new GameState(); // Створюємо нову гру
reloadBoard(newGame); // Перезавантажуємо дошку на сторінці

