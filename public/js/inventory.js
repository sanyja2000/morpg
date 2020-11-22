var itemsImage = new Image();
itemsImage.src = "img/items/items.png";

var equipmentsImage = new Image();
equipmentsImage.src = "img/items/equipments.png";

var inventoryHudImage = new Image();
inventoryHudImage.src = "img/hud-inventory_h3.png";

var itemDescriptionImage = new Image();
itemDescriptionImage.src = "img/item_description.png";



var inventoryOpen = false;

function Item(name,iconNumber,equipment){
    this.name = name;
    this.equipment = equipment;
    this.iconNumber = iconNumber;
}

function DroppedItem(x,y,item){
    this.x = x;
    this.y = y;
    this.item = item;
    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle = "rgba(0,0,0,"+(0.4+Math.sin(gameFrameCount/20)/20)+")";
        ctx.ellipse(x-viewportX+12, y-viewportY+19, 8, 5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        drawItem(x-viewportX,y-viewportY+Math.sin(gameFrameCount/20)*3,item);
    }
    this.checkPlayerCollision = function(){
        if(Math.pow((this.x+12)-(playerX+12),2)+Math.pow((this.y+20)-(playerY+30),2)<200){
            return true;
        }
        return false;
    }
}

function checkPlayerCollisionWithDroppedItem(item){
    if(Math.pow((item.x+12)-(playerX+12),2)+Math.pow((item.y+20)-(playerY+30),2)<200){
        return true;
    }
    return false;
}


function showItemPopup(){

}

function drawDroppedItem(item){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,"+(0.4+Math.sin(gameFrameCount/20+item.x/200)/20)+")";
    ctx.ellipse(item.x-viewportX+12, item.y-viewportY+19, 8, 5, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
    //drawItem(item.x-viewportX,item.y-viewportY+Math.sin(gameFrameCount/20)*3,item);
    if(item.equipment){
        ctx.drawImage(equipmentsImage,(item.iconNumber%16)*19,parseInt(item.iconNumber/16)*19,19,19,item.x-viewportX,item.y-viewportY+Math.sin(gameFrameCount/20+item.x/200)*3,19,19);
    }
    else{
        ctx.drawImage(itemsImage,(item.iconNumber%16)*19,parseInt(item.iconNumber/16)*19,19,19,item.x-viewportX,item.y-viewportY+Math.sin(gameFrameCount/20+item.x/200)*3,19,19);
    }
}

var droppedItems;
//var droppedItems = [new DroppedItem(180,300,new Item("log",163,false)),new DroppedItem(400,240,new Item("log",163,false)),new DroppedItem(250,500,new Item("log",163,false))];

function drawItem(x,y,item,sizeMult=1){
    if(item.equipment){
        ctx.drawImage(equipmentsImage,(item.iconNumber%16)*19,parseInt(item.iconNumber/16)*19,19,19,x,y,19*sizeMult,19*sizeMult);
    }
    else{
        ctx.drawImage(itemsImage,(item.iconNumber%16)*19,parseInt(item.iconNumber/16)*19,19,19,x,y,19*sizeMult,19*sizeMult);
    }
}

var testX = 0;
var testY = 0;
var testSpace = 20;
var testColor = "black";


function playerInventory(){
    this.inventory = [];
    this.equipment = [];
    this.highlightedItem = -1;
    this.offset = 0;
    this.highlightedEquipment = -1;
    this.drawHUD = function(){ 
        ctx.textAlign = "left";
        if(inventoryOpen){
            if(this.offset<96){
                this.offset+=6;
            }
        }else{
            if(this.offset>0){
                this.offset-=6;
            }
            if(this.offset<0){
                this.offset = 0;
            }
        }
        ctx.drawImage(inventoryHudImage,5*WIDTH/6-80,HEIGHT-32-this.offset);
        for(var i=0;i<this.inventory.length;i++){
            if(this.inventory[i] == null){continue;}
            var line = parseInt(i/5);
            if(i==this.highlightedItem && inventoryOpen){
                //highlight duhhh
                ctx.fillStyle = "rgba(255,165,0,0.7)";
                ctx.fillRect(5*WIDTH/6-79+(i%5)*32,HEIGHT-9-this.offset+line*32,30,10);
            }
            drawItem(5*WIDTH/6-72+(i%5)*31,HEIGHT-30-this.offset+line*32,this.inventory[i]);
            if(this.inventory[i].pieces>1){
                ctx.save();
                ctx.fillStyle = "black";
                ctx.font = "10px Arial";
                ctx.textAlign = "center";
                ctx.fillText(this.inventory[i].pieces,5*WIDTH/6-72+(i%5)*32+8,HEIGHT-2-this.offset+line*32);
                ctx.restore();
            }
            
        }

        for(var i=0;i<this.equipment.length;i++){
            if(this.equipment[i] == null){continue;}
            if(i==this.highlightedEquipment && inventoryOpen){
                ctx.strokeStyle = "rgba(255,165,0,0.7)";
                ctx.lineWidth = 4;
                if(i==0){
                    ctx.beginPath();
                    ctx.arc(5*WIDTH/6+96,HEIGHT-15-this.offset+29*i,13,0,2*Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                }else{
                    ctx.strokeRect(5*WIDTH/6+84,HEIGHT-20-this.offset+29*i,23,22);
                }
            }
            //drawItem(5*WIDTH/6+85,HEIGHT+10-this.offset+29*i,this.equipment[i]);
            if(i==0){
                drawItem(5*WIDTH/6+85,HEIGHT-25-this.offset+29*i,this.equipment[i]);
            }else{
                drawItem(5*WIDTH/6+85,HEIGHT-20-this.offset+29*i,this.equipment[i]);
            }
        }
        //drawItem(WIDTH/2-72+1*31,HEIGHT-30,new Item("kalap",2,true));
        //drawItem(WIDTH/2-72+2*31,HEIGHT-30,new Item("kalap",23,true));
        //drawItem(WIDTH/2-72+3*31,HEIGHT-30,new Item("kalap",11));
        //ctx.strokeStyle = "white";
        //ctx.strokeRect(5*WIDTH/6-78+0*31,HEIGHT-10,30,8);
        if( ( (this.highlightedEquipment>-1 && this.equipment[this.highlightedEquipment]!=null) || (this.highlightedItem>-1  && this.inventory[this.highlightedItem]!=null) ) && inventoryOpen){
            ctx.drawImage(itemDescriptionImage,5*WIDTH/6-16,HEIGHT-160-this.offset);
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "orange";
            if(this.highlightedItem>-1){
                drawItem(5*WIDTH/6-16+22,HEIGHT-160-this.offset+6,this.inventory[this.highlightedItem],2);
                ctx.fillText(this.inventory[this.highlightedItem].name,5*WIDTH/6-16+44,HEIGHT-160-this.offset+60);
                if(this.inventory[this.highlightedItem].description){
                    ctx.font = "9px Arial";
                    ctx.textAlign = "left";
                    ctx.fillStyle = "#E69138";
                    for(var i=0;i<this.inventory[this.highlightedItem].description.length;i++){
                        ctx.fillText(this.inventory[this.highlightedItem].description[i],5*WIDTH/6-16+5,HEIGHT-160-this.offset+80+i*12);
                    }
                }
            }else{
                ctx.fillText(this.equipment[this.highlightedEquipment].name,5*WIDTH/6-16+44,HEIGHT-160-this.offset+60);
                drawItem(5*WIDTH/6-16+22,HEIGHT-160-this.offset+6,this.equipment[this.highlightedEquipment],2);
                if(this.equipment[this.highlightedEquipment].description){
                    ctx.font = "9px Arial";
                    ctx.textAlign = "left";
                    ctx.fillStyle = "#E69138";
                    for(var i=0;i<this.equipment[this.highlightedEquipment].description.length;i++){
                        ctx.fillText(this.equipment[this.highlightedEquipment].description[i],5*WIDTH/6-16+5,HEIGHT-160-this.offset+80+i*12);
                    }
                }
            }
        }
    };
}
var pInventory = new playerInventory();