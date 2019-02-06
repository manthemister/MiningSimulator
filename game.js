//load images in advance
images = new Array()
function preload() {
	for (i = 0; i < preload.arguments.length; i++) {
		images[i] = new Image()
		images[i].src = preload.arguments[i]
	}
}
preload(
	"assets/images/stone.jpg"
  "assets/images/coal_ore.jpg"
  "assets/images/iron_ore.jpg"
  "assets/images/gold_ore.jpg"
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
