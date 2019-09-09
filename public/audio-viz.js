var mic;




function setup() {
  createCanvas(960, 960);
  mic = new p5.AudioIn();
  mic.start();
  // getAudioContext().resume();

}

var allParticles = [];
var maxLevel = 5;
var useFill = false;

var data = [];
var num = Math.floor(Math.random() * (0 - 360 + 1)) + 360;


// Moves to a random direction and comes to a stop.
// Spawns other particles within its lifetime.
function Particle(x, y, level) {

  this.level = level;
  this.life = 0;

  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.level, 0, maxLevel, 5, 2));

  this.move = function () {
    this.life++;

    // Add friction.
    this.vel.mult(0.9);

    this.pos.add(this.vel);

    // Spawn a new particle if conditions are met.
    if (this.life % 10 == 0) {
      if (this.level > 0) {
        this.level -= 1;
        var newParticle = new Particle(this.pos.x, this.pos.y, this.level - 1);
        allParticles.push(newParticle);
      }
    }
  }
}


var vol;
var volarray = [];

function draw() {
  touchStarted();
  vol = mic.getLevel();
  volarray.push(Math.round (vol * 100) / 100 );

  // Create fade effect.
  noStroke();
  fill(0, 30);
  rect(0, 0, width, height);
  // console.log(frameCount);

  if (vol > 0.03) {
    console.log(vol);
    called = true;
    drawstuff();
  }
 

  
    // Move and spawn particles.
    // Remove any that is below the velocity threshold.
    for (var i = allParticles.length - 1; i > -1; i--) {
      allParticles[i].move();

      if (allParticles[i].vel.mag() < 0.01) {
        allParticles.splice(i, 1);
      }
    }

    if (allParticles.length > 0) {
      // Run script to get points to create triangles with.
      data = Delaunay.triangulate(allParticles.map(function (pt) {
        return [pt.pos.x, pt.pos.y];
      }));

      strokeWeight(0.1);

      // Display triangles individually.
      for (var i = 0; i < data.length; i += 3) {
        // Collect particles that make this triangle.
        var p1 = allParticles[data[i]];
        var p2 = allParticles[data[i + 1]];
        var p3 = allParticles[data[i + 2]];

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

        text(num, width / 2, height - 100);

        // Base its hue by the particle's life.
        if (useFill) {
          noStroke();
          fill(165 + p1.life * 1.5, 360, 360);
        } else {
          noFill();

          stroke(num, 360, 360);

        }

        triangle(p1.pos.x, p1.pos.y,
          p2.pos.x, p2.pos.y,
          p3.pos.x, p3.pos.y);
      }


    
  
    
  }

 

  noStroke();
  fill(255);

  text("Click and drag the mouse\nPress any key to change to fill/stroke", width / 2, height - 50);
  // called = false;

 

}


function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function drawstuff() {
  var num = Math.floor(Math.random() * (-700 - 700 + 1) ) + 700;
  var numy = Math.floor(Math.random() * (-700 - 700 + 1) ) + 700;
  if (volarray[volarray.length-1] != volarray[volarray.length-2]) {
    allParticles.push(new Particle(vol*10000 + num, vol*10000 + numy, 5));
  }


}