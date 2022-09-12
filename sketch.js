
var trex ,trex_running, trexded;
var ground, groundImage;
var score=0;
var cloud, cloudImage;
var invisibleground;
var cactus1, cactus2, cactus3, cactus4, cactus5, cactus6, cactus1Image, cactus2Image, cactus3Image, cactus4Image, cactus5Image, cactus6Image;
var PLAY = 1;
var END = 0;
var GAMESTATE = PLAY;
var gameover, game_over;
var restart, restart_;
var checkpointsound;
var diesound;
var jumpsound;
var invisiblescore;

function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexded = loadImage("trex_collided.png")
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  cactus1Image = loadImage("obstacle1.png");
  cactus2Image = loadImage("obstacle2.png");
  cactus3Image = loadImage("obstacle3.png");
  cactus4Image = loadImage("obstacle4.png");
  cactus5Image = loadImage("obstacle5.png");
  cactus6Image = loadImage("obstacle6.png");
  game_over = loadImage("gameOver.png");
  restart_ = loadImage("restart.png");
  checkpointsound = loadSound("checkpoint.mp3");
  diesound = loadSound("die.mp3");
  jumpsound = loadSound("jump.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  ground = createSprite(300, 180);
  ground.addImage("ground", groundImage);
//create a trex sprite
 trex = createSprite(50, 160);
 trex.addAnimation("trex", trex_running);
 trex.addImage("collided", trexded)
 trex.scale = 0.5;
 edges = createEdgeSprites();
 gameover = createSprite(300,100);
 gameover.visible = false;
 gameover.addImage("gameisover", game_over);
 restart = createSprite(300, 150);
 restart.visible = false;
 restart.addImage("restarting", restart_);
 restart.scale = 0.5;
invisibleground = createSprite(300, 190, 600, 10);
invisibleground.visible = false;

cactus = new Group();
clouds = new Group();

trex.debug = true;
trex.setCollider("rectangle", -5,0,40,trex.height);
}

function draw(){
  background(rgb(43, 43, 43));


  if(GAMESTATE === PLAY){
    ground.velocityX = -(6+score/100);
    if(keyDown(UP_ARROW)){
      if(trex.collide(invisibleground)){
        trex.velocityY = -11;
        jumpsound.play();
      }
      
    }
    if(ground.x<0){
      ground.x=ground.width/2;
    }
    
    score += Math.round(frameRate()/60);
    //score = Math.round(score/5);

    if(score%100===0 && score>0){
      checkpointsound.play();
      //cactus.setVelocityXEach(-(4+3*score/100));
      //ground.velocityX -= ground.velocityX+(4+3*score/100);
    }
    spawnCactus();
    cloudPhysics();
    

    if(cactus.isTouching(trex)){
      GAMESTATE = END
      diesound.play();
      //trex.velocityY = -10;
      //jumpsound.play();
    }
  }
  
  else if(GAMESTATE === END){
    trex.changeImage("collided", trexded);
    ground.velocityX = 0;
    trex.velocityY = 0;
    cactus.setVelocityXEach(0);
    clouds.setVelocityXEach(0);
    clouds.setLifetimeEach(-1);
    cactus.setLifetimeEach(-1);
    gameover.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)){
      reset()
    }
  }
  //text (mouseX +"," +mouseY, mouseX,mouseY);
  
  
  
  
  text("Score: " + Math.round(score/3.4), 520, 20)
  //score += Math.round(getFrameRate()/60);
  
  trex.velocityY+=0.75;
  drawSprites();
  trex.collide(invisibleground);
 // trex.collide(cactus);
}


function cloudPhysics(){
  if(frameCount % 240 === 0){
    cloud = createSprite(600, random(20,100));
    cloud.velocityX = -1
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.5;
    cloud.depth = trex.depth;
    trex.depth+=1;
    cloud.lifetime = 750;
    clouds.add(cloud);
}
}

function spawnCactus(){
  
  if(frameCount % Math.round(random(100, 200)) === 0){
    cactus1 = createSprite(600, 165, 20, 50)
    cactus1.velocityX = -(6+score/100);
    cactus1.scale = 0.5;
    cactus.add(cactus1);
    var random1 = Math.round(random(1,6));
    switch (random1) {
      case 1: cactus1.addImage(cactus1Image);
        break;
      case 2: cactus1.addImage(cactus2Image);
        break;
      case 3: cactus1.addImage(cactus3Image); 
        break;
      case 4: cactus1.addImage(cactus4Image);
        break;
      case 5: cactus1.addImage(cactus5Image);
        break;
      case 6: cactus1.addImage(cactus6Image);
      default:
        break;
    
    }
    cactus1.lifetime = 750;
  }
  
}
function reset(){
  GAMESTATE=PLAY;
  cactus.destroyEach();
  clouds.destroyEach();
  gameover.visible = false;
  restart.visible = false;
  score = score-score;
  trex.changeAnimation("trex", trex_running)
}