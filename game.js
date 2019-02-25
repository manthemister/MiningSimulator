//get the canvas element
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//load tile images
var tileImages = [], assetsLoaded = 0;
function loadImages() {
	for (let i = 0; i < loadImages.arguments.length; i++) {
		tileImages[i] = new Image();
		tileImages[i].src = loadImages.arguments[i];
		$(tileImages[i]).on("load", function() {
			assetsLoaded++;
		});
	}
}
loadImages(
	"assets/tiles/stone_background.png",
	"assets/tiles/stone.png",
  "assets/tiles/coal_ore.png",
  "assets/tiles/iron_ore.png",
  "assets/tiles/gold_ore.png"
);
const air = 0;
const stone = 1;
const coalOre = 2;
const ironOre = 3;
const goldOre = 4;

//load music
var music = document.getElementById("music");
music.oncanplaythrough = function() {
	assetsLoaded++;
}
$(document).one('click', function() {
	music.play();
});

//determines which keys are pressed at all times
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

//generates the world
var worldSize = parseInt(prompt("How big is the world (enter an integer greater than or equal to 13)?")), world = [], oreDensity = 64;
function generateWorld() {
	for (let x = 0; x < worldSize; x++) {
		world[x] = [];
		for (let y = 0; y < worldSize; y++) {
			world[x][y] = stone;
		}
	}
	generateOreVeins(coalOre, 2, 8);
	generateOreVeins(ironOre, 3, 6);
	generateOreVeins(goldOre, 4, 3);
	generateCaves();
	world[Math.floor(worldSize / 2 - 0.75)][Math.floor(worldSize / 2 - 0.75)] = air;
}
generateWorld();

//create character object
var character = {
	animation: 1,
	chunkPos: [0, 0]
	position: [8, 8],
	image: new Image(),
	animated: false,
	animationPhase: 0,
	using: false
}
character.image.src = "assets/Hero.png";

function generateOreVeins(veinType, veinRarity, veinLength) {
	let veinPos, veinSize, x, y, numVeins = Math.ceil((Math.random() * worldSize * worldSize / (veinRarity * oreDensity)) + worldSize * worldSize / (veinRarity * 1.5 * oreDensity));
	for (let i = 0; i <= numVeins; i++) {
		veinPos = [Math.floor(Math.random() * (worldSize)), Math.floor(Math.random() * (worldSize))];
		veinSize = Math.floor((Math.random() * 8) + veinLength);
		world[veinPos[0]][veinPos[1]] = veinType;
		for (let i2 = 0; i2 <= veinSize; i2++) {
			let veinMotion = Math.floor(Math.random() * 3.5);
			if (veinMotion < 3) {
				if (veinMotion == 1) {
					veinPos[0] += Math.round(Math.random() * 3 - 1);
				} else {
					veinPos[1] += Math.round(Math.random() * 3 - 1);
				}
			} else {
				veinPos[0] += Math.round(Math.random() * 3 - 1);
				veinPos[1] += Math.round(Math.random() * 3 - 1);
			}
			if (veinPos[0] >= 0 && veinPos[0] <= worldSize -1 && veinPos[1] >= 0 && veinPos[1] <= worldSize - 1) {
				world[veinPos[0]][veinPos[1]] = veinType;
			}
		}
	}
}

function generateCaves() {
	let caveDirection, caveWidth, cavePos, caveLength, tilePos, numCaves = Math.floor(Math.random() * worldSize / 8 + (worldSize / 13));
	for (let i = 0; i <= numCaves; i++) {
		caveDirection = Math.floor(Math.random() * 8);
		caveWidth = Math.random() + 1;
		caveLength = Math.floor(Math.random() * worldSize + (worldSize / 2));
		cavePos = [Math.floor(Math.random() * worldSize), Math.floor(Math.random() * worldSize)]
		for (let x = cavePos[0] - Math.floor(caveWidth); x <= cavePos[0] + Math.floor(caveWidth); x++) {
			for (let y = cavePos[1] - Math.floor(caveWidth); y <= cavePos[1] + Math.floor(caveWidth); y++) {
				if (x >= 0 && x < worldSize && y >= 0 && y < worldSize) {
					if (Math.sqrt((x - cavePos[0]) * (x - cavePos[0]) + ((y - cavePos[1]) * (y - cavePos[1]))) <= caveWidth) {
						world[x][y] = air;
					}
				}
			}
		}
		for (let i2 = 0; i2 <= caveLength; i2++) {
			caveDirection += Math.floor(Math.random() * 3 - 1);
			if (caveDirection < 0) {
				caveDirection += 8;
			}
			caveDirection %= 8;
			switch (caveDirection) {
				case 0:
					cavePos[0] += 1;
					break;
				case 1:
					cavePos[0] += 1;
					cavePos[1] += 1;
					break;
				case 2:
					cavePos[1] += 1;
					break;
				case 3:
					cavePos[1] += 1;
					cavePos[0] -= 1;
					break;
				case 4:
					cavePos[0] -= 1;
					break;
				case 5:
					cavePos[0] -= 1;
					cavePos[1] -= 1;
					break;
				case 6:
					cavePos[1] -= 1;
					break;
				case 7:
					cavePos[1] -= 1;
					cavePos[0] += 1;
					break;
			}
			for (let x = cavePos[0] - Math.floor(caveWidth); x <= cavePos[0] + Math.floor(caveWidth); x++) {
				for (let y = cavePos[1] - Math.floor(caveWidth); y <= cavePos[1] + Math.floor(caveWidth); y++) {
					if (x >= 0 && x < worldSize && y >= 0 && y < worldSize) {
						if (Math.sqrt((x - cavePos[0]) * (x - cavePos[0]) + (y - cavePos[1]) * (y - cavePos[1])) <= caveWidth) {
							world[x][y] = air;
						}
					}
				}
			}
			if (cavePos[0] >= 0 && cavePos[0] < worldSize && cavePos[1] >= 0 && cavePos[1] < worldSize) {
				if (world[cavePos[0]][cavePos[1]] != air) {
					console.log(cavePos)
				}
			}
		}
	}
}

function drawTiles() {
	for (let x = Math.floor(cameraPos[0]); x < cameraPos[0] + 13; x++) {
		for (let y = Math.floor(cameraPos[1]); y < cameraPos[1] + 9; y++) {
			ctx.drawImage(tileImages[world[x][y]], Math.floor((x - cameraPos[0]) * 32), Math.floor((y - cameraPos[1]) * 32));
		}
	}
}

function drawCharacter() {
	if (character.using) {
		ctx.drawImage(character.image, character.animationPhase * 16, (character.animation + 4) * 16, 16, 16, Math.floor((character.position[0] - cameraPos[0]) * 32), Math.floor((character.position[1] - cameraPos[1]) * 32), 16, 16);
	} else {
		ctx.drawImage(character.image, character.animationPhase * 16, character.animation * 16, 16, 16, Math.floor((character.position[0] - cameraPos[0]) * 32), Math.floor((character.position[1] - cameraPos[1]) * 32), 16, 16);
	}
}

function controllsAndAnimation() {
	character.animated = false;
	if (keysDown.includes(32) && character.using == false) {
		character.using = true;
		character.animationPhase = 0;
	}
	if (character.using == false) {
		if (keysDown.includes(87)) {
			character.animation = 0;
			if (keysDown.includes(68) || keysDown.includes(65)) {
				if (character.position[1] - 0.0442 > 0 && world[Math.floor(character.position[0])][Math.floor(character.position[1] - 0.0442)] == air && world[Math.floor(character.position[0] + 0.5)][Math.floor(character.position[1] - 0.0442)] == air) {
					character.position[1] -= 0.0442;
				}
			} else {
				if (character.position[1] - 0.0625 > 0 && world[Math.floor(character.position[0])][Math.floor(character.position[1] - 0.0625)] == air && world[Math.floor(character.position[0] + 0.5)][Math.floor(character.position[1] - 0.0625)] == air) {
					character.position[1] -= 0.0625;
				}
			}
			character.animated = true;
		}
		if (keysDown.includes(83)) {
			character.animation = 1;
			if (keysDown.includes(68) || keysDown.includes(65)) {
				if (character.position[1] + 0.5442 < worldSize + 1 && world[Math.floor(character.position[0])][Math.floor(character.position[1] + 0.5442)] == air && world[Math.floor(character.position[0] + 0.5)][Math.floor(character.position[1] + 0.5442)] == air) {
					character.position[1] += 0.0442;
				}
			} else {
				if (character.position[1] + 0.5625 < worldSize + 1 && world[Math.floor(character.position[0])][Math.floor(character.position[1] + 0.5625)] == air && world[Math.floor(character.position[0] + 0.5)][Math.floor(character.position[1] + 0.5625)] == air) {
					character.position[1] += 0.0625;
				}
			}
			character.animated = true;
		}
		if (keysDown.includes(65)) {
			character.animation = 2;
			if (keysDown.includes(87) || keysDown.includes(83)) {
				if (character.position[0] - 0.0442 > 0 && world[Math.floor(character.position[0] - 0.0442)][Math.floor(character.position[1])] == air && world[Math.floor(character.position[0] - 0.0442)][Math.floor(character.position[1] + 0.5)] == air) {
					character.position[0] -= 0.0442;
				}
			} else {
				if (character.position[0] - 0.0625 > 0 && world[Math.floor(character.position[0] - 0.0625)][Math.floor(character.position[1])] == air && world[Math.floor(character.position[0] - 0.0625)][Math.floor(character.position[1] + 0.5)] == air) {
					character.position[0] -= 0.0625;
				}
			}
			character.animated = true;
		}
		if (keysDown.includes(68)) {
			character.animation = 3;
			if (keysDown.includes(87) || keysDown.includes(83)) {
				if (character.position[0] + 0.5442 < worldSize + 1 && world[Math.floor(character.position[0] + 0.5442)][Math.floor(character.position[1])] == air && world[Math.floor(character.position[0] + 0.5442)][Math.floor(character.position[1] + 0.5)] == air) {
					character.position[0] += 0.0442;
				}
			} else {
				if (character.position[0] + 0.5625 < worldSize + 1 && world[Math.floor(character.position[0] + 0.5625)][Math.floor(character.position[1])] == air && world[Math.floor(character.position[0] + 0.5625)][Math.floor(character.position[1] + 0.5)] == air) {
					character.position[0] += 0.0625;
				}
			}
			character.animated = true;
		}
	}
	cameraPos = [character.position[0] - 6.25, character.position[1] - 4.25];
	if (cameraPos[0] < 0) {
		cameraPos[0] = 0
	} else if (cameraPos[0] > worldSize - 13) {
		cameraPos[0] = worldSize - 13;
	}
	if (cameraPos[1] < 0) {
		cameraPos[1] = 0
	} else if (cameraPos[1] > worldSize - 9) {
		cameraPos[1] = worldSize - 9;
	}
	if (step % 6 == 0) {
		if (character.animated || character.using) {
			character.animationPhase++;
			if (character.animationPhase >= 4) {
				character.animationPhase = 0;
				character.using = false;
			}
		} else {
			character.animationPhase = 0;
		}
	}
}

function useItems() {
	switch (character.animation) {
		case 0:
			if (character.position[1] >= 1) {
				if (world[Math.floor(character.position[0] + 0.25)][Math.floor(character.position[1] - 1)] != air) {
					world[Math.floor(character.position[0] + 0.25)][Math.floor(character.position[1] - 1)] = air;
				}
			}
			break;
		case 1:
			if (character.position[1] <= worldSize - 1) {
				if (world[Math.floor(character.position[0] + 0.25)][Math.floor(character.position[1] + 1.5)] != air) {
					world[Math.floor(character.position[0] + 0.25)][Math.floor(character.position[1] + 1.5)] = air;
				}
			}
			break;
		case 2:
		  if (character.position[0] >= 1) {
				if (world[Math.floor(character.position[0] - 1)][Math.floor(character.position[1] + 0.25)] != air) {
					world[Math.floor(character.position[0] - 1)][Math.floor(character.position[1] + 0.25)] = air;
				}
			}
			break;
		case 3:
			if (character.position[0] <= worldSize - 1) {
				if (world[Math.floor(character.position[0] + 1.5)][Math.floor(character.position[1] + 0.25)] != air) {
					world[Math.floor(character.position[0] + 1.5)][Math.floor(character.position[1] + 0.25)] = air;
				}
			}

			break;
	}
}

var step = 0;
function tick() {
	ctx.clearRect(0, 0, 960, 720);
	controllsAndAnimation();
	if (character.using && character.animationPhase == 2 && step % 6 == 0) {
		useItems();
	}
	drawTiles();
	drawCharacter();
	step++;
}

function detectLoaded() {
	if (assetsLoaded == 6) {
		clearInterval(loadInterval)
		setInterval(tick, 30);
	}
	console.log(assetsLoaded);
}
var loadInterval = setInterval(detectLoaded, 500)
