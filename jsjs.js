const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;

const leftPaddle = {
    x: 0,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let balls = [];
const initialBallSpeed = 2;
const level2BallSpeed = 3;

let winnerHistory = [];

function createBall(speed) {
    return {
        x: Math.random() * (canvas.width - ballSize),
        y: Math.random() * (canvas.height - ballSize),
        size: ballSize,
        dx: speed * (Math.random() > 0.5 ? 1 : -1), // Randomize initial direction
        dy: speed * (Math.random() > 0.5 ? 1 : -1) // Randomize initial direction
    };
}

let player1Score = 0;
let player2Score = 0;

let gameRunning = false;
let animationFrameId;

let currentLevel = 1;
let player1Name = '';
let player2Name = '';

function drawPaddle(paddle) {
    context.fillStyle = '#000';
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    context.fillStyle = '#000';
    balls.forEach(ball => {
        context.fillRect(ball.x, ball.y, ball.size, ball.size);
    });
}

function movePaddle(paddle) {
    paddle.y += paddle.dy;

    if (paddle.y < 0) {
        paddle.y = 0;
    }

    if (paddle.y + paddle.height > canvas.height) {
        paddle.y = canvas.height - paddle.height;
    }
}

function moveBalls() {
    balls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collision (top/bottom)
        if (ball.y + ball.size > canvas.height || ball.y < 0) {
            ball.dy *= -1;
        }

        // Paddle collision
        if (ball.x < leftPaddle.x + leftPaddle.width &&
            ball.x + ball.size > leftPaddle.x &&
            ball.y < leftPaddle.y + leftPaddle.height &&
            ball.y + ball.size > leftPaddle.y) {
            ball.dx *= -1;
        }

        if (ball.x < rightPaddle.x + rightPaddle.width &&
            ball.x + ball.size > rightPaddle.x &&
            ball.y < rightPaddle.y + rightPaddle.height &&
            ball.y + ball.size > rightPaddle.y) {
            ball.dx *= -1;
        }

        // Scoring
        if (ball.x + ball.size > canvas.width) {
            player1Score++;
            checkGameOver(player1Name);
            resetGame();
        }

        if (ball.x < 0) {
            player2Score++;
            checkGameOver(player2Name);
            resetGame();
        }
    });
}

function resetGame() {
    balls = [];
    let speed = currentLevel === 1 ? initialBallSpeed : level2BallSpeed;
    balls.push(createBall(speed));

    document.getElementById('player1Score').textContent = player1Score;
    document.getElementById('player2Score').textContent = player2Score;
}

function checkGameOver(winner) {
    const winScore = currentLevel === 1 ? 5 : 10;
    if (player1Score >= winScore || player2Score >= winScore) {
        document.getElementById('winnerMessage').textContent = `Tahniah, ${winner}! wins Level ${currentLevel}!`;
        document.getElementById('winnerOverlay').style.display = 'flex';
        winnerHistory.push(`${winner} (Level ${currentLevel})`);
        updateWinnerHistory();
        stopGameLoop();

        if (currentLevel === 1) {
            document.getElementById('continueOverlayButton').style.display = 'block';
        }
    }
}

function updateWinnerHistory() {
    const winnerList = document.getElementById('winnerList');
    winnerList.innerHTML = '';
    winnerHistory.forEach(winner => {
        const li = document.createElement('li');
        li.textContent = winner;
        winnerList.appendChild(li);
    });
}

function update() {
    movePaddle(leftPaddle);
    movePaddle(rightPaddle);
    moveBalls();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
}

function gameLoop() {
    update();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function stopGameLoop() {
    cancelAnimationFrame(animationFrameId);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            leftPaddle.dy = -3;
            break;
        case 'ArrowDown':
            leftPaddle.dy = 3;
            break;
        case 'w':
            rightPaddle.dy = -3;
            break;
        case 's':
            rightPaddle.dy = 3;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            leftPaddle.dy = 0;
            break;
        case 'w':
        case 's':
            rightPaddle.dy = 0;
            break;
    }
});

document.getElementById('startButton').addEventListener('click', () => {
    player1Name = document.getElementById('player1Name').value || 'Player 1';
    player2Name = document.getElementById('player2Name').value || 'Player 2';
    document.getElementById('nameInput').style.display = 'none';
    document.getElementById('pongCanvas').style.display = 'block';
    document.querySelector('.controls').style.display = 'block';
    document.querySelector('.score').style.display = 'block';
    document.getElementById('displayPlayer1Name').textContent = player1Name;
    document.getElementById('displayPlayer2Name').textContent = player2Name;
    gameRunning = true;
    resetGame();
    gameLoop();
});

document.getElementById('restartButton').addEventListener('click', () => {
    location.reload();
});

document.getElementById('continueButton').addEventListener('click', () => {
    currentLevel = 2;
    balls = [createBall(level2BallSpeed)]; // Ensure only 1 ball in Level 2
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('continueButton').style.display = 'none';
    player1Score = 0;
    player2Score = 0;
    resetGame();
    document.getElementById('winnerOverlay').style.display = 'none';
    gameRunning = true;
    gameLoop();
});

document.getElementById('restartOverlayButton').addEventListener('click', () => {
    location.reload();
});

document.getElementById('continueOverlayButton').addEventListener('click', () => {
    currentLevel = 2;
    balls = [createBall(level2BallSpeed)]; // Ensure only 1 ball in Level 2
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('continueButton').style.display = 'none';
    player1Score = 0;
    player2Score = 0;
    resetGame();
    document.getElementById('winnerOverlay').style.display = 'none';
    gameRunning = true;
    gameLoop();
});

// Initialize the winner history on page load
updateWinnerHistory();
