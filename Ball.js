class Ball {
    constructor(xPos, yPos, color){
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.speed = 5;
        this.width = 20;
        this.height = 20;
        this.radius = 10;
        this.direction = 0.5;
    }

    update() {
        this.move();
    }

    changeDirection() {
        console.log('change dir from', this.direction, 'to', -this.direction);
        this.direction = -this.direction;
        console.log();
    }

    move() {
        this.xPos += Math.cos(this.direction) * this.speed; // How far it moves in xDir
        this.yPos += Math.sin(this.direction) * this.speed; // How far it moves in yDir
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}