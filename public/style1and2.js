/*
1. Code below is for https://youtu.be/D1ELEeIs0j8?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA
2. Code is at 7:57 seconds on drawing rectangle
*/

var socket;


var style1 = true;
var style2 = false;
var np = 300;
var startcol;
var number;


function setup() {
  createCanvas(960, 960);
  // black
  colorMode(HSB, 360);

  textAlign(CENTER);

  background(0);
  strokeWeight(20);
  stroke(255);
  noiseSeed(random(100));
  startcol = random(255);
  // frameRate(5);

  // socket = io.connect("https://drawing-demo.herokuapp.com/"); 
  socket = io.connect("http://192.168.86.115:8080");

  socket.on('mouse', newmouseDragged);
  socket.on('style',newmouseDragged);

  var button1 = createButton('click me');
  button1.position(19, 19);
  button1.mousePressed(changeStyle1);

  var button2 = createButton('click me2');
  button2.position(100, 19);
  button2.mousePressed(changeStyle2);

}
function newStyles() {
  var databool = {
    st1: style1,
    st2: style2,
  }
  socket.emit('style', databool);
}

function changeStyle1() {
  style1 = true;
  style2 = false;
  console.log("style1: " + style1);
console.log("style2: " + style2);
}

function changeStyle2() {
  style2 = true;
  style1 = false;
  console.log("style1: " + style1);
console.log("style2: " + style2);
}
/*
Frozen brush

Makes use of a delaunay algorithm to create crystal-like shapes.
I did NOT develop delaunay.js, and not sure who the author really is to give proper credit.

Controls:
	- Drag the mouse.
    - Press any key to toggle between fill and stroke.

Inspired by:
	Makio135's sketch www.openprocessing.org/sketch/385808

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

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




function draw() {

  if (style2) {
    if (frameCount % 8 == 0) {
      fill(0, 30);
      rect(0, 0, width, height);
    }
  }
  if (style1) {
    // Create fade effect.
    noStroke();
    fill(0, 30);
    rect(0, 0, width, height);
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


    

    noStroke();
    fill(255);

    text("Click and drag the mouse\nPress any key to change to fill/stroke", width / 2, height - 50);
  }





}



function newmouseDragged(dataset) {
  if (dataset.st1) {
    allParticles.push(new Particle(dataset.x, dataset.y, maxLevel));
  } else if (dataset.st2) {

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
    strokeWeight(0.5);
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
    strokeWeight(0.5);
    vertex(dataset.x, dataset.y);
    endShape();

  }
}

function mouseDragged() {
  if (style1) {
    allParticles.push(new Particle(mouseX, mouseY, maxLevel));
    
  } else if (style2) {
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
      vertex(mouseX + v.x, mouseY + v.y);
      if (i == 0) {
        sx = cx + v.x;
        sy = cy + v.y;
      }
    }

    var hue = cx / 10 - startcol;
    if (hue < 0) hue += 255;
    stroke(hue, 360, 360);
    strokeWeight(0.5);
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
    stroke(hue, 360, 360);
    strokeWeight(0.5);
    vertex(mouseX, mouseY);
    endShape();

  }

  var dataset = {
    x: mouseX,
    y: mouseY,
    st1: style1,
    st2: style2,
  }
  socket.emit('mouse', dataset);
  // console.log(dataset.st1);


}


function keyPressed() {
  useFill = !useFill;
}