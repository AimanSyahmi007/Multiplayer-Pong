class Game {
    // Connect to server
    // 
    constructor(canvas) {
        console.log('New game');
        this.canvas = canvas;
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext("2d");
        this.objects = [];
        this.init();
        this.tick = 0;
        this.lastCollisionTick = 0;
        this.player1;
        this.player2;


        // Keypresses
        this.keyPressed = {};
    }

    /**
     * Initialize canvas
     */
    init() {
        const self = this;
        console.log('Init');
        // inti canvas
        // init eventlisteners
        this.player1 = new Player(540, 150, "red");
        this.player2 = new Player(60, 150, "blue");
        this.ball = new Ball(300, 200, "black");

        this.objects.push(this.player1, this.player2, this.ball);
        
        // Listeners
        document.body.addEventListener("keydown", function(ev){
            // do some stuff
            ev.preventDefault() // cancels default actions
            self.keyPressed[ev.key] = true;
            return false; // cancels this function only
        });
        document.body.addEventListener("keyup", function(ev){
            // do some stuff
            ev.preventDefault() // cancels default actions
            delete self.keyPressed[ev.key];
            return false; // cancels this function only
        });

        this.ticker();
    }

    /**
     * Ticker? game updater?
     */
    ticker() {
        const gameInterval = setInterval(() => {
            const winner = this.checkWinner();
            if (winner) {
                console.log("Winner:", winner);
                clearInterval(gameInterval);
            }
            if (this.tick > this.lastCollisionTick + 30) {
                let offset = this.playerCollision();
                if(offset) {
                    this.lastCollisionTick = this.tick;
                    this.ball.changeDirection(90*(1+offset/2));
                } else if (this.wallCollide()) {
                    console.log('collide');
                    this.ball.changeDirection(0);
                }
            }
            this.ball.move();

            if("ArrowUp" in this.keyPressed) {
                if(this.player1.yPos >= 0) {
                    this.player1.move(true);
                }
            }
            if("ArrowDown" in this.keyPressed) {
                if(this.player1.yPos <= this.canvas.height - this.player1.height){
                    this.player1.move(false);
                }
            }
            if("w" in this.keyPressed) {
                if(this.player2.yPos >= 0) {
                    this.player2.move(true);
                }
            }
            if("s" in this.keyPressed) {
                if(this.player2.yPos <= this.canvas.height - this.player2.height){
                    this.player2.move(false);
                }
            }

            this.render();
        }, 33);

    }

     /**
      * Render canvas
      */
    render() {
        this.clear();
        ++this.tick;
        // console.log('Render tick: ' + ++this.tick);
        this.objects.map(object => {
            object.render(this.ctx);
        });
    }

    /**
     * Clear screen
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Check if ball collide with top and bottom wall
     */
    wallCollide() {
        const ball = this.ball;
        // Top and bottom walls
        if (ball.yPos <= 0) return true;
        if (ball.yPos + ball.radius >= this.canvas.height) return true;
    }
    
    /**
     * Check if ball touches left or right wall
     * @return {Number} 0 for nobody, 1 for player1, 2 for player2
     */
    checkWinner() {
        if (this.ball.xPos <= 0) {
            return 1;
        } else if (this.ball.xPos + this.ball.radius >= this.canvas.width) {
            return 2;
        } else {
            return 0
        }
    }
    
    /**
     * Check if ball collides with players
     * @return {Boolean} true if collision, false if not
     */
    playerCollision() {
        // Players
        const ball = this.ball;
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].constructor !== ball.constructor) {
                const angle = this.rectCircleColliding(ball, this.objects[i]);
                if (angle) {
                    return angle;
                }
            }
        }

        return false;
    }

    // Check if circle collide with rectangle
    /**
     * Check if circle collide with rectangle
     * @return {Boolean} true if collision, false if not
     */
    rectCircleColliding(circle,rect){
        var distX = Math.abs(circle.xPos - rect.xPos-rect.width/2);
        var distY = Math.abs(circle.yPos - rect.yPos-rect.height/2);
    
        if (distX > (rect.width/2 + circle.radius)) { return false; }
        if (distY > (rect.height/2 + circle.radius)) { return false; }
    
        if (distX <= (rect.width/2)) { return this.playerHitOffsetFromCenter(circle, rect); } 
        if (distY <= (rect.height/2)) { return this.playerHitOffsetFromCenter(circle, rect); }
    
        var dx=distX-rect.width/2;
        var dy=distY-rect.height/2;
        if (dx*dx+dy*dy<=(circle.radius*circle.radius)) {
            return this.playerHitOffsetFromCenter(circle, rect);
        } else {
            return false;
        }
    }

    /**
     * Player hit offset
     * @return {Number} from 0.001 to 1.001
     */
    playerHitOffsetFromCenter(ball, rect) {
        return Math.abs((1 - (ball.yPos-rect.yPos) / (rect.height/2) ) + 0.001);
    }
}