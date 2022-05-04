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

            if(result.map.layer.length==4){
                var tmpcol = result.map.layer[3].data[0]._.split("\r\n").slice(1,result.map.layer[2].data[0]._.length);
            }else{
            var tmpcol = result.map.layer[2].data[0]._.split("\r\n").slice(1,result.map.layer[2].data[0]._.length);
            }
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
                    map.grid[i][j] = [0,0,"x"]; //f,g,w->top,right,bottom,left
                } 
            }



            //console.log(map.collisionLayer);
        }
        else {
            console.log(error);
        }
    });
}

function findPathToTarget(from, target, map){

    // USAGE: console.log(mapClass.findPathToTarget([1,3],[17,8],maps[2]));


    //from, target tile on map.grid
    // grid->f,g,w->top,right,bottom,left
    var start = from.slice().reverse().join(",");//[3,2].join(",");
    var end = target.slice().reverse().join(",");//[10,7].join(",");
    var endArr = target.slice().reverse();//[10,7];

    var path = [];
    var openSet = [start];
    var closedSet = [];
    while(openSet.length>0 && path.length==0){
        
        var winner = 0;
        for(var i=0;i<openSet.length;i++){
            if(openSet[i][0] < openSet[winner][0]){//f
                winner = i;
            }
        }
        var current = openSet[winner];
        
        if(current == end){
            path = [];
            var temp = current;
            path.push(temp);
            var tempArr = temp.split(",").map(Number);
            
            var gridSpace = map.grid[tempArr[0]][tempArr[1]];
            while(gridSpace[2]!="x"){
                var prev = "";
                if(gridSpace[2]==0){
                    prev = [tempArr[0],tempArr[1]+1].join(",");
                }
                if(gridSpace[2]==1){
                    prev = [tempArr[0]+1,tempArr[1]].join(",");
                }
                if(gridSpace[2]==2){
                    prev = [tempArr[0],tempArr[1]-1].join(",");
                }
                if(gridSpace[2]==3){
                    prev = [tempArr[0]-1,tempArr[1]].join(",");
                }
                path.push(prev);
                temp = prev;
                tempArr = temp.split(",").map(Number);
                gridSpace = map.grid[tempArr[0]][tempArr[1]];
                
            }
            /*
            for(var x=0;x<map.grid.length;x++){
                var str = "";
                for(var y=0;y<map.grid[x].length;y++){
                    if(path.includes([x,y].join(","))){
                        str+="P ";
                    }else{
                        //str+=map.grid[x][y][2]+" ";
                        try{
                        str += (map.collisionLayer[x][y]!=0 ? "W" : ".") + " ";
                        }
                        catch{
                            str+="f ";
                        }
                    }
                }
                console.log(str);
            }
            */
            console.log("done");
            return path;
            
        }
        openSet.splice(winner,1);
        closedSet.push(current);
        //for(var i=0;i<current.neighbors.length;i++){
        currentArr = current.split(",").map(Number); // '1,4' => [1,4]
        
        //Handling neighbors, TODO optimize
        var neighbors = [];
        var w = [];
        if(currentArr[1]>0){
            neighbors.push([currentArr[0],currentArr[1]-1].join(","));
            w.push(0);
        }
        if(currentArr[0]<map.width-1){
            neighbors.push([currentArr[0]+1,currentArr[1]].join(","));
            w.push(3);
        }
        if(currentArr[1]<map.height-1){
            neighbors.push([currentArr[0],currentArr[1]+1].join(","));
            w.push(2);
        }
        if(currentArr[0]>0){
            neighbors.push([currentArr[0]-1,currentArr[1]].join(","));
            w.push(1);
        }
        
        

        for(var i=0;i<neighbors.length;i++){
            var neighbor = neighbors[i].split(",").map(Number);
            console.log(neighbor[0],neighbor[1]);
            gridSpace = map.grid[neighbor[0]][neighbor[1]];
            if(!closedSet.includes(neighbors[i])){ //&& !(map.collisionLayer[neighbor[0]][neighbor[1]]!=0 && map.walkableLayer[neighbor[0]][neighbor[1]]==0)){// && !(map.walkableLayer[neighbor[1]][neighbor[0]]==0 && map.collisionLayer[neighbor[1]][neighbor[0]]!=0)){//&& !(layerContents[2][current.neighbors[i].y*mapWidth+current.neighbors[i].x]!=0 && layerContents[1][current.neighbors[i].y*mapWidth+current.neighbors[i].x]==0)){
                var tempG = map.grid[currentArr[0]][currentArr[1]][1]+1;
                if(openSet.includes(neighbors[i])){

                    if(tempG< gridSpace[1]){
                        gridSpace[1] = tempG;
                    }
                }else{
                    gridSpace[1] = tempG;
                    openSet.push(neighbors[i]);
                    
                }
                
                var h = Math.abs(neighbor[0]-endArr[0])+Math.abs(neighbor[1]-endArr[1]);
                gridSpace[0] = gridSpace[1] + h;

                gridSpace[2] = w[i]; //direction
            }
        }
        if(openSet.length==0){
            console.log("no solution");
            return false;
        }
    }



}

module.exports = {
    processMapLayers,
    findPathToTarget
};