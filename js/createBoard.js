function createBoard () {
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        let color = (row + col) % 2 === 0 ? "black" : "white";
      let cell = `<div class="cell ${color}" data-row="${row}" data-col="${col}"></div>` 
      document.querySelector(".board").innerHTML += cell;
    }
  }
}

createBoard();
