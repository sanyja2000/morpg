var snowflakesImg = new Image();
snowflakesImg.src = "img/snowflakes.png";

var snowflakeParticles = [];
function generateSnowflakes(){
    for(var i=0;i<40;i++){
        var size = parseInt(Math.log2(1+Math.random()*15));
        snowflakeParticles.push([Math.random()*(WIDTH-32),-40-Math.random()*(HEIGHT),size]);
    }
}
function snowflakeAnimation(){
    for(var i=0;i<snowflakeParticles.length;i++){
        ctx.drawImage(snowflakesImg,snowflakeParticles[i][2]*32,0,32,32,snowflakeParticles[i][0]+Math.sin(snowflakeParticles[i][0]+snowflakeParticles[i][1]/20)*30,snowflakeParticles[i][1],32,32);
        snowflakeParticles[i][1]+=0.5+snowflakeParticles[i][2]*0.25-moveDirection[1]*moveSpeed[1]/8;
        if(snowflakeParticles[i][1]>HEIGHT){
            snowflakeParticles[i][0] = Math.random()*(WIDTH-32);
            snowflakeParticles[i][1] = -50;
        }
    }
}