const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

// this example reads the file synchronously
// you can read it asynchronously also


function processMapLayers(map){

    let xml_string = fs.readFileSync("public/tiled/"+map.file, "utf8");

    parser.parseString(xml_string, function(error, result) {
        if(error === null) {
            map.width = result.map.ATTR.width;
            map.height = result.map.ATTR.height;
            map.walkableLayer = [];
            
            var tmpwalk = result.map.layer[1].data[0]._.split("\r\n").slice(1,result.map.layer[1].data[0]._.length);//result.map.layer[1].data[0]._.slice(1,result.map.layer[1].data[0]._.length);

            for(var i=0;i<tmpwalk.length;i++){
                if(tmpwalk[i]==''){continue;}
                if(tmpwalk[i][tmpwalk[i].length-1]==","){
                    map.walkableLayer.push(tmpwalk[i].substr(0,tmpwalk[i].length-1).split(",").map(Number));
                }else{
                    map.walkableLayer.push(tmpwalk[i].split(",").map(Number));
                }
            }


            var tmpcol = result.map.layer[2].data[0]._.split("\r\n").slice(1,result.map.layer[2].data[0]._.length);
            map.collisionLayer = [];
            for(var i=0;i<tmpcol.length;i++){
                if(tmpcol[i]==''){continue;}
                if(tmpcol[i][tmpcol[i].length-1]==","){
                    map.collisionLayer.push(tmpcol[i].substr(0,tmpcol[i].length-1).split(",").map(Number));
                }else{
                    map.collisionLayer.push(tmpcol[i].split(",").map(Number));
                }
            }
            map.grid = [];
            for(var i = 0;i<map.width;i++){
                map.grid.push(new Array(map.height));
            }
            for(var i = 0;i<map.width;i++){
                for(var j = 0;j<map.height;j++){
                    map.grid[i][j] = new Spot(i,j); 
                } 
            }
            for(var i = 0;i<map.width;i++){
                for(var j = 0;j<map.height;j++){
                    map.grid[i][j].addNeighbors(map.grid);
                } 
            }



            
        }
        else {
            console.log(error);
        }
    });
}

function Spot(a,b){
    this.x = a;
    this.y = b;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.previous = undefined;
    this.neighbors = [];
    this.addNeighbors = function(grid){
        if(this.x>0){
            this.neighbors.push(grid[this.x-1][this.y]);
        }
        if(this.x<grid.length-1){
            this.neighbors.push(grid[this.x+1][this.y]);
        }
        if(this.y>0){
            this.neighbors.push(grid[this.x][this.y-1]);
        }
        if(this.y<grid[0].length-1){
            this.neighbors.push(grid[this.x][this.y+1]);
        }

    }
}



function findPathToTarget(from, target, map){
    var grid = map.grid;


    var openSet = [];
    var path = [];
    
    var closedSet = [];
    var start = map.grid[from[0]][from[1]];
    var end = map.grid[target[0]][target[1]];
    
    openSet.push(start);

    while(openSet.length>0 && path.length==0){
        if(openSet.length==0){
            console.log("no solution");
            break;
        }
        var winner = 0;
        for(var i=0;i<openSet.length;i++){
            if(openSet[i].f < openSet[winner].f){
                winner = i;
            }
        }
        var current = openSet[winner];
        
        if(current == end){

            path = [];
            var temp = current;
            path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp = temp.previous;
            }
            console.log("done");
            return path;
            
        }
        openSet.splice(winner,1);
        closedSet.push(current);
        for(var i=0;i<current.neighbors.length;i++){
            if(!closedSet.includes(current.neighbors[i])){// && !(layerContents[2][current.neighbors[i].y*mapWidth+current.neighbors[i].x]!=0 && layerContents[1][current.neighbors[i].y*mapWidth+current.neighbors[i].x]==0)){
                var tempG = current.g+1;

                if(openSet.includes(current.neighbors[i])){
                    if(tempG< current.neighbors[i].g){
                        current.neighbors[i].g = tempG;
                    }
                }else{
                    current.neighbors[i].g = tempG;
                    openSet.push(current.neighbors[i]);
                    console.log(openSet.length);
                    
                }
                current.neighbors[i].h = Math.abs(current.neighbors[i].x-end.x)+Math.abs(current.neighbors[i].y-end.y);
                current.neighbors[i].f = current.neighbors[i].g + current.neighbors[i].h;
                current.neighbors[i].previous = current;
            }
        }

    }

    console.log("nope");
    return [0,0];
}


module.exports = {
    processMapLayers,
    findPathToTarget
};