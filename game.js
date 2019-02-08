//load images in advance
images = new Array()
function preloadImages() {
	for (i = 0; i < preloadImages.arguments.length; i++) {
		images[i] = new Image()
		images[i].src = preloadImages.arguments[i]
	}
}
preloadImages(
	"assets/images/stone.png",
  "assets/images/coal_ore.png",
  "assets/images/iron_ore.png",
  "assets/images/gold_ore.png"
)

//create the canvas element
var canvas = document.createElement("CANVAS");
canvas.style.background = "#FFFFFF";
canvas.style.display = "block";
canvas.width = 960;
canvas.height = 720;
var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);
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

//
var world = [];
for (x = 0; x < worldSize; x++) {
	world[x] = [];
	for (y = 0; y < worldSize; y++) {
		world[x][y] = ["stone"]
	}
}

console.log(world)
