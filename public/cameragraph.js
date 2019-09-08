var video;

function setup() {
  // createCanvas(windowWidth,windowWidth/1.3); //for full screen
  createCanvas(960, 720); //for small screen
  video = createCapture(VIDEO);
  // video.size(width,width/1.3);
  video.hide();
}

function draw() {
  push();
  translate(width, 0);
  scale(-1, 1); // You had it right!
  image(video, 0, 0, width, height);
  pop();


}