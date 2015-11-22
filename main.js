var plr;
var gameDimmensions = [400,400];
var ctx;
var c;
var blockSize = 20
var key = 0;
var size = 4;
var food;
function main(){
	document.onkeydown = keyDown;
	document.getElementById("canvasPlaceHolder").innerHTML =
		 '<canvas id="myCanvas" width="' + gameDimmensions[0] + 'px" height="' + gameDimmensions[1] +'px" style="border:1px solid #ababab;float:left;"></canvas>';


	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	ctx.fillStyle = "#6AACAC";
	ctx.fillRect(0,0,gameDimmensions[0],gameDimmensions[1]);
	
	createPlayer();
	makeFood();
	step();
	
}

function makeFood(){
	var goodCoords = []
	for(var row = 0; row< gameDimmensions[1]/blockSize; row++){
		for(var col = 0; col < gameDimmensions[0]/blockSize; col++){
			var i = plr.bodySegmentsY.indexOf(row)
			var j = plr.bodySegmentsX.indexOf(row)
			if(i+j < -1){
				goodCoords.push({"x":col,"y":row})
			}

		}
	}
	if(goodCoords.length == 0){
		alert("you win")
	}
	var rand = Math.floor((Math.random() * goodCoords.length));
	food = goodCoords[rand]


}

function step(){
	obtainInput()
	var notGameOver = gamePhysics()
	
	
	

	
	if(notGameOver){
		render()
		setTimeout(step, 200)
	}
	else{
		main();
	}
	
}

function obtainInput(){
	if(key == 65){
		plr.direction++;
		key = 0
	}
	else if(key == 68){
		plr.direction --;
		key = 0
	}
	if(plr.direction < 0){
		plr.direction = 3;
	}
	else if(plr.direction > 3){
		plr.direction = 0;
	}

}
function gamePhysics(){
	
	if(plr.direction == 0 && plr.x < gameDimmensions[0]/blockSize-1){plr.x++;}
	else if(plr.direction == 2 && plr.x > 0){plr.x--;}
	else if(plr.direction == 1 && plr.y > 0){plr.y--;}
	else if(plr.direction == 3 && plr.y < gameDimmensions[1]/blockSize-1){plr.y++;}
	else{
		
		
		return false;
	}

	if(plr.x == food.x && plr.y == food.y){
		makeFood();


	}
	else{
		plr.bodySegmentsX.splice(plr.bodySegmentsX.length-1,1)
		plr.bodySegmentsY.splice(plr.bodySegmentsY.length-1,1)

	}
	plr.bodySegmentsX.unshift(plr.x)
	
	plr.bodySegmentsY.unshift(plr.y)

	for(var i = 1; i<plr.bodySegmentsX.length; i++){
		if(plr.x == plr.bodySegmentsX[i] && plr.y == plr.bodySegmentsY[i]){
			return false;
		}
	}


	return true;
}

function render(){
	ctx.fillStyle = "#6AACAC";
	ctx.fillRect(0,0,gameDimmensions[0],gameDimmensions[1]);
	ctx.fillStyle = "#883322";

	ctx.fillRect(food.x*blockSize,food.y*blockSize,blockSize,blockSize);
	ctx.fillStyle = "#005500";
	for(var i = 0; i<plr.bodySegmentsX.length; i++){
		ctx.fillRect(plr.bodySegmentsX[i]*blockSize,plr.bodySegmentsY[i]*blockSize,blockSize,blockSize);
		ctx.fillStyle = "#009900";

	}
	
}

function keyDown(e){
	
	value = e.keyCode
	if(key == 0 && (value == 65 || value == 68) ){
		key = value
	}
	
}


function createPlayer(){
	plr = {}
	plr.ScreenX = gameDimmensions[0]/2
	plr.ScreenY = gameDimmensions[1]/2
	plr.x = plr.ScreenX/blockSize
	plr.y = plr.ScreenY/blockSize
	plr.direction = 0   //0:0 1:90 2:180 3:270
	plr.bodySegmentsX = [plr.x,plr.x-1,plr.x-1,plr.x+1]
	plr.bodySegmentsY = [plr.y,plr.y,plr.y-1,plr.y+2]
	

}

main();