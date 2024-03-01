class Node {
	constructor(x, y, size, title = "title", description = "desc") {
		this.x = x;
		this.y = y;
		this.size = size;
		this.title = title;
		this.desc = description;
		this.color = 0xabcdef;
		this.connections = [];
	}
	draw() {
		graphics.lineStyle(2, 0xffffff);
		for (const node of this.connections) {
			graphics.moveTo(app.screen.width/2 + camera.x + this.x, app.screen.height/2 + camera.y + this.y);
			graphics.lineTo(app.screen.width/2 + camera.x + node.x, app.screen.height/2 + camera.y + node.y);
		}
		graphics.lineStyle(0, 0xffffff);
		graphics.beginFill(this.color);
		graphics.drawRect(
			app.screen.width/2 - this.size/2 + camera.x + this.x,
			app.screen.height/2 - this.size/2 + camera.y + this.y,
			this.size,
			this.size);
		graphics.endFill();
	}
}

class Course extends Node {
	constructor(x, y, size, name = "name", description = "desc", id = "id", prerequisites = "prereq") {
		super(x, y, size, name, description);
		this.id = id;
		this.prereqs = prerequisites;
	}
}

PIXI.BitmapFont.from("fps");
const app = new PIXI.Application({antialias: true, background: 0x123456, resizeTo: window});
const graphics = new PIXI.Graphics();
const fpsText = new PIXI.BitmapText("0", {fontName: "fps"});
const camera = {x:0, y:0, zoom:1};
const nodes = [new Node(0, 0, 128), new Node(200, 100, 128)];
nodes[0].connections.push(nodes[1]);
app.stage.addChild(graphics);
app.stage.addChild(fpsText);
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.on("pointerdown", () => drag = true);
app.stage.on("pointermove", onMove);
app.stage.on("pointerup", () => drag = false);
app.ticker.add(draw);
window.setInterval(() => fpsText.text = Math.round(app.ticker.FPS), 1000);

function draw(delta) {
	graphics.clear();
	const shortestSide = Math.min(app.screen.width, app.screen.height);
	for (const node of nodes) node.draw(shortestSide);
}

function onMove(event) {
	if (!drag) return;
	camera.x += event.movement.x;
	camera.y += event.movement.y;
}

var drag = false;