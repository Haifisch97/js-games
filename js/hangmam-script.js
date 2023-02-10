(function () {
    let words = [
        'javascript',
        'shrk',
        'pancake',
        'student',
        'snowman',
        'november'
    ];
    let word = words[Math.floor(Math.random() * words.length)];
    let answerArray = [];
    for (let i = 0; i < word.length; i++) {
        answerArray[i] = '_';
    }
    let remaindingLetters = word.length;
    while (remaindingLetters > 0) {
        alert('Your progres: ' + answerArray.join(' '));
        let guess = prompt('Guess a letter, or click Cancel to stop playing.').toLowerCase();
        if (guess === null) {
            break;
        } else if (guess.length != 1) {
            alert('Please enter a single letter.');
        } else {
            for (let j = 0; j < word.length; j++) {
                if (word[j] === guess) {
                    answerArray[j] = guess;
                    remaindingLetters--;
                }
            }
        }
    }
    alert(answerArray.join(' '));
    alert('Good job! The answer was ' + word)
}) ();