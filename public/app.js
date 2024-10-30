
let socket = io();

let myRed, myGreen, myBlue;
let myDiameter;

let shapes = [];
let nuParticles = 5000; 
let mouseThreshold = 50;
let moveDistance = 150;
let animateDistance = 50;


socket.on('connect', () => {
    console.log("Connected");
  });

socket.on('message-share', (data) => {
    console.log(data);
    drawEllipse(data);
  });

function drawEllipse(obj) {
    let h = hour();
    let m = minute();
    let d = day();
    let mo = month();
    let ye = year();

    background('#ffffff');
    fill(obj.r, obj.g, obj.b);
    textStyle(BOLD);
    text(`${h}:${m} ${d}/${mo}/${ye}`, obj.x+10, obj.y+10, 60);

    noStroke();
    //circle(i*20, i*50, obj.d, obj.d);

    for (let i = 0; i < shapes.length; i++) {
        shapes[i].updateShape();
        shapes[i].animateShape();
        shapes[i].drawShape();
      }
      
  }

  function setup(){
    createCanvas(windowWidth, windowHeight);

    // create a bunch of shape objects
  for (let i = 0; i < nuParticles; i++) {
    shapes.push(new Shape());
  }

    myRed = random(0,255);
    myGreen = random(0,255)
    myBlue = random(0,255);

myDiameter = random(5,50);

}

function mouseMoved() {
  //Grab mouse position
  let mouseData = {
    x: mouseX,
    y: mouseY,
    r: myRed,
    g: myGreen,
    b: myBlue,
    d: myDiameter
  }
  socket.emit('message', mouseData);

  //Draw yourself? Wait for server?
  //fill(0);
  //ellipse(mouseX, mouseY, random(10), random(20));

}


class Shape {
    constructor() {
      this.x = random(0, windowWidth);
      this.y = random(0, windowHeight); 
      this.radius = random(5, 15);
      this.color = color(random(0, 255), random(200, 255), random(200, 255));
    }
      updateShape() {
      let mouseDistance = int(dist(this.x, this.y, mouseX, mouseY));
      if (mouseDistance <= mouseThreshold) { 
        this.x += random(-moveDistance, moveDistance);
        this.y += random(-moveDistance, moveDistance); 
      }
    }
    
    animateShape(){
      this.x = lerp(this.x, random(this.x - animateDistance, this.x + animateDistance), 0.01);
      this.y = lerp(this.y, random(this.y - animateDistance, this.y + animateDistance), 0.01);
    }
  
    drawShape() {
      fill(this.color);
      ellipse(this.x, this.y, this.radius, this.radius);
    }
  }