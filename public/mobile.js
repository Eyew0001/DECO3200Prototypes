
 function setup() {
     createCanvas(960, 960);
     background(102);
	strokeWeight(10)
	stroke(255);
}

function touchMoved() {
	line(mouseX, mouseY, pmouseX, pmouseY);
	return false;
}

