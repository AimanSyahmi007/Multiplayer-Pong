class Player {
    /**
     * Construct a new player
     * @param {number} xPos
     * @param {number} yPos
     * @param {string} color
     */
    constructor(xPos, yPos, color,) {
        this.score = 0;
        this.xPos = xPos;
        this.yPos = yPos;
        this.speed = 5;
        this.width = 50;
        this.height = 100;
        this.color = color;
    }


    /**
     * Move player
     * @param {Boolean} up True if up, false if down
     */
    move(up) {
        if (up) {
            this.yPos -= this.speed;
        } else {
            this.yPos += this.speed;
        }
    }

    /**
     * Reset player to startPos
     */
    reset() {

    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    }
}