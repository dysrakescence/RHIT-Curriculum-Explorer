//https://pixijs.download/v8.0.0-rc.10/docs/index.html

async function init() {
	const app = new PIXI.Application();
	await app.init({
		antialias: true,
		background: 0x123456,
		resizeTo: window
	});
	document.body.appendChild(app.canvas);
	const graphics = new PIXI.Graphics();
	graphics.fillStyle = 0xabcdef;
	graphics.rect(50, 50, 100, 100);
	graphics.fill();
	graphics.fillStyle = 0xfedcba;
	graphics.circle(250, 100, 50);
	graphics.fill();
	app.stage.addChild(graphics);
}