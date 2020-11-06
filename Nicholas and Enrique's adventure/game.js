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
	"","hole","","lbup",""]
	
	//level 2
	["obstacle2","obstacle2", "target","obstacle2","obstacle",
	"hurdle", "hole", "","","rider",
	"animate","bridge animate ","animate","animate","animate",
	"","hole","", "","",
	"","hole","","lbup",""]
	];//end of level
	
const gridBoxes = document.querySelectorAll("#gameBoard div");	
var currentLevel = 0;//starting level
var riderOn = false; //is rider on
var currentLocationOfLb =0;
var currentAnimation;//allows 1 animation per level

//game start
window.addEventListener("load", function(){
	loadLevel();
});
	
	//load levels 0 - max level
	function loadLevel(){
		let levelMap = levels[currentLevel];
		let animateBoxes;
		riderOn =false;
		
		//load board
		for(i =0;i<gridBoxes.length; i++){
			gridBoxes[i].className = levelMap[i];
			if(levelMap[i].includes("lb")){
				curentLocationOfLb = i;
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