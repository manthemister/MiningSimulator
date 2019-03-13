//get the canvas element
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//load tile images
var tileImages = [], assetsLoaded = 0;
function loadImages() {
	for (let i = 0; i < loadImages.arguments.length; i++) {
		tileImages[i] = new Image();
		tileImages[i].src = loadImages.arguments[i];
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

//create character object
var character = {
	animation: 1,
	pos: [8.25, 8.25],
	image: new Image(),
	animated: false,
	animationPhase: 0,
	using: false
}
character.image.src = "assets/Hero.png";

function isInChunk(x, y) {
	for (let i = 0; i < world.length; i++) {
		if (world[i].pos[0] == Math.floor(x / 16) && world[i].pos[1] == Math.floor(y / 16)) {
			return i;
		}
	}
	return false;
}
var world = [], wipCoal = [], wipIron = [], wipGold = [], wipAir = [];
function generateChunk(chunkX, chunkY) {
	let chunk = {
		pos: [chunkX, chunkY],
		tiles: []
	}
	for (let x = 0; x < 16; x++) {
		chunk.tiles[x] = [];
		for (let y = 0; y < 16; y++) {
			chunk.tiles[x][y] = [(chunkX * 16) + x, (chunkY * 16) + y, stone]
		}
	}
	//generate coal veins
	for (let i = 0; i < 4; i++) {
		if (Math.floor(Math.random() * 2) == 0) {
			let veinSize = Math.floor((Math.random() * 2)) + 2, initVeinPos = [(chunk.pos[0] * 16) + Math.floor(Math.random() * 16), (chunk.pos[1] * 16) + Math.floor(Math.random() * 16)];
			chunk.tiles[initVeinPos[0] - (chunk.pos[0] * 16)][initVeinPos[1] - (chunk.pos[1] * 16)][2] = coalOre;
			for (let i2 = 0; i2 < 4; i2++) {
				veinPos = $.extend([], initVeinPos)
				for (let i3 = 0; i3 < veinSize; i3++) {
					let veinMotion = Math.floor(Math.random() * 2.5);
					if (veinMotion < 2) {
						if (veinMotion == 1) {
							veinPos[0] += Math.floor(Math.random() * 3 - 1);
						} else {
							veinPos[1] += Math.floor(Math.random() * 3 - 1);
						}
					} else {
						veinPos[0] += Math.floor(Math.random() * 3 - 1);
						veinPos[1] += Math.floor(Math.random() * 3 - 1);
					}
					if (veinPos[0] - (chunk.pos[0] * 16) >= 0 && veinPos[0]  - (chunk.pos[0] * 16) < 16 && veinPos[1]  - (chunk.pos[1] * 16) >= 0 && veinPos[1] - (chunk.pos[1] * 16) < 16) {
						chunk.tiles[veinPos[0] - (chunk.pos[0] * 16)][veinPos[1] - (chunk.pos[1] * 16)][2] = coalOre;
					} else if (isInChunk(veinPos[0], veinPos[1]) !== false) {
						world[isInChunk(veinPos[0], veinPos[1])].tiles[veinPos[0] - world[isInChunk(veinPos[0], veinPos[1])].pos[0] * 16][veinPos[1] - world[isInChunk(veinPos[0], veinPos[1])].pos[1] * 16][2] = coalOre;
				  } else if (wipCoal.includes(veinPos) == false) {
						wipCoal.push(veinPos);
					}
				}
			}
		}
	}
	for (let i = 0; i < wipCoal.length; i++) {
		if (wipCoal[i][0] !== false) {
			if (Math.floor(wipCoal[i][0] / 16) == chunk.pos[0] && Math.floor(wipCoal[i][1] / 16) == chunk.pos[1]) {
				chunk.tiles[wipCoal[i][0] - (chunk.pos[0] * 16)][wipCoal[i][1] - (chunk.pos[1] * 16)][2] = coalOre;
				wipCoal[i][0] = false;
			}
		}
	}
	//generate iron veins
	for (let i = 0; i < 3; i++) {
		if (Math.floor(Math.random() * 2) == 0) {
			let veinSize = Math.floor((Math.random() * 2)) + 1, initVeinPos = [(chunk.pos[0] * 16) + Math.floor(Math.random() * 16), (chunk.pos[1] * 16) + Math.floor(Math.random() * 16)];
			chunk.tiles[initVeinPos[0] - (chunk.pos[0] * 16)][initVeinPos[1] - (chunk.pos[1] * 16)][2] = ironOre;
			for (let i2 = 0; i2 < 4; i2++) {
				veinPos = $.extend([], initVeinPos)
				for (let i3 = 0; i3 < veinSize; i3++) {
					let veinMotion = Math.floor(Math.random() * 2.5);
					if (veinMotion < 2) {
						if (veinMotion == 1) {
							veinPos[0] += Math.floor(Math.random() * 3 - 1);
						} else {
							veinPos[1] += Math.floor(Math.random() * 3 - 1);
						}
					} else {
						veinPos[0] += Math.floor(Math.random() * 3 - 1);
						veinPos[1] += Math.floor(Math.random() * 3 - 1);
					}
					if (veinPos[0] - (chunk.pos[0] * 16) >= 0 && veinPos[0]  - (chunk.pos[0] * 16) < 16 && veinPos[1]  - (chunk.pos[1] * 16) >= 0 && veinPos[1] - (chunk.pos[1] * 16) < 16) {
						chunk.tiles[veinPos[0] - (chunk.pos[0] * 16)][veinPos[1] - (chunk.pos[1] * 16)][2] = ironOre;
					} else if (isInChunk(veinPos[0], veinPos[1]) !== false) {
						world[isInChunk(veinPos[0], veinPos[1])].tiles[veinPos[0] - world[isInChunk(veinPos[0], veinPos[1])].pos[0] * 16][veinPos[1] - world[isInChunk(veinPos[0], veinPos[1])].pos[1] * 16][2] = ironOre;
				  } else if (wipIron.includes(veinPos) == false) {
						wipIron.push(veinPos);
					}
				}
			}
		}
	}
	for (let i = 0; i < wipIron.length; i++) {
		if (wipIron[i][0] !== false) {
			if (Math.floor(wipIron[i][0] / 16) == chunk.pos[0] && Math.floor(wipIron[i][1] / 16) == chunk.pos[1]) {
				chunk.tiles[wipIron[i][0] - (chunk.pos[0] * 16)][wipIron[i][1] - (chunk.pos[1] * 16)][2] = ironOre;
				wipIron[i][0] = false;
			}
		}
	}
	//generate gold veins
	for (let i = 0; i < 2; i++) {
		if (Math.floor(Math.random() * 2) == 0) {
			let veinSize = Math.floor((Math.random() * 2)) + 1, initVeinPos = [(chunk.pos[0] * 16) + Math.floor(Math.random() * 16), (chunk.pos[1] * 16) + Math.floor(Math.random() * 16)];
			chunk.tiles[initVeinPos[0] - (chunk.pos[0] * 16)][initVeinPos[1] - (chunk.pos[1] * 16)][2] = goldOre;
			for (let i2 = 0; i2 < 4; i2++) {
				veinPos = $.extend([], initVeinPos)
				for (let i3 = 0; i3 < veinSize; i3++) {
					let veinMotion = Math.floor(Math.random() * 2.5);
					if (veinMotion < 2) {
						if (veinMotion == 1) {
							veinPos[0] += Math.floor(Math.random() * 3 - 1);
						} else {
							veinPos[1] += Math.floor(Math.random() * 3 - 1);
						}
					} else {
						veinPos[0] += Math.floor(Math.random() * 3 - 1);
						veinPos[1] += Math.floor(Math.random() * 3 - 1);
					}
					if (veinPos[0] - (chunk.pos[0] * 16) >= 0 && veinPos[0]  - (chunk.pos[0] * 16) < 16 && veinPos[1]  - (chunk.pos[1] * 16) >= 0 && veinPos[1] - (chunk.pos[1] * 16) < 16) {
						chunk.tiles[veinPos[0] - (chunk.pos[0] * 16)][veinPos[1] - (chunk.pos[1] * 16)][2] = goldOre;
					} else if (isInChunk(veinPos[0], veinPos[1]) !== false) {
						world[isInChunk(veinPos[0], veinPos[1])].tiles[veinPos[0] - world[isInChunk(veinPos[0], veinPos[1])].pos[0] * 16][veinPos[1] - world[isInChunk(veinPos[0], veinPos[1])].pos[1] * 16][2] = goldOre;
				  } else if (wipGold.includes(veinPos) == false) {
						wipGold.push(veinPos);
					}
				}
			}
		}
	}
	for (let i = 0; i < wipGold.length; i++) {
		if (wipGold[i][0] !== false) {
			if (Math.floor(wipGold[i][0] / 16) == chunk.pos[0] && Math.floor(wipGold[i][1] / 16) == chunk.pos[1]) {
				chunk.tiles[wipGold[i][0] - (chunk.pos[0] * 16)][wipGold[i][1] - (chunk.pos[1] * 16)][2] = goldOre;
				wipGold[i][0] = false;
			}
		}
	}
	//caves
	if (Math.random() * 1.1 >= 1) {
		for (let i = 0; i < 8; i++) {
			let direction = Math.floor(Math.random() * 8);
			switch (direction) {
				case 0:
					if (isInChunk((chunk.pos[0] + 1) * 16, chunk.pos[1] * 16) === false) {
						continue;
					}
					break;
				case 1:
					if (isInChunk((chunk.pos[0] + 1) * 16, (chunk.pos[1] + 1) * 16) === false) {
						continue;
					}
					break;
				case 2:
					if (isInChunk(chunk.pos[0] * 16, (chunk.pos[1] + 1) * 16) === false) {
						continue;
					}
					break;
				case 3:
					if (isInChunk((chunk.pos[0] - 1) * 16, (chunk.pos[1] + 1) * 16) === false) {
						continue;
					}
					break;
				case 4:
					if (isInChunk((chunk.pos[0] - 1) * 16, chunk.pos[1] * 16) === false) {
						continue;
					}
					break;
				case 5:
					if (isInChunk((chunk.pos[0] - 1) * 16, (chunk.pos[1] - 1) * 16) === false) {
						continue;
					}
					break;
				case 6:
					if (isInChunk(chunk.pos[0] * 16, (chunk.pos[1] - 1) * 16) === false) {
						continue;
					}
					break;
				case 7:
					if (isInChunk((chunk.pos[0] + 1) * 16, (chunk.pos[1] - 1) * 16) === false) {
						continue;
					}
					break;
			}
			//do stuff below
			let cave = {
				length: Math.floor((Math.random() * 128) + 128),
				width: Math.random() + 1
				pos: [(chunk.pos[0] * 16) + Math.floor(Math.random() * 16), (chunk.pos[1] * 16) + Math.floor(Math.random() * 16)],
				motion: direction
			}
			for (let x = )
			//do stuff above
			break;
		}
	}
	world.push(chunk);
}

function drawTiles() {
	let chunksDrawn = 0;
	for (let i = 0; i < world.length; i++) {
		if (world[i].pos[0] >= Math.round(character.pos[0] / 16) - 1 && world[i].pos[0] <= Math.round(character.pos[0] / 16) && world[i].pos[1] >= Math.round(character.pos[1] / 16) - 1 && world[i].pos[1] <= Math.round(character.pos[1] / 16)) {
			for (let x = 0; x < 16; x++) {
				for (let y = 0; y < 16; y++) {
					if (world[i].tiles[x][y][0] + 1 > cameraPos[0] && world[i].tiles[x][y][0] < cameraPos[0] + 13 && world[i].tiles[x][y][1] + 1 > cameraPos[1] && world[i].tiles[x][y][1] < cameraPos[1] + 9) {
						ctx.drawImage(tileImages[world[i].tiles[x][y][2]], Math.floor((world[i].tiles[x][y][0] - cameraPos[0]) * 32), Math.floor((world[i].tiles[x][y][1] - cameraPos[1]) * 32));
					}
				}
			}
			chunksDrawn += 1;
			if (chunksDrawn >= 4) {
				break;
			}
			world.unshift(world[i])
			world.splice(i + 1, 1)
		}
	}
}

/*function generateCaves() {
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
					cavePos[0] -= 1;
					cavePos[1] += 1;
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
					cavePos[0] += 1;
					cavePos[1] -= 1;
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
		}
	}
}*/

function drawCharacter() {
	if (character.using) {
		ctx.drawImage(character.image, character.animationPhase * 16, (character.animation + 4) * 16, 16, 16, Math.floor((character.pos[0] - cameraPos[0]) * 32), Math.floor((character.pos[1] - cameraPos[1]) * 32), 16, 16);
	} else {
		ctx.drawImage(character.image, character.animationPhase * 16, character.animation * 16, 16, 16, Math.floor((character.pos[0] - cameraPos[0]) * 32), Math.floor((character.pos[1] - cameraPos[1]) * 32), 16, 16);
	}
}

function getTileInfo(x, y) {
	for (let i = 0; i < world.length; i++) {
		if (world[i].pos[0] == Math.floor(x / 16) && world[i].pos[1] == Math.floor(y / 16)) {
			return world[i].tiles[x - (Math.floor(x / 16) * 16)][y - (Math.floor(y / 16) * 16)];
		}
	}
}

function genNewChunks() {
	for (let x = -1; x < 2; x++) {
		for (let y = -1; y < 2; y++) {
			if (isInChunk(character.pos[0] + (x * 16), character.pos[1] + (y * 16)) === false) {
				generateChunk(Math.floor((character.pos[0] + (x * 16)) / 16), Math.floor((character.pos[1] + (y * 16)) / 16))
			}
		}
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
				if (getTileInfo(Math.floor(character.pos[0]), Math.floor(character.pos[1] - 0.0442))[2] == air && getTileInfo(Math.floor(character.pos[0] + 0.5), Math.floor(character.pos[1] - 0.0442))[2] == air) {
					character.pos[1] -= 0.0442;
				}
			} else {
				if (getTileInfo(Math.floor(character.pos[0]), Math.floor(character.pos[1] - 0.0625))[2] == air && getTileInfo(Math.floor(character.pos[0] + 0.5), Math.floor(character.pos[1] - 0.0625))[2] == air) {
					character.pos[1] -= 0.0625;
				}
			}
			character.animated = true;
		}
		if (keysDown.includes(83)) {
			character.animation = 1;
			if (keysDown.includes(68) || keysDown.includes(65)) {
				if (getTileInfo(Math.floor(character.pos[0]), Math.floor(character.pos[1] + 0.5442))[2] == air && getTileInfo(Math.floor(character.pos[0] + 0.5), Math.floor(character.pos[1] + 0.5442))[2] == air) {
					character.pos[1] += 0.0442;
				}
			} else {
				if (getTileInfo(Math.floor(character.pos[0]), Math.floor(character.pos[1] + 0.5625))[2]  == air && getTileInfo(Math.floor(character.pos[0] + 0.5), Math.floor(character.pos[1] + 0.5625))[2] == air) {
					character.pos[1] += 0.0625;
				}
			}
			character.animated = true;
		}
		if (keysDown.includes(65)) {
			character.animation = 2;
			if (keysDown.includes(87) || keysDown.includes(83)) {
				if (getTileInfo(Math.floor(character.pos[0] - 0.0442), Math.floor(character.pos[1]))[2] == air && getTileInfo(Math.floor(character.pos[0] - 0.0442), Math.floor(character.pos[1] + 0.5))[2] == air) {
					character.pos[0] -= 0.0442;
				}
			} else {
				if (getTileInfo(Math.floor(character.pos[0] - 0.0625), Math.floor(character.pos[1]))[2] == air && getTileInfo(Math.floor(character.pos[0] - 0.0625), Math.floor(character.pos[1] + 0.5))[2] == air) {
					character.pos[0] -= 0.0625;
				}
			}
			character.animated = true;
		}
		if (keysDown.includes(68)) {
			character.animation = 3;
			if (keysDown.includes(87) || keysDown.includes(83)) {
				if (getTileInfo(Math.floor(character.pos[0] + 0.5442), Math.floor(character.pos[1]))[2] == air && getTileInfo(Math.floor(character.pos[0] + 0.5442), Math.floor(character.pos[1] + 0.5))[2] == air) {
					character.pos[0] += 0.0442;
				}
			} else {
				if (getTileInfo(Math.floor(character.pos[0] + 0.5625), Math.floor(character.pos[1]))[2] == air && getTileInfo(Math.floor(character.pos[0] + 0.5625), Math.floor(character.pos[1] + 0.5))[2] == air) {
					character.pos[0] += 0.0625;
				}
			}
			character.animated = true;
		}
	}
	cameraPos = [character.pos[0] - 6.25, character.pos[1] - 4.25];
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
			if (getTileInfo(Math.floor(character.pos[0] + 0.25), Math.floor(character.pos[1] - 1))[2] != air) {
				world[isInChunk(Math.floor(character.pos[0] + 0.25), Math.floor(character.pos[1] - 1))].tiles[Math.floor(character.pos[0] + 0.25) - (Math.floor((character.pos[0] + 0.25) / 16) * 16)][Math.floor(character.pos[1] - 1) - (Math.floor((character.pos[1] - 1) / 16) * 16)][2] = air;
			}
			break;
		case 1:
			if (getTileInfo(Math.floor(character.pos[0] + 0.25), Math.floor(character.pos[1] + 1.5))[2] != air) {
				world[isInChunk(Math.floor(character.pos[0] + 0.25), Math.floor(character.pos[1] + 1.5))].tiles[Math.floor(character.pos[0] + 0.25) - (Math.floor((character.pos[0] + 0.25) / 16) * 16)][Math.floor(character.pos[1] + 1.5) - (Math.floor((character.pos[1] + 1.5) / 16) * 16)][2] = air;
			}
			break;
		case 2:
			if (getTileInfo(Math.floor(character.pos[0] - 1), Math.floor(character.pos[1] + 0.25))[2] != air) {
				world[isInChunk(Math.floor(character.pos[0] - 1), Math.floor(character.pos[1] + 0.25))].tiles[Math.floor(character.pos[0] - 1) - (Math.floor((character.pos[0] - 1) / 16) * 16)][Math.floor(character.pos[1] + 0.25) - (Math.floor((character.pos[1] + 0.25) / 16) * 16)][2] = air;
			}
			break;
		case 3:
			if (getTileInfo(Math.floor(character.pos[0] + 1.5), Math.floor(character.pos[1] + 0.25))[2] != air) {
				world[isInChunk(Math.floor(character.pos[0] + 1.5), Math.floor(character.pos[1] + 0.25))].tiles[Math.floor(character.pos[0] + 1.5) - (Math.floor((character.pos[0] + 1.5) / 16) * 16)][Math.floor(character.pos[1] + 0.25) - (Math.floor((character.pos[1] + 0.25) / 16) * 16)][2] = air;
			}
			break;
	}
}

for (x = -1; x < 2; x++) {
	for (y = -1; y < 2; y++) {
		generateChunk(x, y);
	}
}
for (i = 0; i < world.length; i++) {
	if (world[i].pos[0] == 0 && world[i].pos[1] == 0) {
		world[i].tiles[8][8][2] = air;
		break;
	}
}

var step = 0;
function tick() {
	ctx.clearRect(0, 0, 960, 720);
	genNewChunks();
	controllsAndAnimation();
	if (character.using && character.animationPhase == 2 && step % 6 == 0) {
		useItems();
	}
	drawTiles();
	drawCharacter();
	document.getElementById("position").innerHTML = "x: " + (Math.floor(character.pos[0] * 100) / 100) + " y: " + (Math.floor(character.pos[1] * 100) / 100);
	step++;
}
setInterval(tick, 30);
