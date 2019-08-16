module.exports = class Ball {
    /**
     * Constructor
     * @param {Number} x Position in x-axis
     * @param {Number} y Position in y-axis
     * @param {Number} radius Radius of ball
     * @param {Number} color Color of ball
     */
    constructor(x, y, radius, color) {
        this.xSpeed = 2;
        this.ySpeed = 2;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    /**
     * Run at every tick, update position
     */
    tick() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    /**
     * Change direction of ball
     * @param {Boolean} horizontal True if hit wall, xSpeed inverse if not ySpeed inverse
     */
    changeDir(horizontal) {
        if (horizontal) {
            console.log(this.ySpeed, -this.ySpeed);
            this.ySpeed = -this.ySpeed;
        } else {
            console.log(this.xSpeed, -this.xSpeed);
            this.xSpeed = -this.xSpeed;
        }
    }
}