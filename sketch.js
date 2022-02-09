let camX = 0;
let camY = 0;
let camTargetX = 0;
let camTargetY = 0;
let camZ = 360 * 3;
let camEZ = 0.05;

let fr = 24;

var riAudio;

let monsterCan;
let monsterTex;
let angel = 0;

let ticket;

let backyardRI = [];
let backyardIndex = 0;

let earlAnim = [];
let earlIndex = 0;
let smoke = [];
let chanceArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let earlW;
let earlSmokeX;
let earlSmokeY;
let earlSmokeZ = 1;



function preload(){
  // load ambient audio
  soundFormats('mp3', 'ogg');
  riAudio = loadSound('assets/riAudio.mp3');

  // load monster energy
  monsterCan = loadModel('assets/monster/monster-baked2.obj');
  monsterTex = loadImage('assets/monster/monster-baked1.jpg');

  // load parking ticket
  ticket = loadImage('assets/parkingticket.jpg');

  // backyard background
  for (let i = 0; i < 240; i++) {
    backyardRI[i] = loadImage('assets/halftoneRI/halftoneRI' + nf(i, 3, 0) + '.jpg');
  }

  // load my name is earl animation
  for (let i = 0; i < 76; i++) {
    earlAnim[i] = loadImage('assets/earl/earl_' + nf(100 + i) + '.png');
  }
}

function setup() {
  riAudio.play();
  riAudio.loop();
  frameRate(fr);
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(color(222, 235, 226));

  // backyard background
  push();
  translate(0, 0, -1000);
  imageMode(CENTER);
  image(backyardRI[backyardIndex], 0, 0, width*4, (width*4)*9/16);
  backyardIndex++;
  if (backyardIndex >= backyardRI.length) {
    backyardIndex = 0;
  }
  pop();

  // new smoke?
  if (random(chanceArray) === 5) {
    let s = new Smoke();
    smoke.push(s); 
  } 

  // camera, controlled using click and drag
  yRemap = map(mouseY, 0, height, -300, 300);
  xRemap = map(mouseX, 0, width, -300, 300);

  if (mouseIsPressed === true) {
    camTargetY = map(mouseY, 0, height, -height * 3/8, height * 3/8);
    camTargetX = map(mouseX, 0, width, -width * 3/5, width * 3/5);
  }

   if(camY != camTargetY){
    let distN = camTargetY-camY;
    distN*=0.05
    camY = camY + distN
  }

  if(camX != camTargetX){
    let distN = camTargetX-camX;
    distN*=0.05
    camX = camX + distN
  }

  // console.log(camY)
  // console.log(camTargetY)

  camera(camX,camY,camZ,0,0,0,0,1,0);


  // move everything back
  translate(0,0,-600);
  
  // bridge near my house in ohio
  let windowW = width*3/5
  image(ticket,-width*1/6,-(height/2.25),windowW, windowW*5/12);
  

  // monster can
  ambientLight(100);
  directionalLight(200,200,200,width/2,90,35);
  specularMaterial(200,200,200);
  push();
  texture(monsterTex);
  translate(width/3.5,height/3,100);
  scale(1.5);
  rotateZ(-180);
  rotateY(angel);
  //rotateX(-15);
  noStroke();
  model(monsterCan);
  pop();
  angel += 1;

  // earl
  earlW = width * 3/5;

  push();
  imageMode(CENTER);
  translate(-width*1/5, height * 2/9, 300);
  image(earlAnim[earlIndex],0,0,earlW, earlW);
  
    // earl's smoke
    earlSmokeX = int(earlW * 0.092592);
    earlSmokeY = int(earlW * 0.284391);
    push();
    translate(earlSmokeX, earlSmokeY, earlSmokeZ);
    //sphere(15);
    for (let i = smoke.length - 1; i > 0; i--) {
      smoke[i].update();
      smoke[i].show();
      if (smoke[i].disappeared()) {
        // remove smoke
        smoke.splice(i, 1);
      }
    }
    pop();
  pop();

  earlIndex++;
  if (earlIndex >= earlAnim.length) {
    earlIndex = 0;
  }
}

function mousePressed() {
  userStartAudio();
}

class Smoke {
  constructor() {
    this.x = 10;
    this.y = 10;
    this.vx = random(-0.3, 0.3);
    this.vy = random(-5, -1);
    this.alpha = 255;
    this.alphaReducer = random(2, 5);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.alphaReducer;
  }
  
  show() {
    noStroke();
    fill(0, this.alpha);
    ellipse(this.x, this.y, 20);
  }

  disappeared() {
    return this.alpha < 8;
  }
}

