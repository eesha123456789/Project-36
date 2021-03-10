//Create variables here
var dog, sittingDog, happyDog, nameDog
var database, foodS, foodStock
var feedDog, addFood, fedTime, lastFed, foodObj
var bedroom, garden, washroom, backG
var changeState, readState
var gameState="Hungry"
function preload()
{
	//load images here
  sittingDog=loadImage('dogImg.png')
  happyDog=loadImage('dogImg1.png')
  bedroom=loadImage('virtual pet images/Bed Room.png')
  garden=loadImage('virtual pet images/Garden.png')
  washroom=loadImage('virtual pet images/Wash Room.png')
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);
  foodObj=new Food()

  foodStock=database.ref('food')
  foodStock.on("value",readStock)

  dog=createSprite(850,250)
  dog.addImage(sittingDog)
  dog.scale=0.3

  feed=createButton("Feed the Dog")
  feed.position(700,95);
  feed.mousePressed(feedDog)
  addFood=createButton("Add Food")
  addFood.position(800,95)
  addFood.mousePressed(addFoods)
  nameDog=createInput("Name the Dog")
  nameDog.position(900,95)

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val()
  })
}


function draw() {  
  background(46,139,87);
  currentTime=hour();
  if(gameState!=="Hungry"){
    feed.hide();
    addFood.hide();
    nameDog.hide()
    dog.remove();
  }
  else{
    feed.show()
    addFood.show()
  }
  if(currentTime===(lastFed+1)){
    update("Playing")
    foodObj.garden();
  }
  else if(currentTime===(lastFed+2)){
    update("Sleeping")
    foodObj.bedroom()
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing")
    foodObj.washroom()
   }
   else{
     update("Hungry")
     foodObj.display();
     fill(255,255,255)
     textSize(15)
     if(lastFed>=12){
       text("Last Feed : "+ lastFed%12 + " PM", 350,30);
      }
     else if(lastFed==0){
        text("Last Feed : 12 AM",350,30);
      }
     else{
        text("Last Feed : "+ lastFed + " AM", 350,30);
      }
      fill('white')
      text("Food Remaining: "+foodStock,800,50)
   }
  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data){
    lastFed=data.val()
  })

  drawSprites();
}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

  function addFoods(){
    foodS++;
    foodObj.updateFoodStock(foodObj.getFoodStock()+1);
    database.ref('/').update({
      Food:foodS
    })
  }
  function feedDog(){
    dog.addImage(happyDog);
    foodS=foodS-1;
    if(foodObj.getFoodStock()<= 0){
      foodObj.updateFoodStock(foodObj.getFoodStock()*0);
    }
    else{
      foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    }
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }
  function update(state){
    database.ref('/').update({
    gameState:state
  })
  }