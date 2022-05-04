var dialogBoxImage = new Image();
dialogBoxImage.src = "img/dialogbox_wood.png";

var NPCImage = new Image();
NPCImage.src = "img/npcs6.png";

var nextDialogImg = new Image();
nextDialogImg.src = "img/next_arrow_animation.png";

var dialogAccDecImg = new Image();
dialogAccDecImg.src = "img/dialogbox_accdec.png";

var dialogCloseImg = new Image();
dialogCloseImg.src = "img/dialogbox_close.png";

var talkSound = new Audio();
talkSound.src = "sound/talksound2.wav";
talkSound.volume = 0.2;

var currentPlayerQuests = [];


var inDialogBox = false;
var currentNPC = null;


var questLastPage = false;

var quests = [
new Quest(0,"Welcome to the island",
  ["Hey there traveler!","Welcome to the island of Magington.","I'm Orvald, the wizard of this city.","If you need any help contact me.","You should be new around here.","Around the city are several monsters,","so you will probably need a sword.","I will help if you gather the resources.","There is a forest to the east","that people have cut down.","Gather 3 logs and come back.","I will hook you up with a brand new sword."],
  [{name:"log",pieces:3,equipment:false,iconNumber:163}]),



  new Quest(1,"Flowers for grandma",
  ["Hey there!","I really appreciated your gesture","I forgot to bring flowers with me,","so now I can't put any on my mum's grave","Would you gather some flowers for me?","They grow to the left of the lake.","Gather 5 flowers and come back.","I will give you some fresh money"],
  [{name:"flower",pieces:5,equipment:false,iconNumber:21}]),

  

  new Quest(2,"Let's get apples",
  ["Hi there!","Do you love fresh apples?","Well, I do.","But as you can see, I have to","stand here and help the villagers.","There is a fruiterer","just around the corner","Her name is Sarah","Would you bring some apples from her?","I will give you 50 pennies.."],
  [{name:"apple",pieces:4,equipment:false,iconNumber:33}]),



  new Quest(3,"To my grandpa",
  ["Hey good lookin'","Can you help me?","My grandpa went to the graveyard","and forgot to give me the keys.","So now I can't get into our house..","Would you bring the keys back for me?"],
  [{name:"house key",pieces:1,equipment:false,iconNumber:70}]),


  new Quest(4,"Hellish favor",
  ["Hey there..","Come closer","I know it's a bit of an awkward request","but I'm running low on skulls.","I need them for some recipies","Find the Reaper in the underworld","and bring me some skulls..","I will give you potions in return."],
  [{name:"skull",pieces:3,equipment:false,iconNumber:195}]),

  new Quest(5,"The presents!",
  ["Ho-ho-ho, traveler!","My elves just gone mad.","They stole the created presents!","","Those poor children","What will happen if they don't get presents?","","Can you bring them back to me?"],
  [{name:"present",pieces:5,equipment:true,iconNumber:203}]),


new Quest(6,"EVEN MORE gems!",
  ["Come back later,","and i will give you gems!","EVEN MORE GEMS!"],
  [])

  



];



var displayedTextLength = 0;

function drawDialogBox(npcname, quest){
    ctx.textAlign = "left";
    ctx.drawImage(dialogBoxImage, WIDTH/2-160,HEIGHT-200);
    ctx.font = "14px rubbero";
    ctx.fillStyle = "rgb(166,132,100)";
    ctx.fillRect(WIDTH/2-142,HEIGHT-200,npcname.length*9,30);
    ctx.fillStyle = "black";
    ctx.fillText(npcname,WIDTH/2-140,HEIGHT-186);
    ctx.font = "12px arial";
    ctx.fillText(quest.name, WIDTH/2-140,HEIGHT-170);    
    ctx.font = "11px courier";

    //draw the 4 lines
    for(var i=quest.questCurrentPage*4;i<quest.text.length;i++){
        ctx.fillText(quest.text[i], WIDTH/2-140,HEIGHT-145+(i-quest.questCurrentPage*4)*15);
        //stop after?
        if(i-quest.questCurrentPage*4>2){
            break;
        }
    }
}

function drawNewDialogBox(npcname){
    
    //ctx.fillStyle = "rgba(0,0,0,0.4)";
    //ctx.fillRect(WIDTH/2-158,HEIGHT-198,320,128)
    ctx.textAlign = "center";
    ctx.drawImage(dialogBoxImage, parseInt(WIDTH/2)-240,HEIGHT-200);
    ctx.font = "14px rubbero";
    //ctx.fillStyle = "rgb(166,132,100)";
    //ctx.fillRect(WIDTH/2-142,HEIGHT-200,npcname.length*9,30);
    ctx.fillStyle = "black";
    ctx.fillText(npcname,parseInt(WIDTH/2)-174,HEIGHT-97);
    ctx.font = "12px arial";
    ctx.textAlign = "left";
    if(currentNPC.currentQuest !=0){
        ctx.fillText(currentNPC.currentQuest.name, parseInt(WIDTH/2)-100,HEIGHT-160);    
    }
    ctx.font = "13px courier bold";

    ctx.fillStyle = "rgb(100,30,30)";
    //draw the 4 lines

    var textLength = 0;
    var drawnTextLength = 0;
    if(dialogBoxText.length>currentNPCPage*4+4){
        for(var i=currentNPCPage*4;i<currentNPCPage*4+4;i++){
            //Count the display all text length
            textLength += dialogBoxText[i].length;
        }
        if(displayedTextLength<textLength){
            //Display more text
            //TODO add play sound here
            displayedTextLength++;
            if(displayedTextLength%4==0){
                talkSound.currentTime = 0;
                talkSound.play();
            }
        }
        
        for(var i=currentNPCPage*4;i<currentNPCPage*4+4;i++){
            if(drawnTextLength+dialogBoxText[i].length>displayedTextLength){
                //If we need to draw parts of line
                ctx.fillText(dialogBoxText[i].substring(0,displayedTextLength-drawnTextLength), parseInt(WIDTH/2)-100,HEIGHT-130+(i-currentNPCPage*4)*17);
                break;
            }else{
                //If we can draw the full line
                ctx.fillText(dialogBoxText[i], parseInt(WIDTH/2)-100,HEIGHT-130+(i-currentNPCPage*4)*17);
                drawnTextLength+=dialogBoxText[i].length;
            }
        }
        ctx.drawImage(nextDialogImg, (parseInt(gameFrameCount/6)%12)*11, 0, 11, 20,  parseInt(WIDTH/2)+180, HEIGHT-55,11,20);
    }else{
        /*
        for(var i=currentNPCPage*4;i<dialogBoxText.length;i++){
            ctx.fillText(dialogBoxText[i], parseInt(WIDTH/2)-100,HEIGHT-130+(i-currentNPCPage*4)*17);
        }
        */
        for(var i=currentNPCPage*4;i<dialogBoxText.length;i++){
        //Count the display all text length
            textLength += dialogBoxText[i].length;
        }
        if(displayedTextLength<textLength){
            //Display more text
            //TODO add play sound here
            displayedTextLength++;

            if(displayedTextLength%4==0){
                talkSound.currentTime = 0;
                talkSound.play();
            }

        }
        
        for(var i=currentNPCPage*4;i<dialogBoxText.length;i++){
            if(drawnTextLength+dialogBoxText[i].length>displayedTextLength){
                //If we need to draw parts of line
                ctx.fillText(dialogBoxText[i].substring(0,displayedTextLength-drawnTextLength), parseInt(WIDTH/2)-100,HEIGHT-130+(i-currentNPCPage*4)*17);
                break;
            }else{
                //If we can draw the full line
                ctx.fillText(dialogBoxText[i], parseInt(WIDTH/2)-100,HEIGHT-130+(i-currentNPCPage*4)*17);
                drawnTextLength+=dialogBoxText[i].length;
            }
        }       


        if(!customDialog){
            ctx.drawImage(dialogAccDecImg, parseInt(WIDTH/2)-240,HEIGHT-200);
        }else{
            ctx.drawImage(dialogCloseImg, parseInt(WIDTH/2)-240,HEIGHT-200);
        }
    }

}
function Quest(id,name,text,requirements){
    this.id = id;
    this.name = name;
    this.text = text;
    this.requirements = requirements;
    this.requirementTexts = [];
    this.questCurrentPage = 0;
    this.init = function(){
        
    }
}

for(var i=0;i<quests.length;i++){
    for(var j=0;j<quests[i].requirements.length;j++){
        quests[i].requirementTexts.push( "- Collect "+quests[i].requirements[j].pieces+" "+quests[i].requirements[j].name+"s");
    }
    console.log(quests[i].requirementTexts);
  }

function QuestNPC(id,name,x,y,icon){
    this.id = id;
    this.name=name;
    this.x = x;
    this.y = y;
    this.iconNumber = icon;
    this.currentQuest = 0;
    this.questFinished = true;
    this.quests = [];
    this.draw = function(){
        
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.ellipse(this.x-viewportX+12, this.y-viewportY+48, 8, 5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        
        
        ctx.textAlign = "center";
        ctx.font = "10px Arial";
        var nameWidth = ctx.measureText(this.name).width;
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(this.x+13-nameWidth*1.2/2-viewportX,this.y-14-viewportY,nameWidth*1.2,12);
        ctx.fillStyle = "black";
        ctx.fillText(this.name,this.x+12-viewportX,this.y-4-viewportY);
        ctx.fillStyle = "lime";
        ctx.fillText(this.name,this.x+13-viewportX,this.y-5-viewportY);
        ctx.restore();
        ctx.drawImage(NPCImage, (this.iconNumber%8)*25, parseInt(this.iconNumber/8)*50, 25, 50,this.x-viewportX,this.y-viewportY ,25, 50)
        

    }
    this.checkPlayerCollision = function(){
        if(Math.pow((this.x+12)-(playerX+12),2)+Math.pow((this.y+50)-(playerY+30),2)<900){
            return true;
        }
        return false;
    }
}

var NPCs = [];//new QuestNPC(0,"Orvald",718,500,0), new QuestNPC(1,"Sarah",996,706,2), new QuestNPC(2,"John",3088, 1988,3), new QuestNPC(3,"Edward",3158,397,4)];
// player: {activatedQuestIds:[34,24,53], currentQuestIds:[31,53,23]}
//quest table:

//Quests = [{id:0,},{id:1},{id:2}]

//NPCs[0].quests.push(quests[0]);
//NPCs[0].quests.push(quests[1]);