PIXI.BitmapFont.from("fps");
const app = new PIXI.Application({antialias: true, background: 0x123456, resizeTo: window});
const graphics = new PIXI.Graphics();
const fpsText = new PIXI.BitmapText("0", {fontName: "fps"});
const camera = {x:0, y:0, zoom:1};
app.stage.addChild(graphics);
app.stage.addChild(fpsText);
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.on("pointerdown", onClick);
app.stage.on("pointermove", onMove);
app.stage.on("pointerup", onRelease);
app.ticker.add(draw);
window.setInterval(() => fpsText.text = Math.round(app.ticker.FPS), 1000);

function draw(delta) {
	graphics.clear();
	drawSquare();
}

function drawSquare() {
	const shortestSide = Math.min(app.screen.width, app.screen.height);
	graphics.beginFill(0xabcdef);
	graphics.drawRect(
		app.screen.width/2 - shortestSide/10 + camera.x,
		app.screen.height/2 - shortestSide/10 + camera.y,
		shortestSide/5,
		shortestSide/5);
	graphics.endFill();
}

function onClick(event) {
	drag = true;
}

function onMove(event) {
	if (!drag) return;
	camera.x += event.movement.x;
	camera.y += event.movement.y;
}

function onRelease(event) {
	drag = false;
}

function init() {
	document.body.appendChild(app.view);
}

var drag = false;