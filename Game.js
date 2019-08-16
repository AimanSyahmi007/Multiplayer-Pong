const Player = require('./Player');
const Ball = require('./Ball');

module.exports = class Game {
    constructor(id) {
        this.id = id;
        // Maybe implement game rooms

        this.height = 600;
        this.width = 600;

        this.tick = 0;
        this.ticksPerSecond = 30; 
        this.player1;
        this.player2;
        this.winner = 0;

        this.gameTickerInterval;

        this.ball = new Ball(this.height/2, this.width/2, 20, 'red');
        console.log('New game', this.id);
    }

    /**
     * Add a player to game
     * @param {WebSocket} socket Socket to player
     */
    addPlayer(socket) {
        if (!this.player1) {
            this.player1 = new Player(socket, 50, this.height/2, 'blue');
        } else if (!this.player2) {
            this.player2 = new Player(socket, this.width-50, this.height/2, 'blue');
            this.start();
        } else {
            throw new Error('Game is full');
        }
    }

    /**
     * Start game, starting listeners and ticker
     */
    start() {
        console.log('Start game', this.id);
        let self = this; // setInterval makes new 'this'
        this.player1.init();
        this.player2.init();
        this.emitData();
        this.gameTickerInterval = setInterval(function() {
            self.tickFunction();
        }, 1000/this.ticksPerSecond);
    }
    
    /**
     * Run every tick of the game 30 ticks/second
     */
    tickFunction() {
        const winner = this.checkWinner();
        if (winner) {
            console.log('Got winner', winner);
            clearInterval(this.gameTickerInterval);
            this.emitData();
        } else {
            this.checkCollision();
            this.ball.tick();
            this.player1.tick();
            this.player2.tick();
            this.emitData();
            this.tick++;
        }
    }

    /**
     * Check if collision
     * @returns {number} 1 Collide with wall, ball ySpeed inverse
     * @returns {number} 2 Collide with player, ball xSpeed inverse
     */
    checkCollision() {
        if (this.ball.y-this.ball.radius <= 0 || this.ball.y+this.ball.radius >= this.height) {
            console.log('Collide');
            this.ball.changeDir(true);
        } 

        if(this.checkCircleRectCollision(this.ball, this.player1) || this.checkCircleRectCollision(this.ball, this.player2)) {
            console.log('Collide');
            this.ball.changeDir(false);
        }
    }

    /**
     * Check if circle collide with rect
     * @param {Object} circle Ball in this game
     * @param {Object} rect Player in this game
     */
    checkCircleRectCollision(circle, rect) {
        var distX = Math.abs(circle.x - rect.x-rect.width/2);
        var distY = Math.abs(circle.y - rect.y-rect.height/2);
    
        if (distX > (rect.width/2 + circle.radius)) { return false; }
        if (distY > (rect.height/2 + circle.radius)) { return false; }
    
        if (distX <= (rect.width/2)) { return true } 
        if (distY <= (rect.height/2)) { return true }
    
        var dx=distX-rect.width/2;
        var dy=distY-rect.height/2;
        if (dx*dx+dy*dy<=(circle.radius*circle.radius)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Check if someone won -> ball touches left or right wall
     * @return {Number} 0 for nobody, 1 for player1, 2 for player2
     */
    checkWinner() {
        if (this.ball.x-this.ball.radius <= 0) {
            this.winner = 2;
            return 2;
        } else if (this.ball.x + this.ball.radius >= this.width) {
            this.winner = 1;
            return 1;
        } else {
            return 0
        }
    }

    /**
     * Emit game data
     */
    emitData() {
        let data = this.serializeData();
        this.player1.socket.emit('tickData', data);
        this.player2.socket.emit('tickData', data);
    }

    /**
     * Serialize data
     * @returns {Object} Stringified JSON object of positions of players and ball
     */
    serializeData() {
        let data = {
            id: this.id,
            tick: this.tick,
            winner: this.winner,
            ball: {
                x: this.ball.x,
                y: this.ball.y,
                radius: this.ball.radius,
                xSpeed: this.ball.xSpeed,
                ySpeed: this.ball.ySpeed,
                color: this.ball.color
            },
            player1: {
                x: this.player1.x,
                y: this.player1.y,
                id: this.player1.socket.id,
                color: this.player1.color,
                width: this.player1.width,
                height: this.player1.height
            },
            player2: {
                x: this.player2.x,
                y: this.player2.y,
                id: this.player2.socket.id,
                color: this.player2.color,
                width: this.player2.width,
                height: this.player2.height
            }
        };

        return JSON.stringify(data);
    }
}