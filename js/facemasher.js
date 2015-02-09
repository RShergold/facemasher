var sparkUrl = "https://api.spark.io/v1/devices/53ff6e066667574856391267/sVal?access_token=465df82bef6c0da696e00d8d97b0a5b0217b0e55";

var sensor1Value;
var sensor2Value;
var switchValue;

var counter = 0;

var names = ["iain", "luke", "ruth"];
var numberOfFaces = names.length;
var sizeOfSegment = 102 / numberOfFaces;

function getValue(url) {
	var request = new XMLHttpRequest();
	var requestResult;
	var resultsArray;
	request.open('GET', url, true);
	request.responseType = 'json';

	request.onload = function(e) {

		requestResult = this.response;
		resultsArray = requestResult.result.split(',');

		sensor1Value = resultsArray[0];
		sensor2Value = resultsArray[1];
		switchValue = resultsArray[2];

		changeImages("spark", "face");
		changeImages("spark", "underlay");

		$('#debug-info').html('Sensor 1 Value: ' + sensor1Value + '<br>Sensor 2 Value: ' + sensor2Value + '<br>Switch Value: ' + switchValue);
	};
	request.send();	
}

// get the value from the spark at regular intervals 
function pollValue() {
	setTimeout(function(){ 
		counter++;

		if (counter > 0) {
			pollValue();		
			getValue(sparkUrl);
		}
 	}, 2000);
}

function changeImages(source, parameter) {
	var faceNumber;
	var underlayNumber;
	var switchNumber;

	if (parameter == "face") {
		if (source == "browser") {
			faceNumber = $('#face-select').val();
		}
		else {
			var inputPosition = 0;

			for(var i = 0; i <= numberOfFaces; i++) {
				inputPosition += sizeOfSegment;
				if (sensor1Value <= inputPosition) {
					faceNumber = i;
					break;
				}
			}
		}
		$("#base").attr("src", getFileName(faceNumber, "base"));
	}
	else {
		if (source == "browser") {
			underlayNumber = $('#features-select').val();
			switchNumber = $('#mood-select').val();
			console.log("underlayNumber: " + underlayNumber);
		}
		else {
			var input2Position = 0;

			for(var i = 0; i <= numberOfFaces; i++) {
				input2Position += sizeOfSegment;
				if (sensor2Value <= input2Position) {
					underlayNumber = i;
					break;
				}
			}

			switchNumber = switchValue;

		}

		if (switchNumber == 1) {
			$("#underlay").attr("src", getFileName(underlayNumber, "happy"));
		} 
		else {
			$("#underlay").attr("src", getFileName(underlayNumber, "sad"));
		}
	}
}
	
function getFileName(faceNumber, type) {
	var fileName;

	switch(type) {
		case "base":
			fileName = "img/" + names[faceNumber] + "_face.png";
			break;
		case "happy":
			fileName = "img/" + names[faceNumber] + "_happy.jpg";
			break;
		case "sad":
			fileName = "img/" + names[faceNumber] + "_sad.jpg";
			break;
	}

	return fileName;
}

$('#useSpark').click(function() {
	pollValue();
	console.log("started polling " + sparkUrl);
});


