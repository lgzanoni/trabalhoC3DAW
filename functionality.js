let player1Card, player2Card, drawnNumbers;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game').addEventListener('click', initializeGame);
    document.getElementById('draw-number').addEventListener('click', drawAndProcessNumber);
    document.getElementById('draw-number').disabled = true;
});

function initializeGame() {
    drawnNumbers = new Set();
    player1Card = generateBingoCard();
    player2Card = generateBingoCard();

    displayCard(player1Card, 'player1');
    displayCard(player2Card, 'player2');
    document.getElementById('last-number').innerText = 'Ultimo Numero: Nenhum';
    document.getElementById('winner-announcement').innerText = '';
    document.getElementById('draw-number').disabled = false;
    document.getElementById('start-game').innerText = 'Jogar Novamente';
}

function drawAndProcessNumber() {
    if (drawnNumbers.size >= 75) {
        displayWinner('Todos os numero foram sorteados!');
        return;
    }

    let number;
    do {
        number = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.has(number));
    drawnNumbers.add(number);

    document.getElementById('last-number').innerText = 'Ultimo Numero foi ' + number;
    markNumber(player1Card, number, 'player1');
    markNumber(player2Card, number, 'player2');

    checkForBingo('player1');
    checkForBingo('player2');
}

function generateBingoCard() {
    let numbers = new Set();
    while (numbers.size < 24) {
        let number = Math.floor(Math.random() * 75) + 1;
        numbers.add(number);
    }
    return Array.from(numbers);
}

function displayCard(card, playerId) {
    let cardElement = document.getElementById(playerId);
    cardElement.innerHTML = '';
    let index = 0;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let numberElement = document.createElement('div');
            if (i === 2 && j === 2) {
                numberElement.className = 'number free';
                numberElement.innerText = 'FREE';
            } else {
                numberElement.innerText = card[index++];
                numberElement.className = 'number';
            }
            cardElement.appendChild(numberElement);
        }
    }
}

function drawNumber(drawnNumbers) {
    if (drawnNumbers.size >= 75) {
        return null;
    }
    let number;
    do {
        number = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.has(number));
    drawnNumbers.add(number);
    return number;
}

function markNumber(card, number, playerId) {
    let cardElement = document.getElementById(playerId);
    cardElement.childNodes.forEach(div => {
        if (div.innerText === number.toString()) {
            div.classList.add('marked');
        }
    });
}

function checkForBingo(playerId) {
    let cardElement = document.getElementById(playerId);
    let rows = columns = [];
    let mainDiagonal = [];
    let antiDiagonal = [];

    for (let i = 0; i < 5; i++) {
        let row = [];
        let column = [];
        for (let j = 0; j < 5; j++) {
            row.push(cardElement.children[i * 5 + j]);
            column.push(cardElement.children[j * 5 + i]);
        }
        rows.push(row);
        columns.push(column);
        mainDiagonal.push(cardElement.children[i * 5 + i]);
        antiDiagonal.push(cardElement.children[i * 5 + (4 - i)]);
    }

    [...rows, ...columns, mainDiagonal, antiDiagonal].forEach(line => {
        if (line.every(div => div.classList.contains('marked') || div.classList.contains('free'))) {
            displayWinner(playerId.toUpperCase() + ' Conseguiu o Bingo! Clique em jogar novamente!');
        }
    });
}

function displayWinner(message) {
    document.getElementById('winner-announcement').innerText = message;
    document.getElementById('draw-number').disabled = true;
}

function resetGame() {
    window.location.reload();
}