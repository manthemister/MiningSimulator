//load images in advance
var images = [];
function loadImages() {
	for (let i = 0; i < loadImages.arguments.length; i++) {
		images[i] = new Image();
		images[i].src = loadImages.arguments[i];
	}
}
loadImages(
	"assets/images/stone.png",
  "assets/images/coal_ore.png",
  "assets/images/iron_ore.png",
  "assets/images/gold_ore.png"
)
const stone = 0;
const coalOre = 1;
const ironOre = 2;
const goldOre = 3;

//create the canvas element
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//determine which keys are pressed at all times using jquery
var keysDown = [];
$(document).keydown(function(event){
  if (!keysDown.includes(event.which)) {
    event.preventDefault();
    keysDown.push(event.which);
  }
});
$(document).keyup(function(event){
  keysDown.splice(keysDown.indexOf(event.which), 1);
});

//
var worldSize;
var worldSize = parseInt(prompt("How big is the world?"));
var generationComplete = false;
var world = [];
function generateWorld() {
 //create grid
	for (let x = 0; x < worldSize; x++) {
		world[x] = [];
		for (let y = 0; y < worldSize; y++) {
			world[x][y] = 0;
		}
	}
	generationComplete = true;
	//
  var numVeins = Math.ceiling((Math.rand() * worldSize / 2) + worldSize / 3) //add ore veins
	var veinPos, veinSize;
	for (let i = 0; i < numVeins; i++) {
		veinPos = [Math.floor(Math.rand() * (worldSize + 1)), Math.floor(Math.rand() * (worldSize))];
		veinSize = Math.floor((Math.rand() * 8) + 8);
		for (let i2 = 0; i2 < veinSize; i2++) {
			if (veinPos[0] >= 0 && veinPos[0] <= worldSize && veinPos[1] >= 0 && veinPos[1] <= worldSize) {
				world[veinPos[0][veinPos[1] = 1;
			}
			let veinMotion = Math.floor(Math.rand() * 3);
			if (veinMotion == 0) {

			}
		}
	}
	//
}
generateWorld();

var cameraPos = [0, 0]

function drawTiles() {
	for (let x = Math.floor(cameraPos[0]); x < cameraPos[0] + 13; x++) {
		for (let y = Math.floor(cameraPos[1]); y < cameraPos[1] + 9; y++) {
			ctx.drawImage(images[world[x][y]], (x - cameraPos[0]) * 32, (y - cameraPos[1]) * 32);
		}
	}
}

function moveCamera() {
	if (keysDown.includes(87) && cameraPos[1] > 0) {
		cameraPos[1] -= 0.0625;
	}
	if (keysDown.includes(83) && cameraPos[1] < worldSize - 9) {
		cameraPos[1] += 0.0625;
	}
	if (keysDown.includes(68) && cameraPos[0] < worldSize - 13) {
		cameraPos[0] += 0.0625;
	}
	if (keysDown.includes(65) && cameraPos[0] > 0) {
		cameraPos[0] -= 0.0625;
	}
}

function tick() {
	moveCamera();
	ctx.clearRect(0, 0, 960, 720);
	drawTiles();
	console.log(world);
}

function detectLoading() {
	if (images.length == 4 && generationComplete === true) {
		clearInterval(detectLoadingTimer);
		setInterval(tick, 25);
	}
	console.log(images)
}
var detectLoadingTimer = setInterval(detectLoading, 500);
