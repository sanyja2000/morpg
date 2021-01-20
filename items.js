// Active items:
// Taunt
// Whirlwind, armor up, speed burst, attack damage boost
// Multiple shots, piercing arrow
// Shockwave blast
// Healing shots, 

//Spells upgrade after certain number of uses

//Picking up items creates name particle effect 

//const monster = require("./monster");


//Killing monsters gives resources and money -> money to enchant weapons, to upgrade and learn skills
//Skill requires its specific weapon






function updateCooldowns(player){
    //Updates item cooldowns in player inventory
    //Gets updated 10fps

    var inventory = player.inventory;
    for(var i=0;i<inventory.length;i++){
        if(inventory[i]==null){continue;}
        if(inventory[i].hasOwnProperty("cooldown")){
            if(inventory[i].cooldown > 0){
                inventory[i].cooldown -= 0.1;
            }
        }
    }
}



function useAbilityItem(item,player,monsters,players,io){
  if(item.name=="taunt"){
    for(var i=0;i<monsters.length;i++){
      if((player.x-monsters[i].x)**2+(player.y-monsters[i].y)**2<150000){
        monsters[i].target = player;
        io.to(player.id).emit("damageParticle",{damage:"taunted",type:"physical",as:"attacker",at:[monsters[i].x,monsters[i].y]});
      }
    }
    return true;
  }
  if(item.name=="whirlwind"){
    player.abilityAnimationFrame=0;
    player.abilityAnimationImg = "character_whirlwind.png";
    io.to(player.id).emit("sounds",{file:"sound/character_whirlwind.wav"});
    for(var i=0;i<monsters.length;i++){
      if (player.x -20 < monsters[i].x + monsters[i].w &&
        player.x - 20 + 79 > monsters[i].x &&
        player.y -20 < monsters[i].y + monsters[i].h &&
        player.y -20 + 77 > monsters[i].y) {
          io.to(player.id).emit("damageParticle",{damage:20,type:"physical",as:"attacker",at:[monsters[i].x,monsters[i].y]});
          monsters[i].health-=20;
      }
    }
    for(var i=0;i<players.length;i++){
      if(players[i].id==player.id){continue;}
      if (player.x -20 < players[i].x + 39 &&
        player.x -20 + 79 > players[i].x &&
        player.y -20< players[i].y + 37 &&
        player.y  -20+ 77 > players[i].y) {
          if(players[i].health>0){
            players[i].health-=20;
          }
          io.to(player.id).emit("damageParticle",{damage:20,type:"physical",as:"attacker",at:[players[i].x,players[i].y]});
          io.to(players[i].id).emit("damageParticle",{damage:20,type:"physical",as:"victim",at:[players[i].x,players[i].y]});
        }
    }
    return true;
  }
  

}



function refreshBaseStats(player,io){
    //Handles health regen, poison, buffs, debuffs
    //Gets updated 10fps

    var hp = player.baseHealth;
    var healthRegen = 0;
    var moveSpeed = 0;
    for(var i=0;i<player.equipment.length;i++){
      if(player.equipment[i]!=null){
        if(player.equipment[i].hasOwnProperty("health")){
          hp+=player.equipment[i].health;
        }
        if(player.equipment[i].hasOwnProperty("healthRegen") && player.poisoned == 0){
          healthRegen+=player.equipment[i].healthRegen;
        }
        if(player.equipment[i].hasOwnProperty("moveSpeed")){
          moveSpeed+=player.equipment[i].moveSpeed;
        }
      }
    }
  
    if(player.poisoned>0){
      player.poisoned--;
      player.health-=player.poisonDmg;
      io.to(player.id).emit("damageParticle",{damage:player.poisonDmg,type:"poison",as:"victim"});
    }
  
    //Apply buffs/debuffs
  
    if(player.abilityAnimationFrame!=-1){
      if(player.abilityAnimationFrame>=5){
        player.abilityAnimationFrame = -1;
      }else{
        player.abilityAnimationFrame++;
      }
    }

    for(var i=0;i<player.buffs.length;i++){
      if(player.buffs[i].lifespan<=0){
        player.buffs.splice(i,1);
        i--;
        continue;
      }
      if(player.buffs[i].attribute == "health"){
        hp+=player.buffs[i].value;
      }
      if(player.buffs[i].attribute == "moveSpeed"){
        moveSpeed+=player.buffs[i].value;
      }
      player.buffs[i].lifespan--;
    }  
  
    player.moveSpeed = [3+moveSpeed,3+moveSpeed];
  
    player.maxHealth = hp;
    if(player.health+healthRegen>=player.maxHealth){
      player.health=player.maxHealth 
    }
    else{
      player.health+=healthRegen;
    }
  
  
}

module.exports = {
    updateCooldowns,
    refreshBaseStats,
    useAbilityItem
};