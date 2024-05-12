let canvas, ctx, fruit, snake, dx, dy, gameInterval;
let gameActive = false;
let balance = 100;
let betAmount = 10;
let potentialReward = 0;
let fruitsEaten = 0;
let tileSize = 20; // Set tile size for snake and fruit
const logContainer = document.getElementById('game-log');
let moveInterval = 2;
let directionQueue = [];
let snakeSize = 0;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('cashout').addEventListener('click', cashout);
    document.addEventListener('keydown', changeDirection);
});

function startGame() {
    snakeSize = 3;
    updateDisplay();
    betAmount = parseFloat(document.getElementById('bet-amount').value);
    if (betAmount > balance) {
        alert("Insufficient balance to start the game.");
        return;
    }
    balance -= betAmount;
    updateDisplay();
    gameActive = true;
    init();
    document.getElementById('cashout').style.display = 'block';
    updateLog(`🍀Game started!🍀 Bet: $${betAmount}`, "white");
}

function cashout() {
    if (!gameActive) {
        alert("No game is active.");
        return;
    }
    balance += potentialReward;
    updateLog(`🤑You cashed out🤑 $${potentialReward.toFixed(2)}!`, "green");
    resetGame();
}

function init() {
    canvas = document.getElementById('snake-board');
    ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    resetGame();
    gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
    if (!gameActive) return;
    moveSnake();
    if (gameActive) {
        clearCanvas();
        drawSnake();
        drawFruit();
    }
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(part => {
        ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    });
}

function drawFruit() {
    ctx.fillStyle = 'red';
    ctx.fillRect(fruit.x * tileSize, fruit.y * tileSize, tileSize, tileSize);
}

function moveSnake() {
    if (directionQueue.length > 0) {
        const nextDirection = directionQueue.shift();
        dx = nextDirection.dx;
        dy = nextDirection.dy;
    }
    let head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === fruit.x && head.y === fruit.y) {
        increaseReward();
        placeFruit();
        snakeSize++;
        updateDisplay();
    } else {
        snake.pop();
    }
    checkCollision(head);
}

function increaseReward() {
    let increment = 0.1 * Math.pow(2, Math.floor(fruitsEaten / 100)); // Increase reward by 10% every 10 fruits by 2
    fruitsEaten++;
    if (fruitsEaten % 10 === 0) {
        betAmount += betAmount; 
        updateLog(`🌟Reward increased!🌟 to $${betAmount.toFixed(2)/10}`, "yellow");
    }

    console.log("Increment: ", increment);
    console.log("Fruits eaten: ", fruitsEaten);
    console.log("Total increment: ", betAmount * increment);    
    //fruitsEaten++;
    potentialReward += betAmount * increment;
    //Increase speed of snake every 3 fruits by 1 with a maximum of 10
    if (fruitsEaten % 3 === 0 && moveInterval < 10) moveInterval++;
    updateLog
    updateLog(`🍎Fruit eaten!🍏 Reward increased by $${(betAmount * increment).toFixed(2)}`, "green");
    updateDisplay();
}

function placeFruit() {
    fruit = {
        x: Math.floor(Math.random() * (canvas.width / tileSize)),
        y: Math.floor(Math.random() * (canvas.height / tileSize))
    };
    if (snake.some(part => part.x === fruit.x && part.y === fruit.y)) placeFruit();
}

function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameActive = false;
            updateLog("🐍Snake died!💀 Snake hit itself!", "red");
            updateLog(`💸Money lost💸 $${(betAmount).toFixed(2)}`, "lime");
            snakeSize = 3;
            updateDisplay();
            resetGame();
            return;
        }
    }
    if (head.x < 0 || head.x >= canvas.width / tileSize || head.y < 0 || head.y >= canvas.height / tileSize) {
        gameActive = false;
        resetGame();
        updateLog("🐍Snake died!💀 Hit the wall!", "red");
        updateLog(`💸Money lost💸 $${(betAmount).toFixed(2)}`, "yellow");
        snakeSize = 3;
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('potential-reward').textContent = `$${potentialReward.toFixed(2)}`;
    document.getElementById('fruits-eaten').textContent = fruitsEaten;
    document.getElementById('snake-length').textContent = snakeSize;
/*     document.getElementById('snake-length').textContent = snake.length;
 */}

function updateLog(message, className) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${className}`;
    entry.textContent = message;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function resetGame() {
    clearInterval(gameInterval);
    snake = [{x: 5, y: 5}, {x: 4, y: 5}, {x: 3, y: 5}];
    dx = 1; dy = 0;
    fruitsEaten = 0;
    potentialReward = 0;
    placeFruit();
    updateDisplay();
    document.getElementById('cashout').style.display = 'none';
    logContainer.innerHTML = '';
    gameActive = true;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === 37 && !goingRight) { // Left arrow
        directionQueue.push({ dx: -1, dy: 0 });
    } else if (keyPressed === 38 && !goingDown) { // Up arrow
        directionQueue.push({ dx: 0, dy: -1 });
    } else if (keyPressed === 39 && !goingLeft) { // Right arrow
        directionQueue.push({ dx: 1, dy: 0 });
    } else if (keyPressed === 40 && !goingUp) { // Down arrow
        directionQueue.push({ dx: 0, dy: 1 });
    }
}

