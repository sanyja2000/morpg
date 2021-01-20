function LightSystem(){
    this.daytime = 0.8;
    this.composit = true;
    this.flicker = 0;
    this.lights = [[365, 140],[655,365],[623,653],[174, 334]];
    this.draw = function(ctx){
        //Draw dark
    
        ctx.save();
    
        if(this.composit){
            ctx.globalCompositeOperation = 'multiply';
        }
        ctx.fillStyle = 'rgba(7, 11, 52,'+this.daytime+')';
        //ctx.fillStyle = 'rgba(0, 0, 0,'+this.daytime+')';
        ctx.fillRect(0,0,WIDTH,HEIGHT);
        
        if(this.daytime<0.5){ctx.restore();return;}
        
        
        ctx.globalCompositeOperation = 'lighter';
        
    
        for(var i=0;i<this.lights.length;i++){
    
            ctx.beginPath();
            var gradient = ctx.createRadialGradient(this.lights[i][0]-viewportX,this.lights[i][1]-viewportY, 0, this.lights[i][0]-viewportX,this.lights[i][1]-viewportY, 150+Math.random()*3);
    
            gradient.addColorStop(0, 'rgba(255, 223, 110,0.8)');
            gradient.addColorStop(0.3, 'rgba(255, 223, 110,0.5)');
            //gradient.addColorStop(0.35, 'rgba(255,255,0,0.1)');
            gradient.addColorStop(1, 'rgba(255, 223, 110,0)');
            
    
            ctx.fillStyle = gradient;
            ctx.arc(this.lights[i][0]-viewportX,this.lights[i][1]-viewportY,150,0,Math.PI*2);
            ctx.fill();
            
            ctx.closePath();
        }

        if(pInventory.equipment[0]!=null && pInventory.equipment[0].name == "torch"){
            var x = playerX-viewportX+12;
            var y = playerY-viewportY+15;

            ctx.beginPath();
            var gradient = ctx.createRadialGradient(x,y, 0, x,y, 100+Math.random()*3);

            gradient.addColorStop(0, 'rgba(255, 230, 40,0.6)');
            //gradient.addColorStop(0.35, 'rgba(255,255,0,0.1)');
            gradient.addColorStop(1, 'rgba(255, 230, 40,0)');
            

            ctx.fillStyle = gradient;
            ctx.arc(x,y,100,0,Math.PI*2);
            ctx.fill();
            
            ctx.closePath();
        }

        for(var i=0;i<players.length;i++){
            if(players[i].id == socket.id){
                continue;
            }
            if(players[i].equipment[0]!=null && players[i].equipment[0].name == "torch"){
                var x = players[i].x-viewportX+12;
                var y = players[i].y-viewportY+15;
    
                ctx.beginPath();
                var gradient = ctx.createRadialGradient(x,y, 0, x,y, 100+Math.random()*3);
    
                gradient.addColorStop(0, 'rgba(255, 230, 40,0.6)');
                //gradient.addColorStop(0.35, 'rgba(255,255,0,0.1)');
                gradient.addColorStop(1, 'rgba(255, 230, 40,0)');
                
    
                ctx.fillStyle = gradient;
                ctx.arc(x,y,100,0,Math.PI*2);
                ctx.fill();
                
                ctx.closePath();
            }
        }
        ctx.restore();
        
    }
}

var lightSystem = new LightSystem();
