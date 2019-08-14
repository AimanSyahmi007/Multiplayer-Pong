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
        this.player1 = new Player(500, 150, "red");
        this.player2 = new Player(100, 150, "blue");
        this.ball = new Ball(300, 200, "black");

        this.objects.push(this.player1);
        this.objects.push(this.player2);
        this.objects.push(this.ball);
        
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
        setInterval(() => {
            if (this.tick > this.lastCollisionTick + 15) {
                if(this.ballCollision()) {
                    this.lastCollisionTick = this.tick;
                    console.log('collide');
                    this.ball.changeDirection();
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
     * Check if ball collides
     */
    ballCollision() {
        const ball = this.ball;
        // Top and bottom walls
        if (ball.yPos <= 0) return true;
        if (ball.yPos + ball.height >= this.canvas.height) return true;

        // Players
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].constructor !== ball.constructor) {
                let object = this.objects[i];

                // Top left corner
                if(
                    ball.xPos >= object.xPos
                    && ball.xPos <= object.xPos+object.width
                    && ball.yPos >= object.yPos
                    && ball.yPos <= object.yPos+object.height
                ) return true;
                // Bottom left corner
                if(
                    ball.xPos >= object.xPos
                    && ball.xPos <= object.xPos+object.width
                    && ball.yPos+ball.height >= object.yPos
                    && ball.yPos+ball.height <= object.yPos+object.height
                ) return true;
                // Bottom right corner
                if(
                    ball.xPos+ball.width >= object.xPos
                    && ball.xPos+ball.width <= object.xPos+object.width
                    && ball.yPos+ball.height >= object.yPos
                    && ball.yPos+ball.height <= object.yPos+object.height
                ) return true;
                // Top right corner
                if(
                    ball.xPos+ball.width >= object.xPos
                    && ball.xPos+ball.width <= object.xPos+object.width
                    && ball.yPos >= object.yPos
                    && ball.yPos <= object.yPos+object.height
                ) return true;
            }
        }

        return false;
    }
}