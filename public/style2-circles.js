/*
1. Code below is for https://youtu.be/D1ELEeIs0j8?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA
2. Code is at 7:57 seconds on drawing rectangle
*/

var socket;

function setup() {

	// black
	colorMode(HSB, 360);

	textAlign(CENTER);

	background(0);
	strokeWeight(50);
	stroke(255);
	// frameRate(5);

	// socket = io.connect("https://drawing-demo.herokuapp.com/"); 
	
	// socket.on('mouse', newmouseDragged);



}


var np = 300;
var startcol;
var number;

function setup() {
	createCanvas(960, 960);
	background(0);
	noFill();
	noiseSeed(random(100));
	startcol = random(255);
	socket = io.connect("http://192.168.86.115:8080");

	socket.on('mouse',newmouseDragged);

}

function draw() {
	if (frameCount % 8 == 0) {
		fill(0, 30);
		rect(0, 0, width, height);
	  }
	  console.log(frameCount);
	number = Math.floor(Math.random() * (-20 - 20 + 1)) + 20;
}

function newmouseDragged(dataset) {

	noFill();
    colorMode(HSB, 360);
    // background(51);
    beginShape();
    var sx, sy;
    for (var i = 0; i < np; i++) {
      var angle = map(i, 0, np, 0, TWO_PI);
      var cx = frameCount * 2 - 200;
      var cy = height / 2 + 50 * sin(frameCount / 50);
      var xx = 50 * cos(angle + cx / 100);
      var yy = 50 * sin(angle + cx / 10);
      var v = createVector(xx, yy);
      xx = (xx + cx) / 150;
      yy = (yy + cy) / 150;
      v.mult(2 * noise(xx, yy));
      vertex(dataset.x + v.x, dataset.y+ v.y);
      if (i == 0) {
        sx = cx + v.x;
        sy = cy + v.y;
      }
    }

    var hue = cx / 10 - startcol;
    if (hue < 0) hue += 255;
    stroke(hue, 360, 360);
    strokeWeight(0.2);
    vertex(dataset.x, dataset.y);
    endShape();

    // background(51);
    beginShape();
    var sx, sy;
    for (var i = 0; i < np; i++) {
      var angle = map(i, 0, np, 0, TWO_PI);
      var cx = frameCount * 2 - 200;
      var cy = height / 2 + 50 * sin(frameCount / 50);
      var xx = 50 * sin(angle + cx / 100);
      var yy = 50 * cos(angle + cx / 10);
      var v = createVector(xx, yy);
      xx = (xx + cx) / 150;
      yy = (yy + cy) / 100;
      v.mult(2 * noise(xx, yy));
      vertex(dataset.x + v.x - number, dataset.y+ v.y + number);
      if (i == 0) {
        sx = cx + v.x;
        sy = cy + v.y;
      }
    }

    var hue = cx / 10 - startcol;
    if (hue < 0) hue += 255;
    stroke(hue, 360, 360);
    strokeWeight(0.2);
    vertex(dataset.x, dataset.y);
    endShape();
    if (frameCount > width + 500) {
      noLoop();
    }
}

function mouseDragged() {

	// background(51);
	beginShape();
	var sx, sy;
	for (var i = 0; i < np; i++) {
		var angle = map(i, 0, np, 0, TWO_PI);
		var cx = frameCount * 2 - 200;
		var cy = height / 2 + 50 * sin(frameCount / 50);
		var xx = 50 * cos(angle + cx / 100);
		var yy = 50 * sin(angle + cx / 10);
		var v = createVector(xx, yy);
		xx = (xx + cx) / 150;
		yy = (yy + cy) / 150;
		v.mult(2 * noise(xx, yy));
		vertex(mouseX + v.x, mouseY + v.y);
		if (i == 0) {
			sx = cx + v.x;
			sy = cy + v.y;
		}
	}

	var hue = cx / 10 - startcol;
	if (hue < 0) hue += 255;
	stroke(hue, 100, 120);
	strokeWeight(0.2);
	vertex(mouseX, mouseY);
	endShape();


	// background(51);
	beginShape();
	var sx, sy;
	for (var i = 0; i < np; i++) {
		var angle = map(i, 0, np, 0, TWO_PI);
		var cx = frameCount * 2 - 200;
		var cy = height / 2 + 50 * sin(frameCount / 50);
		var xx = 50 * sin(angle + cx / 100);
		var yy = 50 * cos(angle + cx / 10);
		var v = createVector(xx, yy);
		xx = (xx + cx) / 150;
		yy = (yy + cy) / 100;
		v.mult(2 * noise(xx, yy));
		vertex(mouseX + v.x - number, mouseY + v.y + number);
		if (i == 0) {
			sx = cx + v.x;
			sy = cy + v.y;
		}
	}

	var hue = cx / 10 - startcol;
	if (hue < 0) hue += 255;
	stroke(hue, 100, 120);
	strokeWeight(0.2);
	vertex(mouseX, mouseY);
	endShape();



	var dataset = {
		x: mouseX,
		y: mouseY,
	}
	socket.emit('mouse', dataset);

}