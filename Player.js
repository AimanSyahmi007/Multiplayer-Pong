module.exports = class Player {
    /**
     * Constructor
     * @param {WebSocket} socket Socket to player
     * @param {Number} x Position in x-axis
     * @param {Number} y Position in y-axis
     * @param {Number} color Color of player
     */
    constructor(socket, x, y, color) {
        this.socket = socket;
        this.x = x;
        this.y = y;
        this.ySpeed = 0;
        this.yMaxSpeed = 10;
        this.height = 100;
        this.width = 20;
        this.color = color;
    }

    init() {
        const self = this;
        this.socket.emit('gameStart');
        this.socket.on('move', function (up) {
            self.move(up); 
        });
    }

    /**
     * Slows down player
     */
    tick() {
        this.y += this.ySpeed;
        if (this.ySpeed > 0) this.ySpeed-=2;
        if (this.ySpeed < 0) this.ySpeed+=2;
    }

    /**
     * Move 
     */
    move(up) {
        if (Math.abs(this.ySpeed) < this.yMaxSpeed) {
            (up ? this.ySpeed-=2 : this.ySpeed+=2);
        }
    }
}