let balance = 100; // Starting balance
let potentialReward = 0; // Reward accumulated during the game
let mineCount = 0; // Number of mines on the board
let boardSize = 0; // Size of the board
const balanceDisplay = document.getElementById('balance');
const potentialRewardDisplay = document.getElementById('potential-reward'); // Ensure this ID matches your HTML
const logContainer = document.getElementById('game-log'); // Ensure this ID is correct in your HTML
ongoingGame = false;


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    updateBalanceDisplay();

    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('cashout').addEventListener('click', cashout);
});


function startGame() {
    console.log("Start game clicked");
    if (balance <= 0) {
        alert("You don't have enough money to play!");
        return;
    }

    boardSize = parseInt(document.getElementById('board-size').value);
    mineCount = parseInt(document.getElementById('mine-count').value);
    const betAmount = parseFloat(document.getElementById('bet-amount').value);
    
    if (betAmount > balance) {
        alert("Insufficient funds to place this bet.");
        return;
    }

    balance -= betAmount;
    updateBalanceDisplay();
    potentialReward = 0;
    updateRewardDisplay();
    logContainer.innerHTML = `<div class="log-entry white">🍀Game started!🤞 Bet: $${betAmount}</div>`;
    initializeBoard();
    document.getElementById('cashout').style.display = 'block';
    ongoingGame = true; // Enable game activity
}

function cashout() {
    console.log("Cashout clicked");
    balance += potentialReward;
    updateBalanceDisplay();
    earned = potentialReward;
    resetGame();
    ongoingGame = true;
    updateLog(`🤑Cashout!🤑 +$${earned.toFixed(2)}`, "green");
}

function initializeBoard() {
    const board = document.getElementById('mines-board');
    board.innerHTML = '';
    board.style.display = 'grid'; // Ensure the board is visible
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}

function handleCellClick() {
    if (!ongoingGame) return; // Prevent interaction if the game isn't active

    this.removeEventListener('click', handleCellClick); // Prevent multiple clicks on the same cell
    const hitMine = Math.random() < (mineCount / (boardSize * boardSize));
    if (hitMine) {
        this.classList.add('bomb');
        potlost = potentialReward;
        resetGame();
        updateLog("💣 BOMB 💣 Game Over! ")
        updateLog("Bet lost: $" + parseFloat(document.getElementById('bet-amount').value).toFixed(2), "red");
        updateLog(`Potential lost: $${potlost.toFixed(2)}`, "yellow");

    } else {
        this.classList.add('diamond');
        const reward = parseFloat(document.getElementById('bet-amount').value) * 0.2;
        potentialReward += reward;
        updateRewardDisplay();
        updateLog(`💎Diamond found!💎 +$${reward.toFixed(2)}`, "green");
    }
}


function updateBalanceDisplay() {
    balanceDisplay.textContent = `$${balance.toFixed(2)}`;
}

function updateRewardDisplay() {
    console.log("Updating reward display. Element found: ", potentialRewardDisplay);
    potentialRewardDisplay.textContent = `$${potentialReward.toFixed(2)}`;
}


function updateLog(message, className) {
    logContainer.innerHTML += `<div class="log-entry ${className}">${message}</div>`;
    logContainer.scrollTop = logContainer.scrollHeight;
}

function attachCellEventListeners() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

function detachCellEventListeners() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
    });
}

function resetGame() {
    ongoingGame = false;
    detachCellEventListeners(); // Remove event listeners on reset
    potentialReward = 0; // Reset potential reward
    updateRewardDisplay(); // Make sure to update the reward display to $0.00
    updateBalanceDisplay(); // Update the balance display    document.getElementById('mines-board').innerHTML = 'none'; // Clear the board visually
    document.getElementById('mines-board').style.display = ''; // Show the board
    logContainer.innerHTML = ''; // Clear the log
    document.getElementById('cashout').style.display = 'none'; // Hide cashout button
    initializeBoard(); // Reinitialize the board for a new game
}

/* Update amount of mines slider mine-count-display  */
document.getElementById('mine-count').addEventListener('input', function() {
    document.getElementById('mine-count-display').textContent = this.value;
}
);

