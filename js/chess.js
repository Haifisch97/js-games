class GameState {
    constructor() {
        this.board = [
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
        ]; // Зберігаємо стан дошки в масиві 
        //білі фігури - великі літери, чорні - малі
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
        if (this.color === 'white') {
            // Повертає правила для білого пішака
            if (this.isFirstMove) {
                // Повертає правила для першого ходу білого пішака
            }
        } else {
            // Повертає правила для чорного пішака
            if (this.isFirstMove) {
                // Повертає правила для першого ходу чорного пішака
            }
        }
        // Повертає правила для пішака

        return AllposibleMoves;
    }

}

class Rook extends Figure {
    constructor(color, row, col) {
        super(color, 'rook', row, col);
    }
    get checkForCastling() {
        // Перевіряє чи можна зробити рокірування
    }

    allPosibleMoves() {
        // Повертає правила для тури
        return AllposibleMoves;
    }

}

class Knight extends Figure {
    constructor(color, row, col) {
        super(color, 'knight', row, col);
    }
    allPosibleMoves() {
        // Повертає правила для коня
        return AllposibleMoves;
    }
}

class Bishop extends Figure {
    constructor(color, row, col) {
        super(color, 'bishop', row, col);
    }
    allPosibleMoves() {
        // Повертає правила для слона
        return AllposibleMoves;
    }
}

class Queen extends Figure {
    constructor(color, row, col) {
        super(color, 'queen', row, col);
    }
    allPosibleMoves() {
        // Повертає правила для ферзя
        return AllposibleMoves;
    }
}

class King extends Figure {
    constructor(color, row, col) {
        super(color, 'king', row, col);
    }
    get checkForCastling() {
        // Перевіряє чи можна зробити рокірування
    }
    allPosibleMoves() {
        // Повертає правила для короля
        return AllposibleMoves;
    }
}
