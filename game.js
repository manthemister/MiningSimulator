//load images in advance
var images = [];
function loadImages() {
	for (i = 0; i < loadImages.arguments.length; i++) {
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
var worldSize = parseInt(prompt("How big is the world?"));

function generateWorld() {
	var world = []; //create grid
	for (x = 0; x < worldSize; x++) {
		world[x] = [];
		for (y = 0; y < worldSize; y++) {
			world[x][y] = 0;
		}
	}
  var numVeins = Math.ceiling((Math.rand() * worldSize / 2) + worldSize / 3) //add ore veins
	var veinPos, veinSize;
	for (i = 0; i < numVeins; i++) {
		veinPos = [Math.floor(Math.rand() * (worldSize + 1)), Math.floor(Math.rand() * (worldSize))];
		veinSize = Math.floor((Math.rand() * 8) + 8);
		for (i2 = 0; i2 < veinSize; i2++) {
			if (veinPos[0] >= 0 && veinPos[0] <= worldSize && veinPos[1] >= 0 && veinPos[1] <= worldSize) {
				world[x][y] = 1;
			}
			if (Math.floor(Math.rand() * 2) {

			}
		}
	}
}

var cameraPos = [0, 0]

function drawTiles() {
	for (x = Math.floor(cameraPos[0]); x < cameraPos[0] + 13; x++) {
		for (y = Math.floor(cameraPos[1]); y < cameraPos[1] + 9; y++) {
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
}

setInterval(tick, 25)
/*
var y_pos = 0;
var MyImg = new Image();
MyImg.src = "https://s2js.com/img/etc/cat_grumpy.png";

function MyTimer () {
  y_pos = y_pos + 1;
  ctx.drawImage(MyImg, 130, 0);
}
setInterval(MyTimer, 40);
*/
