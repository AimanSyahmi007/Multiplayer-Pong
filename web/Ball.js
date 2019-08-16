class Ball {
    constructor(xPos, yPos, color){
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.speed = 5;
        this.radius = 10;
        this.direction = 1; // degrees
    }

    update() {
        this.move();
    }

    changeDirection(surfaceAngle) {
        this.direction = this.angleReflect(this.direction, surfaceAngle) + Math.random()*10;
    }

    move() {
        this.xPos += Math.cos(this.degreesToRadians(this.direction)) * this.speed; // How far it moves in xDir
        this.yPos += Math.sin(this.degreesToRadians(this.direction)) * this.speed; // How far it moves in yDir
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    angleReflect(incidenceAngle, surfaceAngle){
        var a = surfaceAngle * 2 - incidenceAngle;
        return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
    }

    degreesToRadians(angle){
        return angle / 180 * Math.PI;
    }
}