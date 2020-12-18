


function monsterAttack(monster,projectilesArr,io,map){
    if(monster.type == "ghost"){
        //Basic melee enemy
        monster.target.health-=monster.attackDmg;
        io.to(monster.target.id).emit("damageParticles",{as:"victim",type:"physical"});
        io.to(monster.target.id).emit("sounds",{sound:"hurt"});
            
        console.log("Attacking as ghost");
    }
    if(monster.type == "shooter"){
        //Multiple phase enemy
        if(monster.phase == 0){
            var angle = 0;// Math.atan2(monster.target.x-13-monster.x+monster.w/2,monster.y+monster.h/2-monster.target.y-25)-Math.PI/2;
            var projectileSpeed = 8;
            for(var i=0;i<8;i++){
                if(Math.random()<0.05){
                    projectilesArr.push({color:0,x:monster.x+monster.w/2,y:monster.y+monster.h/2,vX:Math.cos(angle)*projectileSpeed,vY:Math.sin(angle)*projectileSpeed,lifespan:60,physicalDmg:monster.target.health});
                }
                else{
                    projectilesArr.push({color:4,x:monster.x+monster.w/2,y:monster.y+monster.h/2,vX:Math.cos(angle)*projectileSpeed,vY:Math.sin(angle)*projectileSpeed,lifespan:60,physicalDmg:45});
                }
                angle+=Math.PI*2/8;
            }
            io.to(monster.target.id).emit("sounds",{file:"sound/ES_Ghost Cry.mp3"});
            if(monster.health<=50){
                monster.phase = 1;
                monster.attackSpeed = 1.2;
                monster.moveSpeed = 1.8;
                monster.health = 200;
                monster.maxHealth = 200;
                monster.bulletDir = 0;
            }
        }else{

            var angle = monster.bulletDir;// Math.atan2(monster.target.x-13-monster.x+monster.w/2,monster.y+monster.h/2-monster.target.y-25)-Math.PI/2;
            var projectileSpeed = 4.5;
            for(var i=0;i<16;i++){
                projectilesArr.push({color:4,x:monster.x+monster.w/2,y:monster.y+monster.h/2,vX:Math.cos(angle)*projectileSpeed,vY:Math.sin(angle)*projectileSpeed,lifespan:60,physicalDmg:25});
                angle+=Math.PI*2/20;
            }
            monster.bulletDir += Math.PI*2/5;
        }

    }
}


function monsterWonder(monster){
    if(parseInt(monster.x)!=monster.points[monster.pointCount][0] || parseInt(monster.y)!=monster.points[monster.pointCount][1]){
        var angle = Math.atan2(monster.y-monster.points[monster.pointCount][1],monster.x-monster.points[monster.pointCount][0]);
        var vx = Math.cos(angle)*Math.min(monster.moveSpeed,Math.abs(monster.x-monster.points[monster.pointCount][0]));
        monster.x -= vx;
        monster.y -= Math.sin(angle)*Math.min(monster.moveSpeed,Math.abs(monster.y-monster.points[monster.pointCount][1]));
        if(vx<0.2){
            monster.facing = 0;
        }else{
            monster.facing = 1;
        }
    }else{
        monster.pointCount=(monster.pointCount+1)%monster.points.length;
    }
}


module.exports = {
    monsterAttack,
    monsterWonder
};