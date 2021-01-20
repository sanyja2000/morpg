function QuestLog(){
    this.bgImg = new Image();
    this.bgImg.src = "img/questlog2.png";
    this.visible = false;
    this.highlightedQuest = 0;
    this.draw = function(){
        ctx.drawImage(this.bgImg, WIDTH/2-300,HEIGHT/2-200);

        if(acceptedQuestIds.length==0){
            ctx.fillStyle = "#7c2f21";
            ctx.font = "12px Arial bold";
            ctx.textAlign = "center";
            ctx.fillText("You don't have any accepted quests right now.",WIDTH/2+80,HEIGHT/2-140);
            return;
        }

        for(var i=0;i<acceptedQuestIds.length;i++){
            
            if(i==this.highlightedQuest){
                ctx.fillStyle = "#a85e3c";
                ctx.fillRect(WIDTH/2-280,HEIGHT/2-145+i*40,157,34);


                ctx.fillStyle = "#7c2f21";
                ctx.font = "12px Arial bold";

                ctx.fillText(quests[acceptedQuestIds[i]].name,WIDTH/2-90,HEIGHT/2-150);

                
                ctx.font = "11px Arial";



                for(var j=0;j<quests[i].text.length;j++){
                    ctx.fillText(quests[acceptedQuestIds[i]].text[j],WIDTH/2-90,HEIGHT/2-130+j*16);
                }

            }

            ctx.textAlign = "left";
            
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(quests[acceptedQuestIds[i]].name, WIDTH/2-270, HEIGHT/2-125+i*40);

            
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#663931";
            ctx.strokeRect(WIDTH/2-280,HEIGHT/2-110+i*40,157,1);
            ctx.strokeStyle = "#764232";
            ctx.strokeRect(WIDTH/2-280,HEIGHT/2-110+i*40+1,157,1);
            /*
            ctx.font = "9px Arial";
            for(var j=0;j<quests[acceptedQuestIds[i]].requirementTexts.length;j++){
              ctx.fillText(quests[acceptedQuestIds[i]].requirementTexts[j], WIDTH/2-220, HEIGHT/2-80+i*20+j*15);
            }
            */
        }

    }

}


var pQuestlog = new QuestLog();