var mic;
var volhistory = [];
var vol;

function setup() {
  createCanvas(960, 960);
  colorMode(HSB);
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
  stroke(num,num,num);
  noFill();
  if (num < 360) {
    num += token;
  }
  if (num > 350 || num < 40) {
    token = -token;
  }
  beginShape();
  for (var i = 0; i < volhistory.length; i++) {
    var y = map(volhistory[i], 0, 0.1, 960 / 2, 50);
    vertex(i, y);
  }
  endShape();

  if (volhistory.length > 960) {
    volhistory.splice(0, 1);
  }

}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}