function DebugScreen(){
    this.visible = false;
    this.FPS = 60;
    this.startTime = 0;
    this.endTime = 0;
    this.deltaTime = 0;
    this.frames = 0;
    this.frameTime = 0;
    this.FPSlock = 60;
    this.ping = 0;
    this.draw = function(ctx){
        ctx.save();
        ctx.textAlign = "left";
        ctx.fillStyle = "white";
        ctx.font = "9px Arial";
        ctx.fillText("FPS target: "+this.FPS,5,10);
        ctx.fillText("Render time: "+this.renderTime,5,20);
        ctx.fillText("Frametime: "+this.frameTime,5,30);
        ctx.fillText("Ping: "+this.ping,5,40);
        ctx.restore();
    }
    this.startFrame = function(){
        var temp = this.startTime;
        this.startTime = Date.now();
        this.frameTime = this.startTime - temp + " ms";
    }
    this.changeFrameRate = function(fps){
        this.FPSlock = fps;
        this.FPS = this.FPSlock;
        clearInterval(gameloop);
        gameloop = setInterval(update, 1000/this.FPSlock);
    }

    this.endFrame = function(){
        this.endTime = Date.now();
        /*this.deltaTime += this.endTime-this.startTime;
        this.frames++;
        if(this.deltaTime>1000){
            this.FPS = this.frames;//*(this.endTime-this.startTime)/1000;
            this.frames=0;
            this.deltaTime=0;

        }
        */
       this.renderTime = this.endTime-this.startTime+" ms";
        
    }

}

var debugScreen = new DebugScreen();