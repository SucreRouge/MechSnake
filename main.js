var plr;
var gameDimmensions = [400,400];
var ctx;
var c;
var blockSize = 20
var key = 0;
var size = 4;
var food;
var nn;
var nnOld
var nnWinners
var stepNum = 0
var cn;
var ctxN;
var drawOutputs = [0,0,0]
activeOut = 3;
var stepLength = 200;
var fitness = 0;

var bestScore = 0;
var bestNNs

function rand(lower, upper){return Math.random()*(upper - lower)+lower}

function changeSpeed(){
	s = document.getElementById("speed").value
	stepLength = s

}

function initializeNetwork(){
	var inputs = [{"value":10},{"value":10},{"value":10}];
	var layer1 = [{"bias":-1,"weights":[Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random()]}]
	var layer2 = [{"bias":-1,"weights":[Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]},{"bias":-Math.random(),"weights":[Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]}]
	var outputs = [{"bias":-1,"weights":[Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]},{"bias":-1,"weights":[Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]}]
	var hiddenLayers = [layer1,layer2]
	nn = {"inputs":inputs, "hiddenLayers":hiddenLayers, "outputs":outputs}

	
	//n = new Neuron(Math.random(),2)
	//n.printStuff();
}


function main(){

	document.onkeydown = keyDown;
	document.getElementById("canvasPlaceHolder").innerHTML =
		 '<canvas id="myCanvas" width="' + gameDimmensions[0] + 'px" height="' + gameDimmensions[1] +'px" style="border:1px solid #ababab;float:left;"></canvas>' + 
		 '<canvas id="myNetwork" width="' + gameDimmensions[0]*2 + 'px" height="' + gameDimmensions[1]*2 +'px" style="border:1px solid #ababab;float:left;"></canvas><input type="text" id="speed" placeHolder="200" style="float:left"><button onClick="javascript:changeSpeed()">Change Speed</button>';

	initializeNetwork();
	cn = document.getElementById("myNetwork");
	ctxN = cn.getContext("2d");
	drawNodes();

	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	ctx.fillStyle = "#6AACAC";
	ctx.fillRect(0,0,gameDimmensions[0],gameDimmensions[1]);
	
	createPlayer();
	
	makeFood();
	step();
	
}

function gameOver(){
	stepNum = 0
	activeOut = 3;
	console.log("length" + stepLength)
	
	ctx.fillStyle = "#6AACAC";
	ctx.fillRect(0,0,gameDimmensions[0],gameDimmensions[1]);
	ctx.fillStyle = "#600CAC";
	ctx.font="20px Georgia";

	ctx.fillText("fitness: " + fitness,gameDimmensions[0]/2-30,gameDimmensions[1]/2)
	
	if(fitness <= 9){
		initializeNetwork();
	}

	fitness = 0
	createPlayer();
	makeFood();
	
	console.log("starting game again")

	setTimeout(step,stepLength*5)
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
	var notGameOver1 = obtainInput()
	var notGameOver2 = gamePhysics()
	//console.log(notGameOver1 + "  " + notGameOver2)
	if(notGameOver1 && notGameOver2){
		fitness++
		render()
		nn.inputs[0].value = Math.pow(plr.x-9,2)
		nn.inputs[1].value = Math.pow(plr.x-9,2)
		nn.inputs[2].value = 20
		//console.log(nn.inputs[0].value + "------------")
		setTimeout(step, stepLength)
		console.log("next step")
	}
	else{
		console.log("game ended")
		gameOver();
		
	}
	
}
var num = 0
function obtainInput(){
	/*if(key == 65){
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
	}*/

	outputs = computeOutputs();
	if(outputs[0] > outputs[1] && outputs[0] > outputs[2]){
		plr.direction++;
		num++;
		activeOut = 0
	}
	else if(outputs[1] > outputs[0] && outputs[1] > outputs[2]){
		plr.direction--;
		num++;
		activeOut = 1
	}
	else{
		num = 0
		activeOut = 2
	}
	if(num>9){
		//gameOver()
		num=0
		return false;
		console.log("pthtth")
	}
	//initializeNetwork()
	return true;

}

function computeOutputs(){
	var inputs = []
	for(var b = 0; b<nn.inputs.length; b++){
		inputs.push(nn.inputs[b].value)
	}


//	console.log(inputs)
	
		for(var nL = 0; nL<nn.hiddenLayers.length; nL++){
			var layer = nn.hiddenLayers[nL]
			var outputs = []

			for(var n = 0; n<layer.length; n++){
				var value = 0
				neuron = layer[n];
				for(var i = 0; i<inputs.length; i++ ){
					value+=inputs[i]*neuron.weights[i]
					//console.log("  n:" + n + " v: " + value + " vs: " + sigmoid(value))
				}

				value+=neuron.bias

			outputs.push(sigmoid(value))
			}
			inputs = outputs


		}
		var finalOutputs = []
		for(var n = 0; n<nn.outputs.length; n++){
			var value = 0
			neuron = nn.outputs[n];
			for(var i = 0; i<inputs.length; i++ ){
				value+=inputs[i]*neuron.weights[i]
			}

			value+=neuron.bias
			finalOutputs.push(sigmoid(value))


		}

		//console.log(finalOutputs)
		drawOutputs = finalOutputs
		return finalOutputs



	


}

function sig(x){

	return 1/(1()+Math.exp(x))
}

function sigmoid(x){
	return 1/(1+Math.exp(-x))

}

function gamePhysics(){
	
	if(plr.direction == 0 && plr.x < gameDimmensions[0]/blockSize-1){plr.x++;}
	else if(plr.direction == 2 && plr.x > 0){plr.x--;}
	else if(plr.direction == 1 && plr.y > 0){plr.y--;}
	else if(plr.direction == 3 && plr.y < gameDimmensions[1]/blockSize-1){plr.y++;}
	else if(plr.direction > 3 && plr.x < gameDimmensions[0]/blockSize-1){plr.direction = 0;plr.x++;}
	else if(plr.direction < 0 && plr.x < gameDimmensions[0]/blockSize-1){plr.direction = 3; plr.y++}
	else{
		console.log("----------")
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
			console.log("ran into a player piece")
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
	drawNodes();
	
}

function drawNodes(){
	ctxN.font="20px Georgia";
	ctxN.fillStyle = "#ffffff"

	var Width = gameDimmensions[0]*2
	var layers = nn.hiddenLayers.length + 2
	var colWidth = Width/layers
	var Height = gameDimmensions[1]*2
	ctxN.fillRect(0,0,Width,Height)
	var rowHeight = Height/nn.inputs.length
	for(var i = 0; i<nn.inputs.length; i++){
		ctxN.fillStyle = "#000000"
		ctxN.beginPath();
		ctxN.arc(colWidth/2,rowHeight*(i+.5),50,0,2*Math.PI);
		ctxN.fill();
		ctxN.fillStyle = "#ffffff"

		ctxN.fillText(nn.inputs[i].value,colWidth/2-15,rowHeight*(i+.5));

		for(var k = 0; k<nn.hiddenLayers[0].length;k++){
			ctxN.beginPath();

			ctxN.moveTo(colWidth/2+20,rowHeight*(i+.5))
			ctxN.lineTo(colWidth/2+colWidth*(1),Height/nn.hiddenLayers[0].length*(k+.5))
			ctxN.stroke();
		}

	}
	
	
	for(var l = 0; l<layers-2; l++){
		rowHeight = Height/nn.hiddenLayers[l].length
		for(var n = 0; n< nn.hiddenLayers[l].length; n++){
			ctxN.fillStyle = "#000000"
			ctxN.beginPath();
			ctxN.arc(colWidth/2 + colWidth*(l+1),rowHeight*(n+.5),50,0,2*Math.PI);
			ctxN.fill();
			ctxN.fillStyle = "#ffffff"

			//ctxN.fillText(nn.inputs[i].value-15,colWidth/2-15,rowHeight*(i+.5));
			if(l != layers-3){
				for(var k = 0; k<nn.hiddenLayers[1].length;k++){
					ctxN.beginPath();

					ctxN.moveTo(colWidth/2 + colWidth*(l+1),rowHeight*(n+.5))
					ctxN.lineTo(colWidth/2+colWidth*(2),Height/nn.hiddenLayers[0].length*(k+.5))
					ctxN.stroke();
				}
			}
			else{

				for(var o = 0; o<nn.outputs.length;o++){
					ctxN.beginPath();
					ctxN.moveTo(colWidth/2 + colWidth*(l+1),rowHeight*(n+.5))
					ctxN.lineTo(colWidth/2 + colWidth*(layers-1),Height/nn.outputs.length*(o+.5))
					ctxN.stroke();
				}

			}


		}
	}
	var rowHeight = Height/nn.outputs.length
	for(var o = 0; o<nn.outputs.length; o++){
		ctxN.fillStyle = "#000000"
		if(activeOut == o){ctxN.fillStyle = "#6AACAC"}
		ctxN.beginPath();
		ctxN.arc(colWidth/2 + colWidth*(layers-1),rowHeight*(o+.5),50,0,2*Math.PI);
		ctxN.fill();
		ctxN.fillStyle = "#ffffff"

		if(o == 0){ctxN.fillText("left",colWidth/2-15 + colWidth*(layers-1),rowHeight*(o+.5)+25);}
		else if(o == 1){ctxN.fillText("right",colWidth/2-20 + colWidth*(layers-1),rowHeight*(o+.5)+25);}
		else if(o == 2){ctxN.fillText("forward",colWidth/2-35 + colWidth*(layers-1),rowHeight*(o+.5)+25);}
		ctxN.fillText(drawOutputs[o],colWidth/2-40 + colWidth*(layers-1),rowHeight*(o+.5));

		//ctxN.fillText(nn.inputs[i].value-15,colWidth/2-15,rowHeight*(i+.5));

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
	plr.direction = 0   //0:0 Math.random():90 2:Math.random()80 3:270
	plr.bodySegmentsX = [plr.x,plr.x-1,plr.x-1,plr.x+1]
	plr.bodySegmentsY = [plr.y,plr.y,plr.y-1,plr.y+2]
	

}

main();