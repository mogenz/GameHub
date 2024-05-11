document.addEventListener('DOMContentLoaded', () => {


    /* PLINKO */



    const board = document.getElementById('plinko-board');
    const balanceDisplay = document.getElementById('balance');
    const riskSelect = document.getElementById('risk');
    let pegs = [];

    // Set starting balance
    let balance = 100;
    balanceDisplay.textContent = `$${balance.toFixed(2)}`;

    document.getElementById('double').addEventListener('click', function() {
        const ballValueInput = document.getElementById('ball-value');
        ballValueInput.value = Math.min(ballValueInput.value * 2, ballValueInput.max);
    });
    
    document.getElementById('half').addEventListener('click', function() {
        const ballValueInput = document.getElementById('ball-value');
        ballValueInput.value = Math.max(ballValueInput.value / 2, ballValueInput.min);
    });

    const multipliersByRisk = {
        easy: [3, 1.5, 1, 0.8, 1, 1.5, 3],
        medium: [4, 2, 0.8, 0.5, 0.8, 2, 4],
        hard: [100, 0.8, 0.5, 0.1, 0.5, 0.8, 100]
    };
    
    function initializeBoard() {
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }
        createPegs(); // Create pegs once and do not change them on 'rows' change
        updateBuckets();
    }

    function createPegs() {
    const totalPegs = 7; // Number of peg rows
    let pegCount = 3; // Starting peg count
    for (let row = 0; row < totalPegs; row++) {
        const spacing = board.offsetHeight / (totalPegs + 1); // Ensure pegs reach to the bottom
        const offsetY = (spacing * row) + 90; // Adjusted to start a bit lower
        const offset = (board.offsetWidth / 2) - ((pegCount - 1) / 2 * 50);
        for (let i = 0; i < pegCount; i++) {
            const peg = document.createElement('div');
            peg.className = 'peg';
            peg.style.left = `${offset + i * 50}px`;
            peg.style.top = `${offsetY}px`;
            peg.hit = false; // Add a property to track whether the peg has been hit
            board.appendChild(peg);
            pegs.push({ x: offset + i * 50, y: offsetY });
        }
        pegCount += 2;
    }
}
function createBuckets(risk) {
    const multipliers = multipliersByRisk[risk]; // Fetch the correct set of multipliers based on risk
    const bucketWidth = board.offsetWidth / multipliers.length; // Calculate bucket width based on number of multipliers
    const totalBuckets = multipliers.length; // Total number of buckets

    // Create the buckets
    for (let i = 0; i < multipliers.length; i++) {
        const bucket = createBucket(multipliers[i], bucketWidth, bucketWidth * i, i, totalBuckets);
        board.appendChild(bucket);
    }
}

function createBucket(multiplier, width, left, index, totalBuckets) {
    const bucket = document.createElement('div');
    bucket.className = 'bucket';
    bucket.style.width = `${width}px`; // Set bucket width
    bucket.style.left = `${left}px`; // Position bucket
    bucket.textContent = multiplier; // Display multiplier value
    bucket.style.bottom = '0'; // Position bucket at the bottom

    bucket.style.textAlign = 'center'; // Center text horizontally
    bucket.style.lineHeight = `${bucket.offsetHeight}px`; // Center text vertically

    // Calculate color based on position
    const colorRatio = Math.abs(index - (totalBuckets - 1) / 2) / ((totalBuckets - 1) / 2);
    const red = Math.floor(255 * colorRatio);
    const green = Math.floor(255 * (1 - colorRatio));
    bucket.style.backgroundColor = `rgb(${red}, ${green}, 0)`;

    return bucket;
}

    function updateBuckets() {
        const risk = riskSelect.value;
        const bucketElements = board.querySelectorAll('.bucket');
        bucketElements.forEach(el => el.remove()); // Remove existing buckets
        createBuckets(risk); // Create new buckets based on the selected risk level
    }
    
        
    function dropChip() {
        // Get the ball value from the input field
        const ballValue = parseFloat(document.getElementById('ball-value').value).toFixed(2);
    
        // Check if the ball value is greater than the balance
        if (ballValue > balance) {
            alert('Not enough balance to drop a ball');
            return;
        }

        // Deduct the ball value from the balance
        balance -= ballValue;

        // Update balance display
        balanceDisplay.textContent  = `$${balance.toFixed(2)}`;

        console.log('ball dropped', balance) // DEBUG
        console.log('ball value', ballValue) // DEBUG

        // Create a new Set to store the hit pegs for this ball
        const hitPegs = new Set();
    
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.style.left = `${board.offsetWidth / 2 - 10}px`; // Ensures it starts at the center
        chip.style.top = '10px'; // Start slightly from the top
        board.appendChild(chip);
    
        let position = parseInt(chip.style.top, 10);
        let direction = 0; // Initial direction is straight down
        let gravity = 0.5; // Start with a small gravity value
    
        const interval = setInterval(() => {
            gravity += 0.5; // Increase gravity over time
            position += gravity; // Increase position by gravity
            chip.style.top = `${position}px`;
            chip.style.left = `${parseInt(chip.style.left) + direction}px`;
    
            // Collision detection
            document.querySelectorAll('.peg').forEach(peg => {
                const pegX = parseInt(peg.style.left);
                const pegY = parseInt(peg.style.top);
                const chipX = parseInt(chip.style.left);
                const chipY = parseInt(chip.style.top);
    
                // Check if chip hits a peg
                if (!hitPegs.has(peg) && Math.abs(pegX - chipX) < 20 && Math.abs(pegY - chipY) < 20) {
                    direction = Math.random() > 0.5 ? 3 : -3;  // Change direction randomly on hit with more bounce
                    hitPegs.add(peg); // Add the peg to the set of hit pegs
                    gravity = 0.5; // Reset gravity after hit
                }
            });
    
            if (position > board.offsetHeight - 50) {
                clearInterval(interval);
                finalizeDrop(chip);
            }
        }, 20);
    }
    
    function finalizeDrop(chip) {
        const chipX = parseInt(chip.style.left);
        const chipValue = parseFloat(document.getElementById('ball-value').value).toFixed(2);
    
        // Find the bucket that the chip fell into
        const bucket = Array.from(document.querySelectorAll('.bucket')).find(bucket => {
            const bucketX = parseInt(bucket.style.left);
            const bucketWidth = parseInt(bucket.style.width);
            return chipX >= bucketX && chipX <= bucketX + bucketWidth;
        });
    
        if (bucket) {
            const multiplier = parseFloat(bucket.textContent).toFixed(2);
            // Update balance correctly with two decimals
            balance = parseFloat((balance + chipValue * multiplier).toFixed(2));
            // Display new balance correctly with two decimal places
            balanceDisplay.textContent = `$${balance.toFixed(2)}`;
            bucket.classList.add('bounce'); // Add bounce animation
            setTimeout(() => bucket.classList.remove('bounce'), 1000); // Remove bounce animation after 1 second
        }
    
        board.removeChild(chip); // Remove chip from board
    }
    function pegCollisionCheck(chip) {
        // Dummy function for collision checking
        // You would add actual collision detection logic here
    }

    riskSelect.addEventListener('change', updateBuckets);

initializeBoard(); // Initial setup

let autoDropInterval = null;

document.getElementById('drop-chip').addEventListener('click', function() {
    const dropButton = this;
    const autoModeCheckbox = document.getElementById('auto-mode');
    const dropperSpeedSlider = document.getElementById('dropper-speed');
    const speedDisplay = document.getElementById('speed-display'); // Get the speed display element

    let dropperSpeed = dropperSpeedSlider.value;
    speedDisplay.textContent = dropperSpeed;  // Display initial speed

    dropperSpeedSlider.addEventListener('input', function() {
        dropperSpeed = this.value;
        speedDisplay.textContent = dropperSpeed;  // Update displayed speed

        if (autoDropInterval) {
            // If balls are already dropping, stop them
            clearInterval(autoDropInterval);
            autoDropInterval = null;
        }
        // Convert dropperSpeed to a number and calculate interval
        let interval = 1000 / Number(dropperSpeed);
        autoDropInterval = setInterval(dropChip, interval);  // Use interval based on dropperSpeed
    });

    if (autoModeCheckbox.checked) {
        if (autoDropInterval) {
            // If balls are already dropping, stop them
            clearInterval(autoDropInterval);
            autoDropInterval = null;
            dropButton.style.backgroundColor = ''; // Reset button color
            dropButton.textContent = 'Drop'; // Reset button text
        } else {
            // Convert dropperSpeed to a number and calculate interval
            let interval = 1000 / Number(dropperSpeed);
            autoDropInterval = setInterval(dropChip, interval);  // Use interval based on dropperSpeed
            dropButton.style.backgroundColor = 'red'; // Change button color to indicate auto drop mode
            dropButton.textContent = 'Stop'; // Change button text to indicate auto drop mode
        }
    } else {
        dropChip();
    }
});
});
