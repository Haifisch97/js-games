function createBoard () {
    const colLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        let color = (row + col) % 2 === 0 ? "white" : "black";
      let cell = `<div class="cell ${color}" data-row="${row}" data-col="${col}"
       data-letter="${colLetters[col]}" data-figure=''></div>` 
      document.querySelector(".board").innerHTML += cell;
    }
  }
}

createBoard();
