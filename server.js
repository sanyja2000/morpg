var express = require('express');
var app = express();
var http = require('http').createServer(app);

var monsterClass = require("./monster");

var itemIds = 0;


var maps = [{id:0,name:"Magington city",file:"map1.tmx",tpPoints:[
  {x:60,y:730,name:"Sail to the underworld",toMap:1, loadScreenImage:"underworld_load.png",mapName:"The Underworld",spawnX:130,spawnY:130},
  {x:713,y:780,name:"Go into your house",loadScreenImage:"magington_load.png",mapName:"Your House",toMap:2,spawnX:320,spawnY:550}]  },

  {id:1,name:"Underworld",file:"underworld.tmx",tpPoints:[{x:65,y:63,name:"Awake in the real world", toMap:0, loadScreenImage:"magington_load.png",mapName:"Magington City",spawnX:130,spawnY:130},
  {x:1070,y:160,name:"Enter the scary dungeon", toMap:3, loadScreenImage:"underworld_load.png",mapName:"Scary dungeon",spawnX:96,spawnY:192}]},

  {id:2,name:"Your house",file:"house1.tmx",tpPoints:[{x:320,y:560,name:"Go outside", toMap:0, loadScreenImage:"magington_load.png",mapName:"Magington City",spawnX:710,spawnY:786}]},

  {id:3,name:"Scary dungeon",file:"dungeon1.tmx",tpPoints:[{x:1455,y:730,name:"Escape",toMap:1,loadScreenImage:"underworld_load.png",mapName:"The Underworld",spawnX:1792,spawnY:109}]}
]; //Storage for EVERYTHING


for(var i=0;i<maps.length;i++){
  //initalize default map lists
  maps[i].NPCs = [];
  maps[i].NPCsClientSide = [];
  maps[i].monsters = [];
  maps[i].projectiles = [];
  maps[i].players = [];
  maps[i].droppedItems = [];
  maps[i].doors = [];
  maps[i].chests = [];
}

maps[0].NPCs = [
  {id:0,name:"Orvald",quests:[0,2,4]},
  {id:1,name:"Sarah",quests:[3],questInteractions:[{questId:2,text:["Hmmm well hello there","I'm Sarah, the fruiterer.","I run this small little shop.","Orvald sent you, right?","I always send him 4 apples.","But now that you are so nice","I'm giving you 3 more.","","Come back if you have some free time.","Bye!"],items:[{name:"apple",pieces:7,equipment:false,iconNumber:33}],itemsGivenToPlayers:[]}]},
  {id:2,name:"John",quests:[]},
  {id:3,name:"Edward",questInteractions:[{questId:3,text:["Ohh hi there my friend","Did my lovely Sarah send you?","I see","She was right, the housekey is here","Give it to her, will you?"],items:[{name:"house key",pieces:1,equipment:false,iconNumber:70}],itemsGivenToPlayers:[]}],quests:[1]},
  {id:4,name:"Santa Claus",questInteractions:[],quests:[5]}

];
maps[0].NPCsClientSide = [
  {id:0,name:"Orvald",x:718,y:500,skin:0}, {id:1,name:"Sarah",x:996,y:706,skin:2}, {id:2,name:"John",x:3088, y:1988,skin:3}, {id:3,name:"Edward",x:3158,y:397,skin:4}, {id:4,name:"Santa Claus",x:1524,y:426,skin:6}
];
maps[1].NPCs = [{id:4,name:"Reaper",quests:[5],questInteractions:[{questId:4,text:["Well, well, well","Who do we got here?","Did Orvald send you?","That little smug..","He probably needs skulls again","Here, give him some","These are fresh harvest"],items:[{name:"skull",pieces:3,equipment:false,iconNumber:195}],itemsGivenToPlayers:[]}]},
];
maps[1].NPCsClientSide = [{id:4,name:"Reaper",x:646,y:980,skin:5}];

maps[0].chests = [{id:0, x:100, y:100, imageIndex:0, isOpen:false, key:{name:"key",pieces:1,equipment:false,iconNumber:70}, loot:[] }];

maps[3].doors = [{id:0, x:1024 ,y:544 ,imageIndex:0, isOpen:false, key:{name:"key",pieces:1,equipment:false,iconNumber:70}}];

maps[3].monsters = [
  {id:0, name:"Scary ghost",type:"ghost",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:1600,image:"img/ghost.png",w:45,h:50,frames:6,x:288, y:352,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"key",pieces:1,iconNumber:70,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:1, name:"Scary ghost",type:"ghost",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:1600,image:"img/ghost.png",w:45,h:50,frames:6,x:192, y:704,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"another key",pieces:1,iconNumber:71,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:2, name:"Scary ghost",type:"ghost",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:1600,image:"img/ghost.png",w:45,h:50,frames:6,x:640, y:736,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"skey",pieces:1,iconNumber:70,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:3, name:"Scary ghost",type:"ghost",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:1600,image:"img/ghost.png",w:45,h:50,frames:6,x:768, y:512,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"skey",pieces:1,iconNumber:70,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:4, name:"Scary ghost",type:"ghost",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:1600,image:"img/ghost.png",w:45,h:50,frames:6,x:608, y:288,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"skey",pieces:1,iconNumber:70,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:5, name:"Scary ghost",type:"ghost",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:1600,image:"img/ghost.png",w:45,h:50,frames:6,x:1216, y:160,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"skey",pieces:1,iconNumber:70,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:6, name:"Scary ghost",type:"ghost",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:1600,image:"img/ghost.png",w:45,h:50,frames:6,x:1248, y:416,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"skey",pieces:1,iconNumber:70,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100}
];

maps[0].monsters = [
  {id:0, name:"Ivern",type:"ghost",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:5000,image:"img/pumpkivern.png",w:30,h:60,frames:10,x:1400, y:1000,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"pumpkin",pieces:1,iconNumber:19,equipment:false}],target:null,attackDmg:20,health:200,maxHealth:200}

];
maps[1].monsters = [
  {id:0, name:"Scary ghost",type:"shooter",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:40000,image:"img/ghost.png",w:45,h:50,frames:6,x:1400, y:1000,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"ghasttear",pieces:1,iconNumber:35,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:1, name:"Scary ghost",type:"shooter",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:40000,image:"img/ghost.png",w:45,h:50,frames:6,x:1600, y:1100,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"ghasttear",pieces:2,iconNumber:35,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:2, name:"Scary ghost",type:"shooter",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:40000,image:"img/ghost.png",w:45,h:50,frames:6,x:1550, y:950,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"ghasttear",pieces:3,iconNumber:35,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:3, name:"Scary ghost",type:"shooter",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:40000,image:"img/ghost.png",w:45,h:50,frames:6,x:1300, y:1350,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"ghasttear",pieces:2,iconNumber:35,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
  {id:4, name:"Scary ghost",type:"shooter",phase:0,facing:1,detectRange:40000,abandonRange:160000,attackRange:40000,image:"img/ghost.png",w:45,h:50,frames:6,x:1350, y:900,moveSpeed:1.6,attackSpeed:0.6,loot:[{id:itemIds++,name:"ghasttear",pieces:4,iconNumber:35,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100},
];

for(var i=0;i<maps.length;i++){
  for(var j=0;j<maps[i].monsters.length;j++){
    maps[i].monsters[j].points = [[maps[i].monsters[j].x,maps[i].monsters[j].y],[maps[i].monsters[j].x+200,maps[i].monsters[j].y],[maps[i].monsters[j].x+100,maps[i].monsters[j].y+100]];
    maps[i].monsters[j].pointCount = 1;
  }
}

// TODO create basic 1-2 man test dungeon on map + enemies
// TODO add loot chests to maps <-----
// TODO reset dungeons if everyone escapes?
//  TODO add blinking
// TODO add chat?

maps[0].droppedItems = [
/*
{id:itemIds++,x:544,y:566,equipment:false,iconNumber:163,name:"log",pieces:1},
{id:itemIds++,x:394,y:488,equipment:false,iconNumber:163,name:"log",pieces:1},*/
{id:itemIds++,x:1887,y:106,equipment:true,iconNumber:65,poisonous:true,slotNumber:0,physicalDmg:40,description:["Poisonous","Physical dmg 40"],name:"poisoned blade",pieces:1},
{id:itemIds++,x:1887,y:136,equipment:true,iconNumber:80,lifeSteal:0.1,slotNumber:0,physicalDmg:20,description:["Lifesteal","Physical dmg 20"],name:"bloody blade",pieces:1},
{id:itemIds++,x:1174,y:64,equipment:true,iconNumber:10,slotNumber:3,description:["Move Speed +20"],moveSpeed:20,name:"gotta go fast",pieces:2}

];

var quests = [
  {id:0,name:"Welcome to the island",
  allowQuests:[2],
  requirements:[{name:"log",pieces:3,equipment:false,iconNumber:163}],
  startItems:[],rewards:[{ name:"shallow sword",description:["Physical damage 10"], physicalDmg:10,slotNumber:0, pieces:1, equipment:true, iconNumber:16}]},
  
  
  {id:1,name:"Flowers for my mom",
  allowQuests:[],
  requirements:[{name:"flower",pieces:5,equipment:false,iconNumber:20}],
  startItems:[],rewards:[{name:"penny",id:itemIds++,pieces:30,equipment:false,iconNumber:229}]},

  {id:2,name:"Let's get apples",
  allowQuests:[3],requirements:[{name:"apple",pieces:4,equipment:false,iconNumber:33}],
  startItems:[],rewards:[{name:"penny",id:itemIds++,pieces:50,equipment:false,iconNumber:229}]},

  {id:3,name:"To my grandpa",
  allowQuests:[4,1],requirements:[{name:"house key",pieces:1,equipment:false,iconNumber:70}],
  startItems:[],rewards:[{name:"my heart",id:itemIds++,pieces:1,equipment:false,iconNumber:42,slotNumber:1,healthRegen:20,description:["health reg +20","","Sarah <3"]}] },

  {id:4,name:"Hellish favor",
  allowQuests:[],requirements:[{name:"skull",pieces:3,equipment:false,iconNumber:195}],
  startItems:[],rewards:[{name:"health potion",id:itemIds++,pieces:2,equipment:false,iconNumber:164}]},
  
  {id:5,name:"Here, gems!",
  allowQuests:[6],requirements:[],
  startItems:[],rewards:[{name:"gem",id:itemIds++,pieces:2,equipment:false,iconNumber:209},{name:"sword enchant",id:itemIds++,equipment:true,iconNumber:204,description:["LifeSteal +20%","physicdmg +20"],lifeSteal:0.2,physicalDmg:20}]},

  {id:6,name:"EVEN MORE gems!",
  allowQuests:[7],requirements:[],
  startItems:[],rewards:[{name:"gem",id:itemIds++,pieces:4,equipment:false,iconNumber:209}]}
];



/*
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});
*/
app.use(express.static('public'));

var server = http.listen(80, () => {
  console.log('listening on *:80');
});

var socket = require('socket.io');

var io = socket(server);

io.sockets.on("connection",newConnection);

function seePlayers() {
  console.log(maps[0]);
}

function dropItem(_x,_y,item,map){

  var droppingItem = {x:_x,y:_y,id:itemIds++};

  for(var key in item) {
    var value = item[key];
    if(key == "id"){
      continue;
    }
    droppingItem[key] = value;

  }
  maps[map].droppedItems.push(droppingItem);

}


function giveItem(item,player,map){
  for(var i=0;i<player.inventory.length;i++){
    if(player.inventory[i]==null){continue;}
    if(player.inventory[i].name == item.name){ //Give item if already in inventory
      player.inventory[i].pieces += item.pieces;
      return;
    }
    
  }
  var availableIndex = -1;
  for(var i=0;i<player.inventory.length;i++){
    if(player.inventory[i] == null){
      availableIndex = i;
      break;
    }
  }
  if(availableIndex == -1){
    //Inventory full, drop the item
    dropItem(item,player.x+30,player.y,map);
    return;
  }else{
    player.inventory[availableIndex] = {};
    for(var key in item) {
      var value = item[key];
      if(key == "id"){
        player.inventory[availableIndex] .id = itemIds++;
        continue;
      }
      player.inventory[availableIndex][key] = value;
  
    }
  }
}

setInterval(seePlayers,1000);

function monsterUpdate(){
  for(var h=0;h<maps.length;h++){
    var monsters = maps[h].monsters;
    var players = maps[h].players;
    var projectiles = maps[h].projectiles;
    for(var i=0;i<monsters.length;i++){
      if(monsters[i].health<=0){
        for(var j=0;j<monsters[i].loot.length;j++){
          dropItem(monsters[i].x,monsters[i].y,monsters[i].loot[j],h);
        }
        monsters.splice(i,1);
        i--;
        continue;
      }
      if(monsters.target==null){ //Check players, no target right now
        var minimumDist = monsters[i].detectRange+1;
        var minimumPlayerInd = -1;
        for(var j=0;j<players.length;j++){
          var d = (monsters[i].x-players[j].x)**2 + (monsters[i].y-players[j].y)**2;
          if(d<monsters[i].detectRange && players[j].health>0){ //Check the closest player in detect range
            if(d<minimumDist){
              minimumDist = d;
              minimumPlayerInd = j;
            }
          }
        }
        if(minimumPlayerInd == -1){
          //No player in detect range
          //TODO: Just wonder around 2 points
          monsterClass.monsterWonder(monsters[i]);
          //monsters[i].x -= 0.1*monsters[i].moveSpeed
          //monsters[i].y -= Math.sign(monsters[i].y-monsters[i].target.y)*monsters[i].moveSpeed
          continue;
        }
        //Player detected
        monsters[i].target = players[minimumPlayerInd];
      }
      if(monsters[i].target!=null){
        var d = (monsters[i].x-monsters[i].target.x)**2 + (monsters[i].y-monsters[i].target.y)**2;
        if(d>monsters[i].abandonRange){ //player is outside of abandon range
          monsters[i].target = null;
          continue;
        }
        if(d<monsters[i].attackRange){
          //Attack the target
          var d = new Date();
          var now = d.getTime();
          if(now-monsters[i].lastAttacked<1000/monsters[i].attackSpeed){}//Attack on cooldown
          else{
            if(monsters[i].target.health>0){//Check if still alive
              monsterClass.monsterAttack(monsters[i],projectiles,io,h);
              //monsters[i].target.health -= monsters[i].attackDmg;
              
              monsters[i].lastAttacked = d.getTime();
            }else{
              //Search for new target if dead
              monsters[i].target = null;
              continue;
            }
          }
        }
        //move the monster in the direction of the player
        var angle = Math.atan2(monsters[i].y-monsters[i].target.y,monsters[i].x-monsters[i].target.x);
        var mSpeedX = Math.cos(angle)*monsters[i].moveSpeed;
        monsters[i].x -= mSpeedX;
        monsters[i].y -= Math.sin(angle)*monsters[i].moveSpeed;
        //change the facing of the monster based on character position
        if(mSpeedX>0.2){
          monsters[i].facing = 1;
        }else{
          monsters[i].facing = 0;
        }
      }
    }
  }
}



function movePlayerToMap(playerId,from,to){
  for(var i=0;i<maps[from].players.length;i++){
    if(maps[from].players[i].id==playerId){
      maps[to].players.push(maps[from].players[i]);
      maps[from].players.splice(i,1);
      minuteUpdate();
      break;
    }
  }
}

function minuteUpdate(){
  // Runs every minute, just static updates
  for(var h=0;h<maps.length;h++){
    var players = maps[h].players;
    for(var i=0;i<players.length;i++){
      io.to(players[i].id).emit("updateMinuteData",{tpPointsArr:maps[h].tpPoints,NPCsArr:maps[h].NPCsClientSide});
    }
  }

  // tpPointsArr:maps[h].tpPoints
}

setInterval(minuteUpdate,60000);


function playerUpdate(){
  
  if(Math.random()<0.005 && maps[0].droppedItems.length<50){
    var x = (51+(Math.random()*(69-51)))*32;
    var y = (5+(Math.random()*(16-5)))*32;
    dropItem(x,y,{equipment:false,iconNumber:163,name:"log",pieces:1},0);
  }
  if(Math.random()<0.005 && maps[0].droppedItems.length<50){
    var x = (66+(Math.random()*(81-66)))*32;
    var y = (64+(Math.random()*(70-64)))*32;
    dropItem(x,y,{equipment:false,iconNumber:20,name:"flower",pieces:1},0);
  }
  
  //Respawn screen
  for(var h=0;h<maps.length;h++){
    var players = maps[h].players;
    for(var i=0;i<players.length;i++){
      if(players[i].respawnTimer==0){
        //TODO: spawn points
        io.to(players[i].id).emit("teleport",{x:250,y:200});
        players[i].health = players[i].maxHealth;
        players[i].respawnTimer=-1;
        //continue;
      }
      else if(players[i].health<=0 && players[i].respawnTimer==-1){
        players[i].respawnTimer = 300;
        //continue;
      }
      else if(players[i].respawnTimer>-1){
        players[i].respawnTimer--;
        //continue;
      }
      io.to(players[i].id).emit("updateData",
      {playersArr:players,
        droppedItemsArr:maps[h].droppedItems,
        monstersArr:maps[h].monsters,
        projectileArr:maps[h].projectiles,
        doorsArr:maps[h].doors,
        chestsArr:maps[h].chests
      });
    }
  }
  /*
  if(maps[0].players.length+maps[1].players.length>0){
    io.sockets.emit("updateData",{playersArr:players,droppedItemsArr:droppedItems,monstersArr:monsters,projectileArr:projectiles});
  }*/
}


function projectileUpdate(){
  for(var h=0;h<maps.length;h++){
    var projectiles = maps[h].projectiles;
    var players = maps[h].players;
    for(var i=0;i<projectiles.length;i++){
      if(projectiles[i].lifespan<=0){
        projectiles.splice(i,1);
        i--;
        continue;
      }
      
      projectiles[i].x += projectiles[i].vX;
      projectiles[i].y += projectiles[i].vY;
      projectiles[i].lifespan--;
      for(var j=0;j<players.length;j++){
        if(projectiles[i] != undefined){
          if((players[j].x+13-projectiles[i].x-7)**2+(players[j].y+18-projectiles[i].y-7)**2<100){
            players[j].health-=projectiles[i].physicalDmg;
            io.to(players[j].id).emit("damageParticle",{damage:projectiles[i].physicalDmg,type:"magic",as:"victim"});
            io.to(players[j].id).emit("sounds",{sound:"hurt"});
            projectiles.splice(i,1);
            i--;
            continue;
          }
        }
      }
    }
  }
}

function updateFrames(){
  monsterUpdate();
  projectileUpdate();
  playerUpdate();
}

setInterval(updateFrames,1000/60);



function itemUpdate(){
  for(var h=0;h<maps.length;h++){
    for(var i=0;i<maps[h].players.length;i++){
      refreshBaseStats(i,h);
    }
  }
}

function refreshBaseStats(playerNum,map){
  var players = maps[map].players; 
  var hp = players[playerNum].baseHealth;
  var healthRegen = 0;
  var moveSpeed = 0;
  for(var i=0;i<players[playerNum].equipment.length;i++){
    if(players[playerNum].equipment[i]!=null){
      if(players[playerNum].equipment[i].hasOwnProperty("health")){
        hp+=players[playerNum].equipment[i].health;
      }
      if(players[playerNum].equipment[i].hasOwnProperty("healthRegen") && players[playerNum].poisoned == 0){
        healthRegen+=players[playerNum].equipment[i].healthRegen;
      }
      if(players[playerNum].equipment[i].hasOwnProperty("moveSpeed")){
        moveSpeed+=players[playerNum].equipment[i].moveSpeed;
      }
    }
  }

  if(players[playerNum].poisoned>0){
    players[playerNum].poisoned--;
    players[playerNum].health-=players[playerNum].poisonDmg;
    io.to(players[playerNum].id).emit("damageParticle",{damage:players[playerNum].poisonDmg,type:"poison",as:"victim"});
  }

  players[playerNum].moveSpeed = [3+moveSpeed,3+moveSpeed];

  players[playerNum].maxHealth = hp;
  if(players[playerNum].health+healthRegen>=players[playerNum].maxHealth){
    players[playerNum].health=players[playerNum].maxHealth 
  }
  else{
    players[playerNum].health+=healthRegen;
  }


}
setInterval(itemUpdate,1000);



function newConnection(socket){
  console.log(socket.id);
  //New Player connects
  //increase item ids
  //{id:itemIds++, iconNumber:17, name:"pickaxe", equipment: true, pieces:3}
  maps[0].players.push({name:"aa",playerHit:0, respawnTimer:-1, poisoned:0, facing:0,baseHealth:250,maxHealth:250, health:250, skin:0, id:socket.id, x:0,y:0, moveDir:[0,0], inventory:new Array(20), acceptedQuests:[], availableQuests:[0,5], moveSpeed:[3,3],
      equipment:new Array(4)/*[
        {id:itemIds++, name:"sword",description:["Physical damage 20"], physicalDmg:20,slotNumber:0, pieces:1, equipment:true, iconNumber:16},
        {id:itemIds++, name:"ring", slotNumber:1, description:["Health regen 2"],healthRegen:2, pieces:1, equipment:true, iconNumber:45},
        {id:itemIds++, name:"jacket", slotNumber:2, pieces:1,description:["Armor 100","Health 150"], armor:100, health:150, equipment:true, iconNumber:182},
      {id:itemIds++, name:"boots", slotNumber:3,description:["Armor 50","Movespeed +1"], armor:50, moveSpeed:1, pieces:1, equipment:true, iconNumber:25}]*/
    });
  //players[players.length-1].inventory[0] = {id:itemIds++, name:"penSword",description:["Physical damage 20","Armor pen 20%"], physicalDmg:20, magicDmg:10,armorPen:0.8,slotNumber:0, pieces:1, equipment:true, iconNumber:81};
  maps[0].players[maps[0].players.length-1].inventory[0] = {id:itemIds++, name:"boots", slotNumber:3,description:["Armor 50","Movespeed +1"], armor:50, moveSpeed:1, pieces:1, equipment:true, iconNumber:25};
  maps[0].players[maps[0].players.length-1].inventory[1] = {id:itemIds++, name:"sword",description:["Physical damage 20"], physicalDmg:20,slotNumber:0, pieces:1, equipment:true, iconNumber:16};
  refreshBaseStats(maps[0].players.length-1,0);
  minuteUpdate();
  socket.on("loginInfo",loginInfo);
  function loginInfo(data){
    for(var i=0;i<maps[data.map].players.length;i++){
      if(maps[data.map].players[i].id == socket.id){
        maps[data.map].players[i].name = data.name;
        maps[data.map].players[i].skin = data.skin;
        break;
      }
    }
  }
  socket.on("changeToMap",changeToMap);
  function changeToMap(data){
    movePlayerToMap(socket.id,data.from,data.to);
  }

  socket.on("playerPos",updatePlayerPosition);
  function updatePlayerPosition(data){
    var players = maps[data.map].players;
    for(var i=0;i<players.length;i++){
      if(players[i].id == socket.id){
        //REMOVE
        //Speedhack and teleport by checking the data validity
        //
        if(players[i].x+players[i].moveSpeed[0]<data.x-players[i].moveSpeed[0]){}
        players[i].x = data.x;
        players[i].y = data.y;
        players[i].facing = data.facing;
        players[i].moveDir = data.moveDir;
        players[i].playerHitting = data.playerHit;
      }
    }
  }
  socket.on("attack",attack);
  function attack(data){
    var players = maps[data.map].players;
    var monsters = maps[data.map].monsters;
    //Check if attacking players
    for(var i=0;i<players.length;i++){
      if(players[i].id == socket.id){
        for(var j=0;j<players.length;j++){
          if(players[j].id == players[i].id){
            continue;
          }
          if(players[i].equipment[0]==null){continue;}
          var dist = (players[i].x-players[j].x)**2+(players[i].y-players[j].y)**2;
          if(dist<2000){
            var armor = 0;
            var armorPen = 1;
            var magicResist = 0;
            var magicPen = 1;
            var magicDmg = 0;
            var physicalDmg = 0;
            var poisonDmg = 0;
            var lifeSteal = 0;
            //
            // Calculate armor and damage based on all items
            //
            for(var k = 0;k<players[i].equipment.length;k++){//Attacker
              if(players[i].equipment[k]==null){continue;}
              if(players[i].equipment[k].hasOwnProperty("physicalDmg")){
                physicalDmg += players[i].equipment[k].physicalDmg;
              }
              if(players[i].equipment[k].hasOwnProperty("magicDmg")){
                magicDmg += players[i].equipment[k].magicDmg;
              }
              if(players[i].equipment[k].hasOwnProperty("armorPen")){
                armorPen *= players[i].equipment[k].armorPen;
              }
              if(players[i].equipment[k].hasOwnProperty("magicPen")){
                magicPen *= players[i].equipment[k].magicPen;
              }
              if(players[i].equipment[k].hasOwnProperty("lifeSteal")){
                lifeSteal += players[i].equipment[k].lifeSteal;
              }
              if(players[i].equipment[k].hasOwnProperty("poisonous")){
                poisonDmg += parseInt(players[i].equipment[k].physicalDmg*0.1);
              }
            }

            for(var k = 0;k<players[j].equipment.length;k++){//Victim
              if(players[j].equipment[k]==null){continue;}
              if(players[j].equipment[k].hasOwnProperty("armor")){
                armor += players[j].equipment[k].armor;
              }
              if(players[j].equipment[k].hasOwnProperty("magicResist")){
                magicResist += players[j].equipment[k].magicResist;
              }
            }

            var physicalAll = parseInt(physicalDmg*(100/(100+armor*armorPen)));
            var magicAll = parseInt(magicDmg*(100/(100+magicResist*magicPen)));

            //Random poison test
            
            
            var hitPlayer = false;
            if(data.direction == 0 && players[j].y<players[i].y){
              //DAMAGE up
              hitPlayer = true;
            }
            else if(data.direction == 1 && players[j].x>players[i].x){
              //DAMAGE right
              hitPlayer = true;
            }
            else if(data.direction == 2 && players[j].y>players[i].y){
              //DAMAGE down 
              hitPlayer = true;
            }
            else if(data.direction == 3 && players[j].x<players[i].x){
              //DAMAGE left
              hitPlayer = true;
            }
            if(hitPlayer){

              if(poisonDmg>0){
                players[j].poisoned = 3;
                players[j].poisonDmg = poisonDmg;
              }
              if(lifeSteal>0 && players[i].health<players[i].maxHealth){
                players[i].health += parseInt((physicalAll+magicAll)*lifeSteal);
              }

              if(players[j].health>0){
                players[j].health -= physicalAll+magicAll;
              }
              if(physicalAll>0){
                socket.emit("damageParticle",{damage:physicalAll,type:"physical",as:"attacker",at:[players[j].x,players[j].y]});
                socket.broadcast.to(players[j].id).emit("damageParticle",{damage:physicalAll,type:"physical",as:"victim"});
              }
              if(magicAll>0){
                socket.emit("damageParticle",{damage:magicAll,type:"magic",as:"attacker",at:[players[j].x,players[j].y]});
                socket.broadcast.to(players[j].id).emit("damageParticle",{damage:magicAll,type:"magic",as:"victim"});
              }
              socket.emit("sounds",{sound:"swordclang"});
              socket.broadcast.to(players[j].id).emit('sounds', {sound:"hurt"});
            }
          }

        }

        break;
      }
    }
    //Check if attacking monsters
    for(var i=0;i<players.length;i++){
      if(players[i].id == socket.id){
        for(var j=0;j<monsters.length;j++){
          
          if(players[i].equipment[0]==null){continue;}
          var dist = (players[i].x-monsters[j].x)**2+(players[i].y-monsters[j].y)**2;
          if(dist<2000){


            var hitMonster = false;
            if(data.direction == 0 && monsters[j].y<players[i].y){
              //DAMAGE up
              hitMonster = true;
            }
            else if(data.direction == 1 && monsters[j].x>players[i].x){
              //DAMAGE right
              hitMonster = true;
            }
            else if(data.direction == 2 && monsters[j].y>players[i].y){
              //DAMAGE down 
              hitMonster = true;
            }
            else if(data.direction == 3 && monsters[j].x<players[i].x){
              //DAMAGE left
              hitMonster = true;
            }
            if(hitMonster && monsters[j].health>0){
              monsters[j].health-=players[i].equipment[0].physicalDmg;
              io.to(players[i].id).emit("damageParticle",{damage:players[i].equipment[0].physicalDmg,type:"physical",as:"attacker",at:[monsters[j].x,monsters[j].y]});
              io.to(players[i].id).emit("sounds",{sound:"swordclang"});
            }

          }
        }
        break;
      }
    }
  }
  socket.on("pickUpItem",pickUpItem);
  function pickUpItem(data){
    var droppedItems = maps[data.map].droppedItems;
    var players = maps[data.map].players;
    for(var i=0;i<droppedItems.length;i++){
      if(droppedItems[i].id == data.itemId){
        var itemPickedUp = false;
        for(var j=0;j<players.length;j++){
          if(socket.id == players[j].id){

            var isThereSameItem = false;
            for(var k=0;k<players[j].inventory.length;k++){
              if(players[j].inventory[k]==null){continue;}
              if(players[j].inventory[k].name == droppedItems[i].name){
                isThereSameItem = true;
                players[j].inventory[k].pieces+=droppedItems[i].pieces;
                itemPickedUp=true;
                break;
              }
            }
            if(!isThereSameItem){
              var ind = -1;
              for(var k=0;k<players[j].inventory.length;k++){
                if(players[j].inventory[k]==null){ind = k;itemPickedUp=true;break;}
              }
              if(ind==-1){itemPickedUp=false;}
              players[j].inventory[ind] = {};
              //players[j].inventory[ind] = { id:droppedItems[i].id, iconNumber:droppedItems[i].iconNumber,name: droppedItems[i].name, equipment: droppedItems[i].equipment, pieces:droppedItems[i].pieces };
              //if(droppedItems[i].hasOwnProperty('slotNumber')){players[j].inventory[ind].slotNumber = droppedItems[i].slotNumber;}
              for(var key in droppedItems[i]) {
                var value = droppedItems[i][key];
                if(key == "id"){
                  players[j].inventory[ind].id = droppedItems[i].id;
                  continue;
                }
                if(key == "x" || key == "y"){
                  continue;
                }
                players[j].inventory[ind][key] = value;
    
              }
            }
            if(itemPickedUp){
              socket.emit("sounds",{sound:"pickup"});
            }
            break;
          }
        }
        if(itemPickedUp){
          droppedItems.splice(i,1);
        }
        break;
      }
    }
  }
  socket.on("acceptQuest", acceptedQuest);
  function acceptedQuest(data){
    var players = maps[data.map].players;
    for(var i=0;i<players.length;i++){
      if(socket.id == players[i].id){
        console.log("acceptedQuest: "+data.questId);
        if(players[i].availableQuests.indexOf(data.questId)>-1){
          players[i].acceptedQuests.push(data.questId);
          players[i].availableQuests.splice(players[i].availableQuests.indexOf(data.questId),1);

          //Give quest items if any
          for(var j=0;j<quests[data.questId].startItems.length;j++){
            giveItem(quests[data.questId].startItems[j],players[i],data.map);
          }

          break;
        }else{
          //Not available quest was accepted, shouldn't happen
        }
        break;
      }
    }
  }

  socket.on("tryUse", tryUse);
  function tryUse(data){
    var players = maps[data.map].players;
    for(var i=0;i<players.length;i++){
      if(players[i].id == socket.id){
        
        if(data.place == "equipment"){
          var indexAvailable = -1;
          for(var j=0;j<players[i].inventory.length;j++){
            if(players[i].inventory[j]==null){
              indexAvailable = j;
              break;
            }
          }
          if(indexAvailable==-1){
            //drop item
            dropItem(players[i].x+30,players[i].y,players[i].equipment[data.index]);
            return;
          }

          players[i].inventory[indexAvailable]=players[i].equipment[data.index];
          players[i].equipment[data.index] = null;
          refreshBaseStats(i,data.map);
        }
        else if(data.place == "inventory"){

          if(players[i].inventory[data.index] == null){return;}

          if(players[i].inventory[data.index].slotNumber!=undefined){
            if(players[i].equipment[players[i].inventory[data.index].slotNumber]!=null){
              //if slot is not empty, swap items
              var tmp = players[i].equipment[players[i].inventory[data.index].slotNumber];
              players[i].equipment[players[i].inventory[data.index].slotNumber] = players[i].inventory[data.index];
              players[i].inventory[data.index] = tmp;
              
            }else{
              //place equipment into slot
              players[i].equipment[players[i].inventory[data.index].slotNumber] = players[i].inventory[data.index];
              //delete from the slot
              players[i].inventory[data.index] = null;
            }
            refreshBaseStats(i,data.map);
            return;
          }
          //Not interactable items
          
          if(players[i].inventory[data.index].name == "apple"){
            players[i].health = players[i].health+20;
            if(players[i].health>players[i].maxHealth){players[i].health = players[i].maxHealth;}
            if(players[i].inventory[data.index].pieces == 1){
              players[i].inventory[data.index] = null;
              return;
            }else{
              players[i].inventory[data.index].pieces--;
            }
          }

          //ENCHANTMENT

          if(players[i].inventory[data.index].name == "sword enchant"){
            var swordProperties = ["physicalDmg","magicDmg","lifeSteal"]; /// From here
            if(players[i].equipment[0]==null){return;} // If sword is not equipped
            //Check if there are enough resources to enchant
            var gemFound = false;
            for(var item=0;item<players[i].inventory.length;item++){
              if(players[i].inventory[item]==null){continue;}
              if(players[i].inventory[item].name == "gem"){
                if(players[i].inventory[item].pieces>=1){
                  players[i].inventory[item].pieces-=1;
                  gemFound = true;
                  if(players[i].inventory[item].pieces==0){
                    players[i].inventory[item]=null;
                  }
                  break;
                }
              }
            }
            if(gemFound==false){
              console.log(players[i].name+" not enough gems for the enchantment!");
              return;
            }

            //Try to transfer properties

            for(var p =0;p<swordProperties.length;p++){
              if(players[i].inventory[data.index].hasOwnProperty(swordProperties[p])){
                if(players[i].equipment[0].hasOwnProperty(swordProperties[p])){
                  players[i].equipment[0][swordProperties[p]] += players[i].inventory[data.index][swordProperties[p]];
                  /*
                  TODO: update enchantment text
                  for(var line =0;line<players[i].equipment[0].description.length;line++){
                    if(players[i].equipment[0].description[line].indexOf("Physical damage")>-1){
                      var spl = players[i].equipment[0].description[line].split(" ");
                      players[i].equipment[0].description[line]
                    }
                  }
                  */
                  players[i].equipment[0].description.push("+"+swordProperties[p]+" "+players[i].inventory[data.index][swordProperties[p]]);
                }
                else{
                  players[i].equipment[0][swordProperties[p]] = players[i].inventory[data.index][swordProperties[p]];
                  players[i].equipment[0].description.push("+"+swordProperties[p]+" "+players[i].inventory[data.index][swordProperties[p]]);
                }
              }
            }

            players[i].inventory[data.index] = null;
            return;
          }
        }

        break;
      }
    }
  }
  socket.on("dropItem",dropItemInv);
  function dropItemInv(data){
    var players = maps[data.map].players;
    var droppedItems = maps[data.map].droppedItems;
    for(var i=0;i<players.length;i++){
      if(socket.id == players[i].id){
        
        var item = null;
        if(data.place == "inventory"){
          item = players[i].inventory[data.index];
        }
        else if(data.place == "equipment"){
          item = players[i].equipment[data.index];
        }
        var droppingItem = {};
        if(item!=null){
          
          //droppingItem = {id:itemIds++, x:players[i].x+30,y:players[i].y+10,equipment:item.equipment, name:item.name, iconNumber:item.iconNumber,pieces:1};
          droppingItem = {x:players[i].x+30,y:players[i].y+10, pieces:1};
          // Add all item properties!!

          for(var key in item) {
            var value = item[key];
            if(key == "id"){
              droppingItem.id = itemIds++;
              continue;
            }
            if(key == "pieces"){
              continue;
            }
            droppingItem[key] = value;

          }


          //
          /*
          if(item.hasOwnProperty('slotNumber')){
            droppingItem.slotNumber = item.slotNumber;
          }
          */
          if(data.dropAll){
            droppingItem.pieces = item.pieces;
            if(data.place == "inventory"){
              players[i].inventory[data.index] = null;
            }
            else if(data.place == "equipment"){
              players[i].equipment[data.index] = null;
            }
          }else{
            if(data.place == "inventory"){
              if(item.pieces==1){
                players[i].inventory[data.index] = null;
              }else{
                players[i].inventory[data.index].pieces--;
              }
            }
            else if(data.place == "equipment"){
              if(item.pieces==1){
                players[i].equipment[data.index] = null;
              }else{
                players[i].equipment[data.index].pieces--;
              }
            }


          }
          
          
          droppedItems.push(droppingItem);
        }
        break;
      }
    }
  }
  socket.on("checkQuest", checkQuest);
  function checkQuest(data){
    var players = maps[data.map].players;
    var NPCs = maps[data.map].NPCs;
    var droppedItems = maps[data.map].droppedItems;
    for(var i=0;i<players.length;i++){
      if(socket.id == players[i].id){
        

        var selectedNPC = -1;
        for(var j=0;j<NPCs.length;j++){
          if(NPCs[j].id == data.NPCId){
            selectedNPC = NPCs[j];
          }
        }

        if(selectedNPC==-1){console.log("This shouldn't happen, check the npc ids");}

        //Check if we have quest interactions with npc
        if(selectedNPC.hasOwnProperty("questInteractions")){
          for(var j=0;j<players[i].acceptedQuests.length;j++){
            for(var k=0;k<selectedNPC.questInteractions.length;k++){
              if(selectedNPC.questInteractions[k].questId == quests[players[i].acceptedQuests[j]].id){
                //We have a quest interaction
                if(selectedNPC.questInteractions[k].itemsGivenToPlayers.indexOf(players[i].id)>-1){
                  //We already give the item to the player
                  socket.emit("checkQuest",{successful:false,answer:["","I already gave you what you came for!",""]});                  

                  return;
                }else{
                  //Speechbubble with questInteraction text
                  //Give item to player
                  for(var l = 0;l<selectedNPC.questInteractions[k].items.length;l++){
                    giveItem(selectedNPC.questInteractions[k].items[l],players[i],data.map);
                  }
                  socket.emit("checkQuest",{successful:false,answer:selectedNPC.questInteractions[k].text});
                  //Note that item was received
                  selectedNPC.questInteractions[k].itemsGivenToPlayers.push(players[i].id);
                  return;
                }

              }
            }

          }
        }



        var acceptedQuestIdFromNPC = -1;
        for(var j=0;j<players[i].acceptedQuests.length;j++){
            if(selectedNPC.quests.indexOf(players[i].acceptedQuests[j])>-1){
              acceptedQuestIdFromNPC = players[i].acceptedQuests[j];
              
              break;
            }
        }
        if(acceptedQuestIdFromNPC>-1){
          //check this quest's requirements

          var selectedQuest;
          for(var j=0;j<quests.length;j++){
            if(quests[j].id == acceptedQuestIdFromNPC){
              selectedQuest = quests[j];
              break;
            }
           
          }
          //check if quest was accepted before !! shouldn't be able to run
          if(!(players[i].acceptedQuests.indexOf(selectedQuest.id)>-1)){
            //not accepted quest
            var questCheckData = {notAccepted:true,successful:false};
            socket.emit("checkQuest",questCheckData);
            return;
          }

          var fulfilledRequirements = 0;
          
          for(var j=0;j<players[i].inventory.length;j++){
            for(var k=0;k<selectedQuest.requirements.length;k++){
              if(players[i].inventory[j] == null){continue;}
              if(players[i].inventory[j].name==selectedQuest.requirements[k].name){
                if(players[i].inventory[j].pieces>selectedQuest.requirements[k].pieces){
                  //FIX BUGS
                  fulfilledRequirements++;
                }
                else if(players[i].inventory[j].pieces==selectedQuest.requirements[k].pieces){
                  fulfilledRequirements++;
                }else{
                  //Not enough items yet of this type
                }
              }
              //else we dont need this item
            }
          }

          if(fulfilledRequirements==selectedQuest.requirements.length){
            //If we have all the needed items, then we take them from the player
            for(var j=0;j<players[i].inventory.length;j++){
              for(var k=0;k<selectedQuest.requirements.length;k++){
                if(players[i].inventory[j] == null){continue;}
                if(players[i].inventory[j].name==selectedQuest.requirements[k].name){
                  if(players[i].inventory[j].pieces>selectedQuest.requirements[k].pieces){
                    players[i].inventory[j].pieces-=selectedQuest.requirements[k].pieces;
                  }
                  else if(players[i].inventory[j].pieces==selectedQuest.requirements[k].pieces){
                    players[i].inventory.splice(j,1);
                    j--;
                  }else{
                    //Not enough items yet of this type
                  }
                }
                //else we dont need this item
              }
            }
          }

        
          //default to not having those items
          var questCheckData = {successful:false,answer:["You didn't complete my quest!"]};

          if(fulfilledRequirements==selectedQuest.requirements.length){
            //if you have those items
            questCheckData.successful = true;
            questCheckData.answer = ["Thank you for helping me!"];
            players[i].acceptedQuests.splice(players[i].acceptedQuests.indexOf(selectedQuest.id),1);
            var availableIndeces = [];
            for(var l=0;l<players[i].inventory.length;l++){
              if(players[i].inventory[l] == null){
                availableIndeces.push(l);
              }
            }

            if(availableIndeces.length<selectedQuest.rewards.length){
              //no space in inventory, drop the items
              for(var l=0;l<availableIndeces.length;l++){
                players[i].inventory[availableIndeces[l]] = Object.assign({},selectedQuest.rewards[l]);
              }
              var diff = selectedQuest.rewards.length-availableIndeces.length;
              for(var l=diff;l<selectedQuest.rewards.length;l++){
                var droppingItem = {x:players[i].x+30,y:players[i]+10};
                for(var key in selectedQuest.rewards[l]) {
                  var value = selectedQuest.rewards[l][key];
                  if(key == "id"){
                    droppingItem.id = itemIds++;
                    continue;
                  }
                  droppingItem[key] = value;
      
                }
                droppedItems.push(droppingItem);
              }

            }else{
              var foundItemNames = [];
              for(var l=0;l<selectedQuest.rewards.length;l++){
                for(var m=0;m<players[i].inventory.length;m++){
                  if(players[i].inventory[m]!=null && players[i].inventory[m].name ==selectedQuest.rewards[l].name && !foundItemNames.includes(selectedQuest.rewards[l].name)){
                    
                    players[i].inventory[m].pieces += selectedQuest.rewards[l].pieces;
                    foundItemNames.push(selectedQuest.rewards[l].name); 
                    break;
                  }
                }
              }
              for(var l=0;l<selectedQuest.rewards.length;l++){
                if(foundItemNames.includes(selectedQuest.rewards[l].name)){continue;}
                players[i].inventory[availableIndeces[l]] = Object.assign({},selectedQuest.rewards[l]);
              }

            }

            
            //activate new quests
            for(var l=0;l<selectedQuest.allowQuests.length;l++){
              players[i].availableQuests.push(selectedQuest.allowQuests[l]);
            }

          }

          socket.emit("checkQuest",questCheckData);

          break;
        }else{
          //We don't have a quest accepted from this npc
          //check if we have a quest available from this npc

          var selectedNPC = -1;
          for(var j=0;j<NPCs.length;j++){
            if(NPCs[j].id == data.NPCId){
              selectedNPC = NPCs[j];
            }
          }

          if(selectedNPC==-1){console.log("This shouldn't happen, check the npc ids");}

          var availableQuestIdFromNPC = -1;
          
          for(var j=0;j<players[i].availableQuests.length;j++){
              console.log(selectedNPC.quests+" "+players[i].availableQuests[j]);
              if(selectedNPC.quests.indexOf(players[i].availableQuests[j])>-1){
                availableQuestIdFromNPC = players[i].availableQuests[j];
                break;
              }
          }
          console.log(selectedNPC.quests+" "+players[i].availableQuests);
          if(availableQuestIdFromNPC == -1){
            //We can't offer a quest right now
            var questCheckData = {successful:false,answer:["I don't have a quest for you!","Maybe come back later!"]};
            socket.emit("checkQuest",questCheckData);
          }
          else{
            //Offer a quest from the NPC
            var questCheckData = {successful:true,offer:true,questId:availableQuestIdFromNPC,answer:["Here's a quest, id:"+availableQuestIdFromNPC]};
            socket.emit("checkQuest",questCheckData);

          }

        }
        break;
      }
    }
  }
  socket.on("createItem", createItem);
  function createItem(data){
    var players = maps[data.map].players;
    var droppedItems = maps[data.map].droppedItems;
    for(var i=0;i<players.length;i++){
      if(socket.id == players[i].id){
        droppedItems.push({id:itemIds++, equipment:data.equipment, x: players[i].x+40, y: players[i].y, name:data.name, iconNumber:data.iconNumber, pieces:data.pieces});
        break;
      }
    }
  }
  socket.on("spawnGhost",spawnGhost);
  function spawnGhost(data){
    monsters = maps[data.map].monsters;
    var tears = 1+Math.floor(Math.random()*2);
    monsters.push(Object.assign({},{id:itemIds++, name:"Scary ghost",facing:1,detectRange:40000,abandonRange:160000,attackRange:1000,image:"img/ghost.png",w:45,h:50,frames:6,x:data.x, y:data.y,moveSpeed:1.6,attackSpeed:1.2,loot:[{id:itemIds++,name:"ghasttear",pieces:tears,iconNumber:35,equipment:false}],target:null,attackDmg:40,health:100,maxHealth:100}));
  }
  socket.on("open",open);
  function open(data){
    //Collector for opening doors, chests
    if(data.type=="door"){
      var currentDoor = null;
      for(var i=0;i<maps[data.map].doors.length;i++){
        if(maps[data.map].doors[i].id == data.doorId){
          currentDoor = maps[data.map].doors[i];
        }
      }
      if(currentDoor==null){
        return;
      }
      if(currentDoor.isOpen){
        return;
      }
      //Check if key in player's inventory
      for(var i=0;i<maps[data.map].players.length;i++){
        if(maps[data.map].players[i].id == socket.id){
          
          for(var j=0;j<maps[data.map].players[i].inventory.length;j++){
            if(maps[data.map].players[i].inventory[j]==null){
              //Inventory slot is null
              continue;
            }
            if(maps[data.map].players[i].inventory[j].name == currentDoor.key.name){
              //We found the key
              //TODO consider keyIDs, rather than names
              //Remove it from the inventory
              
              maps[data.map].players[i].inventory[j]=null;

              //And open the door
              currentDoor.isOpen = true;
              socket.emit("sounds",{file:"sound/openDoor.wav"});
              return;
            }

          }

          //We didn't found the key in the players inventory
          //Add particle for not opening?
          //temporarily:
          socket.emit("damageParticle",{as:"victim",type:"physical",damage:"Couldn't find key"});
          //TODO add locked sound
          

          return;
        }
      }
      
    }

  }
  socket.on("disconnect",disconnected);
  function disconnected(data){
    for(var h=0;h<maps.length;h++){
      for(var i=0;i<maps[h].players.length;i++){
        if(maps[h].players[i].id == socket.id){
          maps[h].players.splice(i,1);
          return;
        }
      }
    }
  }
}