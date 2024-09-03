const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;

let secretCode = [];
let currentGuess = [];
let currentRow = 0;

const gameBoard = document.getElementById('game-board');
const secretCodeElement = document.getElementById('secret-code');
const guessRowsElement = document.getElementById('guess-rows');
const colorChoicesElement = document.getElementById('color-choices');
const checkButton = document.getElementById('check-btn');
const newGameButton = document.getElementById('new-game-btn');

function initializeGame() {
    secretCode = generateCode();
    currentGuess = [];
    currentRow = 0;
    
    // Clear the game board
    secretCodeElement.innerHTML = '';
    guessRowsElement.innerHTML = '';
    colorChoicesElement.innerHTML = '';

    // Create secret code placeholders
    for (let i = 0; i < CODE_LENGTH; i++) {
        const peg = createPeg('gray');
        secretCodeElement.appendChild(peg);
    }

    // Create guess rows
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.className = 'code-row';
        for (let j = 0; j < CODE_LENGTH; j++) {
            const peg = createPeg('gray');
            peg.addEventListener('click', () => selectColor(i, j));
            row.appendChild(peg);
        }
        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'feedback-container';
        row.appendChild(feedbackContainer);
        guessRowsElement.appendChild(row);
    }

    // Create color choices
    COLORS.forEach(color => {
        const peg = createPeg(color);
        peg.addEventListener('click', () => selectColorChoice(color));
        colorChoicesElement.appendChild(peg);
    });

    checkButton.disabled = true;
}

function createPeg(color) {
    const peg = document.createElement('div');
    peg.className = 'peg';
    peg.style.backgroundColor = color;
    return peg;
}

function generateCode() {
    return Array.from({ length: CODE_LENGTH }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
}

function selectColor(row, col) {
    if (row !== currentRow || currentGuess.length >= CODE_LENGTH) return;
    
    const selectedColor = currentGuess[currentGuess.length - 1];
    if (selectedColor) {
        currentGuess.push(selectedColor);
        const peg = guessRowsElement.children[row].children[col];
        peg.style.backgroundColor = selectedColor;
        
        if (currentGuess.length === CODE_LENGTH) {
            checkButton.disabled = false;
        }
    }
}

function selectColorChoice(color) {
    if (currentGuess.length < CODE_LENGTH) {
        currentGuess.push(color);
        const peg = guessRowsElement.children[currentRow].children[currentGuess.length - 1];
        peg.style.backgroundColor = color;
        
        if (currentGuess.length === CODE_LENGTH) {
            checkButton.disabled = false;
        }
    }
}

function checkGuess() {
    if (currentGuess.length !== CODE_LENGTH) return;

    const feedback = evaluateGuess(currentGuess);
    displayFeedback(feedback);

    if (feedback.correct === CODE_LENGTH) {
        endGame(true);
    } else if (currentRow === MAX_ATTEMPTS - 1) {
        endGame(false);
    } else {
        currentRow++;
        currentGuess = [];
        checkButton.disabled = true;
    }
}

function evaluateGuess(guess) {
    let correct = 0;
    let misplaced = 0;
    const codeCopy = [...secretCode];
    const guessCopy = [...guess];

    // Check for correct positions
    for (let i = 0; i < CODE_LENGTH; i++) {
        if (guessCopy[i] === codeCopy[i]) {
            correct++;
            codeCopy[i] = guessCopy[i] = null;
        }
    }

    // Check for misplaced colors
    for (let i = 0; i < CODE_LENGTH; i++) {
        if (guessCopy[i] !== null) {
            const index = codeCopy.indexOf(guessCopy[i]);
            if (index !== -1) {
                misplaced++;
                codeCopy[index] = null;
            }
        }
    }

    return { correct, misplaced };
}

function displayFeedback(feedback) {
    const feedbackContainer = guessRowsElement.children[currentRow].lastElementChild;
    feedbackContainer.innerHTML = '';

    for (let i = 0; i < feedback.correct; i++) {
        const peg = document.createElement('div');
        peg.className = 'feedback-peg';
        peg.style.backgroundColor = 'black';
        feedbackContainer.appendChild(peg);
    }

    for (let i = 0; i < feedback.misplaced; i++) {
        const peg = document.createElement('div');
        peg.className = 'feedback-peg';
        peg.style.backgroundColor = 'white';
        feedbackContainer.appendChild(peg);
    }
}

function endGame(won) {
    // Reveal secret code
    secretCodeElement.innerHTML = '';
    secretCode.forEach(color => {
        const peg = createPeg(color);
        secretCodeElement.appendChild(peg);
    });

    // Disable further guesses
    checkButton.disabled = true;

    // Show game result
    setTimeout(() => {
        if (won) {
            alert('Congratulations! You cracked the code!');
        } else {
            alert('Game over! You failed to crack the code.');
        }
    }, 500);
}

checkButton.addEventListener('click', checkGuess);
newGameButton.addEventListener('click', initializeGame);

// Start the game
initializeGame();