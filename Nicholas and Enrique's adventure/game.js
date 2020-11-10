const levels = [
//level 0
["target","obstacle", "","","",
"hurdle", "obstacle", "","","rider",
"","obstacle2","animate","animate","animate",
"","hole","", "","",
"","hurdleup","","lbup",""],

//level 1
["target","hole", "","","",
"hurdle", "hole", "","","rider",
"animate","bridge animate ","animate","animate","animate",
"","hole","", "","",
"","hole","","lbup",""],

//level 2
["obstacle2","obstacle2", "target","obstacle2","obstacle",
"hurdle", "hole", "","","rider",
"animate","bridge animate ","animate","animate","animate",
"","hole","", "","",
"","hole","","lbup",""]
];//end of level

const gridBoxes = document.querySelectorAll("#gameBoard div");

const noPassObstacles = ["obstacle","obstacle2","hole"];
var currentLevel = 0;//starting level
var riderOn = false; //is rider on
var currentLocationOfLb =0;
var currentAnimation;//allows 1 animation per level
var widthOfBoard = 5;

//game start
window.addEventListener("load", function(){
loadLevel();
});

// move player
document.addEventListener("keydown", function (e) {

switch (e.keyCode){
case 37: //left arrow
if(currentLocationOfLb % widthOfBoard !== 0){
tryToMove("left");
}
break;
case 38: //up arrow
if(currentLocationOfLb - widthOfBoard >= 0){
tryToMove("up");
}
break;
case 39: //right arrow
if(currentLocationOfLb % widthOfBoard < widthOfBoard - 1){
tryToMove("right");
}
break;
case 40: //down arrow
if(currentLocationOfLb + widthOfBoard < widthOfBoard * widthOfBoard){
tryToMove("down");
}
break;
} // switch

}); //key event listener

//try to move lb
function tryToMove(direction){
let oldLocation = currentLocationOfLb; //location before move
let oldClassName = gridBoxes[oldLocation].className;//class od location befoerwe move
let nextClass =""; //class of location we wish to move to
let nextLocation = 0; // loction we wish to move to
let newClass = "";// new class to switch if move successful
let nextLocation2 = 0;
let nextClass2 = "";

switch(direction){
case "left":
nextLocation = currentLocationOfLb -1;
break;
case "right":
nextLocation = currentLocationOfLb +1;
break;
case "up":
nextLocation = currentLocationOfLb - widthOfBoard
break;
case "down":
nextLocation = currentLocationOfLb + widthOfBoard
break;
}//switch
nextClass = gridBoxes[nextLocation].className;

//if obstacle is not passable, dont move
if(noPassObstacles.includes(nextClass)){return;}

//if its a fence with no rider dont move
if(riderOn == false && nextClass.includes("hurdle")){return;}

//if there is a fence move two spaces with animation  (need to add if jump goes to a obstacle)
if(nextClass.includes("hurdle")){
//rider must be on
if(riderOn){
gridBoxes[currentLocationOfLb].className = "";
oldClassName = gridBoxes[nextLocation].className;

//set values according to direction
if(direction == "left"){
nextClass = "jumpleft";
nextClass2 = "lbrideleft";
nextLocation2 = nextLocation - 1;
}else if (direction == "right"){
nextClass = "jumpright";
nextClass2 = "lbrideright";
nextLocation2 = nextLocation + 1;
}else if (direction == "up"){
nextClass = "jumpup";
nextClass2 = "lbrideup";
nextLocation2 = nextLocation - widthOfBoard;
}else if (direction == "down"){
nextClass = "jumpdown";
nextClass2 = "lbridedown";
nextLocation2 = nextLocation + widthOfBoard;
}
//show lb jumping
gridBoxes[nextLocation].className = nextClass;

setTimeout(function(){
//set jump back to just a fence
gridBoxes[nextLocation].className = oldClassName;

//update current location of lb to be 2 spaces past take off
currentLocationOfLb = nextLocation2;
console.log("updating current location " + currentLocationOfLb);

//get class of box after jump
nextClass = gridBoxes[currentLocationOfLb].className;

//show lb and rider after landing
 gridBoxes[currentLocationOfLb].className = nextClass2;
 console.log("Animation updating div " + currentLocationOfLb + " to " + nextClass2);
//if new box is target go up a level
levelUp(nextClass);
}, 350);
return;
}//if rider on

}//if class has fence

//if there is a rider add rider
if(nextClass == "rider"){
riderOn = true;
}

//if there is a bridge in the old location keep it
if(oldClassName.includes("bridge")){
gridBoxes[oldLocation].className = "bridge";
}else {
gridBoxes[oldLocation].className = "";
}//else

//build name of new class
newClass = (riderOn) ? "lbride" : "lb";
newClass += direction;

//if there is a bridge in the nexct location keep it
if(gridBoxes[nextLocation].classList.contains("bridge")){
newClass += " bridge";
}

//move 1 spaces
currentLocationOfLb = nextLocation;
gridBoxes[currentLocationOfLb].className = newClass;
console.log("updating div " + currentLocationOfLb + " to " + newClass);
//if its an enemy
if(nextClass.includes("enemy")){
document.getElementById("lose").style.display ="block";
return;
}

//move up to next level if needed
levelUp(nextClass);


}//try to move

//move up a level
function levelUp(nextClass){

if(nextClass == "target" && riderOn ){
	currentLevel++;
if(currentLevel <=2){
document.getElementById("levelup").style.display = "block";
clearTimeout(currentAnimation);
setTimeout(function(){
document.getElementById("levelup").style.display = "none";

loadLevel();



},1000);
}else{
	 document.getElementById("gameOver").style.display = "block";
	return;
}
}
}

//load levels 0 - max level
function loadLevel(){
let levelMap = levels[currentLevel];
let animateBoxes;
riderOn =false;

//load board
console.log("currentLevel:");
console.log(currentLevel);
for(i =0;i<gridBoxes.length; i++){
gridBoxes[i].className = levelMap[i];
if(levelMap[i].includes("lb")){
currentLocationOfLb = i;
}
}//for
animateBoxes = document.querySelectorAll(".animate");

animateEnemy(animateBoxes, 0,"right");
}
//animate enemy left right
function animateEnemy(boxes,index,direction){
//exit if  no animation
if(boxes.length <=0){
return;
}
//update images
if(direction == "right"){
boxes[index].classList.add("enemyright");
}else{
boxes[index].classList.add("enemyleft");
}
//remove images from other boxes
for( i =0; i <boxes.length;i++){
if(i != index){
boxes[i].classList.remove("enemyleft");
boxes[i].classList.remove("enemyright");
}
}
//moving right
if(direction == "right"){
//turn around if hit right side
if(index == boxes.length -1){
index--;
direction = "left";
}else{
index++;
}
//moving left
}else{
//turn around if hit right side
if(index == 0){
index++;
direction = "right";
}else{
index--;
}//else
}//else
currentAnimation = setTimeout(function(){
animateEnemy(boxes, index, direction);
},750);
}//animateEnemy
