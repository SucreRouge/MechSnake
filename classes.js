
function Neuron(weights,bias){
	//var weights[]
	//var bias" value	
		this.weights = weights;
		this.bias = bias
}
	Neuron.prototype.value = function(){
		

		
	}


var neuronLayerInputs
function NeuronLayer(neurons){
	
	this.neurons = neurons;

	this.activateLayer = function(){
		var outputs = []
		for(var n = 0; n<this.neurons.length; i++){
			outputs.push(this.neurons[n].value())
		}
		console.log("hey")
		return outputs;
	}


	this.toString = function(){
		var str = ""
		for(var n in this.neurons){
			var neuron = this.neurons[n];
			str+= "{ weights: " + neuron.weights +  "}"
		}
		return str
	}



}





function NeuralNetwork(hiddenLayerData, outputs){

	this.neuronLayers = []
	this.numHiddenLayers = hiddenLayerData.length

	for(var i = 0; i< this.numHiddenLayers; i++){
	 	var hiddenLayer = []
	 	for(var j = 0;j<hiddenLayerData[i];j++){
	 		hiddenLayer.push(new Neuron(1,2))
	 	}
	 	this.neuronLayers.push(new NeuronLayer(hiddenLayer))

	}
	this.neuronLayers.push(outputs)

	




	
}

function calculateOutput(inputs,network){//it will set the input values returns [outputs]
		/*for(var n in this.neuronLayers){
			var nL = this.neuronLayers[n];
			console.log(nL.toString())
		}*/

		console.log(network.neuronLayers[0])

		for(var nL = 0; nL<network.neuronLayers.length; nL++){
			var n = network.neuronLayers[nL]
			
			inputs = NeuronLayer.activateLayer
		}
		return inputs;



	}



	
