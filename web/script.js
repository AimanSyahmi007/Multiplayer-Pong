const canvas = document.getElementById('gameCanvas');
canvas.height = 600;
canvas.width = 600;
const ctx = canvas.getContext('2d');

const socket = io();

const socketCooldown = 1000/33;
const lastSendTime = 0;

const joinGameBtn = document.getElementById('joinGameBtn');
joinGameBtn.addEventListener('click', function (e) {
    socket.emit('joinGame');
});


// Listeners
document.body.addEventListener("keydown", function(ev){
    ev.preventDefault() // cancels default actions
    if (ev.key === 'ArrowUp') {
        if (Date.now() - socketCooldown > lastSendTime) {
            socket.emit('move', true);
        }
    } else if (ev.key === 'ArrowDown') {
        if (Date.now() - socketCooldown > lastSendTime) {
            socket.emit('move', false);
        }
    }
});

/**
 * New game data
 */
socket.on('tickData', function (data) {
    const gameData = JSON.parse(data);
    // console.log(gameData);
    renderGame(gameData);
});

/**
 * Render gameData to canvas
 */
function renderGame(gameData) {
    clearCanvas();

    // Ball
    ctx.beginPath();
    ctx.arc(gameData.ball.x, gameData.ball.y, gameData.ball.radius, Math.PI*2, false);
    ctx.fillStyle = gameData.ball.color;
    ctx.fill();
    ctx.closePath();

    // Player1
    ctx.fillStyle = gameData.player1.color;
    ctx.fillRect(gameData.player1.x, gameData.player1.y, gameData.player1.width, gameData.player1.height);
    // Player2
    ctx.fillStyle = gameData.player2.color;
    ctx.fillRect(gameData.player2.x, gameData.player2.y, gameData.player2.width, gameData.player2.height);

    if (gameData.winner) {
        console.log('====WINNER=====', gameData.winner);
    }
}

/**
 * Clear canvas
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// let game = new Game(canvas);