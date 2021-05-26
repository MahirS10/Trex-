var trex,dino,ground,grow,inground,cloud,cl,stopdino,score=0;
var cactus,ob1,ob2,ob3,ob4,ob5,ob6;
var cacgrp,clogrp,gameState="play";
var end,over,restart,rs;
var jump,cp,die;


function preload (){
  dino=loadAnimation("trex1.png","trex3.png","trex4.png");
  grow=loadImage("ground2.png");
  cl=loadImage("cloud.png");
  ob1=loadImage("obstacle1.png");
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png");
  ob4=loadImage("obstacle4.png");
  ob5=loadImage("obstacle5.png");
  ob6=loadImage("obstacle6.png");
  stopdino=loadAnimation("trex_collided.png");
  over=loadImage("gameOver.png");
  rs=loadImage("restart.png");
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  cp=loadSound("checkPoint.mp3");
}

function setup () {
  createCanvas(600,200);
  
  trex=createSprite(50,160,20,50);
  trex.addAnimation("dino",dino);
  trex.addAnimation("collidewithdino",stopdino);
  trex.scale=0.5;
  trex.debug=false;
  trex.setCollider("circle",0,0,40);

  ground=createSprite(200,180,400,20);
  ground.addImage("ground",grow);
  
  inground=createSprite(200,190,400,20);
  inground.visible=false; 

  cacgrp=new Group();
  clogrp=new Group();
  
  end=createSprite(300,100,20,20);
  end.addImage(over)
  
  restart=createSprite(300,140,20,20);
  restart.addImage(rs);
  restart.scale=0.5;
}

function draw () {
  background("white");

  text("Distance = "+score,500,50)
  
  
  if(gameState==="play"){
    score=score+Math.round(getFrameRate()/60);
    
    restart.visible=false;
    end.visible=false;
    
   if(score>0&&score%100===0){
     cp.play();
   } 
    
    ground.velocityX=-(4+3*score/300);
    if(ground.x<0){
      ground.x=ground.width/2;  
  }
    
    if(keyDown("space")&&trex.y>=150){
      trex.velocityY=-10; 
      jump.play();
  }
   
    trex.velocityY=trex.velocityY+0.8;
    
    makeclouds();
    createcactus();
    
    if(cacgrp.isTouching(trex)){
      gameState="end";
      die.play();
    }
  }
  else if(gameState==="end"){
   ground.velocityX=0;
    trex.velocityY=0;
    trex.changeAnimation("collidewithdino",stopdino);
    cacgrp.setVelocityXEach(0);
    cacgrp.setLifetimeEach(-1)
    clogrp.setVelocityXEach(0);
    clogrp.setLifetimeEach(-1);
    end.visible=true;
    restart.visible=true;
    if(mousePressedOver(restart)){
      reset();
    }
 }
  trex.collide(inground); 
  console.log(frameCount)
  drawSprites();
} 

function makeclouds () {
  if(frameCount%60===0){
    cloud=createSprite(600,100,40,10);
    cloud.velocityX=-2;
    cloud.y=Math.round(random(10,120));
    cloud.addImage("cloud",cl);
    cloud.lifetime=300 
    cloud.depth=trex.depth; 
    trex.depth=trex.depth+1;
    clogrp.add(cloud);
  }
}

function createcactus () {
  if (frameCount%70===0){
    cactus=createSprite(600,165,10,40);
    cactus.velocityX=-(6+score/200);
    var obstacle=Math.round(random(1,6));
    switch(obstacle){
      case 1: cactus.addImage(ob1);
        break;
      case 2: cactus.addImage(ob2);
        break;
      case 3: cactus.addImage(ob3);
        break;
      case 4: cactus.addImage(ob4);
        break;
      case 5: cactus.addImage(ob5);
        break;
      case 6: cactus.addImage(ob6);
        break;
      default:break; 
    }
    cactus.scale=0.5;
    cactus.lifetime=300;
    cacgrp.add(cactus);
  }

}

function reset(){
  gameState="play";
  trex.changeAnimation("dino",dino);
  cacgrp.destroyEach();
  clogrp.destroyEach();
  score=0
}
