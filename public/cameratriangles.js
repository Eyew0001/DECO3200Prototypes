// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 16-13: Simple motion detection

// Variable for capture device
var video;
// Previous Frame
var prevFrame;
// How different must a pixel be to be a "motion" pixel
var threshold = 50;

var motionX = 0;
var motionY = 0;

var lerpX = 0;
var lerpY = 0;

var prevlerpX = [];
var prevlerpY = [];

function setup() {
  createCanvas(480,360);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // Create an empty image the same size as the video
  prevFrame = createImage(video.width, video.height, RGB);
}

var allParticles = [];
var maxLevel = 5;
var useFill = false;

var data = [];
var num = Math.floor(Math.random() * (0 - 360 + 1) ) + 360;


// Moves to a random direction and comes to a stop.
// Spawns other particles within its lifetime.
function Particle(x, y, level) {
  
  this.level = level;
  this.life = 0;
  
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.level, 0, maxLevel, 5, 2));
  
  this.move = function() {
    this.life++;
    
    // Add friction.
    this.vel.mult(0.9);
    
    this.pos.add(this.vel);
    
    // Spawn a new particle if conditions are met.
    if (this.life % 10 == 0) {
      if (this.level > 0) {
        this.level -= 1;
        var newParticle = new Particle(this.pos.x, this.pos.y, this.level-1);
        allParticles.push(newParticle);
      }
    }
  }
}

function draw() {
  image(prevFrame, 0, 0);
  var count = 0;
  
  var avgX = 0;
  var avgY = 0;

  loadPixels();
  video.loadPixels();
  prevFrame.loadPixels();

  // Begin loop to walk through every pixel
  
  for (var x = 0; x < video.width; x++) {
    for (var y = 0; y < video.height; y++) {

      // Step 1, what is the location into the array
      var loc = (x + y * video.width) * 4;
      
      // Step 2, what is the previous color
      var r1 = prevFrame.pixels[loc   ]; 
      var g1 = prevFrame.pixels[loc + 1];
      var b1 = prevFrame.pixels[loc + 2];

      // Step 3, what is the current color
      var r2 = video.pixels[loc   ]; 
      var g2 = video.pixels[loc + 1];
      var b2 = video.pixels[loc + 2];

      // Step 4, compare colors (previous vs. current)
      var diff = dist(r1, g1, b1, r2, g2, b2);

      // Step 5, How different are the colors?
      // If the color at that pixel has changed, then there is motion at that pixel.
      if (diff > threshold) { 
        // If motion, display black
        // pixels[loc] = 0;
        // pixels[loc+1] = 0;
        // pixels[loc+2] = 0;
        // pixels[loc+3] = 255;
        avgX += x;
        avgY += y;
        count++;
        
      } else {
        // If not, display white
        pixels[loc] = 255;
        pixels[loc+1] = 255;
        pixels[loc+2] = 255;
        pixels[loc+3] = 255;
      }
    }
  }
  updatePixels();

  // Save frame for the next cycle
  //if (video.canvas) {
    prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // Before we read the new frame, we always save the previous frame for comparison!
  //}
  // console.log(count);
  if (count > 200) { 
    motionX = avgX / count;
    motionY = avgY / count;
    // Draw a circle at the tracked pixel
  }

  lerpX = lerp(lerpX, motionX, 0.6); 
  lerpY = lerp(lerpY, motionY, 0.6); 

  prevlerpX.push(Math.round (lerpX * 100) / 100 );
  prevlerpY.push(Math.round (lerpY * 100) / 100 );
  
  // fill(255, 0, 255);
  // strokeWeight(2.0);
  // stroke(0);
  // ellipse(lerpX, lerpY, 36, 36);

  
  // Create fade effect.
  noStroke();
  fill(0, 30);
  rect(0, 0, width, height);
  
  // Move and spawn particles.
  // Remove any that is below the velocity threshold.
  for (var i = allParticles.length-1; i > -1; i--) {
    allParticles[i].move();
    
    if (allParticles[i].vel.mag() < 0.01) {
      allParticles.splice(i, 1);
    }
  }
  
  if (allParticles.length > 0) {
    // Run script to get points to create triangles with.
    data = Delaunay.triangulate(allParticles.map(function(pt) {
      return [pt.pos.x, pt.pos.y];
    }));
  	
    strokeWeight(0.9);
    
    // Display triangles individually.
    for (var i = 0; i < data.length; i += 3) {
      // Collect particles that make this triangle.
      var p1 = allParticles[data[i]];
      var p2 = allParticles[data[i+1]];
      var p3 = allParticles[data[i+2]];
      
      // Don't draw triangle if its area is too big.
      var distThresh = 75;
      
      if (dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThresh) {
        continue;
      }
      
      if (dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
        continue;
      }
      
      if (dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
        continue;
      }
      
      // text(num,width/2, height-100);
  
      // Base its hue by the particle's life.
      if (useFill) {
        noStroke();
        fill(165+p1.life*1.5, 360, 360);
      } else {
        noFill();

        stroke(num, 360, 360);

      }
     
      triangle(p1.pos.x, p1.pos.y, 
               p2.pos.x, p2.pos.y, 
               p3.pos.x, p3.pos.y);
    }

   
  }
  drawstuff();
  // noStroke();
  fill(255);
 

}

function drawstuff() {

  // var volbig = vol * 10000;
if (prevlerpX[prevlerpX.length-1] != prevlerpX[prevlerpX.length-2] && prevlerpY[prevlerpY.length-1] != prevlerpY[prevlerpY.length-2]) {
  allParticles.push(new Particle(lerpX, lerpY, 5));
  console.log("X: " + lerpX);
  console.log("Y: " + lerpY);
  console.log("prevlerpX array: " + prevlerpX);
  // console.log("prevlerpX: " + prevlerpX[frameCount]);
  console.log("prevlerpX current: " + prevlerpX[prevlerpX.length-1]);
}
  


}

