/*
1. Code below is for https://youtu.be/D1ELEeIs0j8?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA
2. Code is at 7:57 seconds on drawing rectangle
*/

var socket;

function setup() {
  createCanvas(960,960);
  // black
  background(102);
	strokeWeight(20);
	stroke(255);
  // frameRate(5);

// socket = io.connect("https://drawing-demo.herokuapp.com/"); 
socket = io.connect("http://192.168.86.115:8080"); 
   
socket.on('mouse',newDrawing);

}

function newDrawing(data){
noStroke();
stroke(0);
line(data.x, data.y, data.px, data.py);


}

function touchMoved() {

  stroke(255);  
  line(mouseX, mouseY, pmouseX, pmouseY);
  console.log('Sending:' + mouseX + ',' + mouseY);

  var data = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY,
  }
  socket.emit('mouse', data);



}


function draw() {
  
}