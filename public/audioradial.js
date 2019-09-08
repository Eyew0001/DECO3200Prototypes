var mic;
var volhistory = [];
var vol;

function setup() {
  createCanvas(960, 960);
  colorMode(HSB);
  angleMode(DEGREES);
  mic = new p5.AudioIn();
  mic.start();
  // getAudioContext().resume();

}
var token = 0.5;
var num = Math.floor(Math.random() * (40 - 360 + 1)) + 360;

function draw() {


  background(0);
  touchStarted();
  vol = mic.getLevel();
  volhistory.push(vol);
  stroke(num, num, num);
  // Array(360).fill(0);
  // fill(num,num,num);
  noFill();
  console.log(num);
  if (num < 360) {
    num += token;
  }
  if (num > 350 || num < 40) {
    token = -token;
  }

  translate(960 / 2, 660 / 2);
  beginShape();
  for (var i = 0; i < 360; i++) {
    var r = map(volhistory[i], 0, 0.01, 150, 300);
    var x = r * cos(i);
    var y = r * sin(i);
    // var y = map(volhistory[i], 0, 0.1, 960/2, 50);
    vertex(x, y);
  }
  endShape();

  if (volhistory.length > 360) {
    volhistory.splice(0, 1);
  }

}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}