var canvas;
var ctx;
var WIDTH = 800;
var HEIGHT = 600;
var G_CONST = 30;
var OUTER = 400;

var buttonClick = false;

var lastTime = (new Date()).getDate();
var timeDiff = 0;
var appState = 1;
var logTable = [];
var logInput;

var buttons = [];

var unlocked = 1;
var LEVEL = 1;

var AppState = 1;
var state = {
	START: 1,
	LEVEL: 2,
	SUCCESS: 3,
	FAIL: 4,
	GRATZ: 5,
	BONUS: 6
}

var imageObj = new Image();
imageObj.src = 'images/b1.jpg';

function init() {

	logInput = $('#appLog');
	window.requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
        	window.setTimeout(callback, 1000 / 60);
        };
	})();

	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	AppState = state.START;

	InitButtons();

	canvas.addEventListener('mousedown', canvasClick, false);
	canvas.addEventListener('mousemove', canvasMove, false);
	canvas.addEventListener('mouseup', canvasUp, false);
	$('#fontLoader').hide();
	draw();
}

var Mouse = {
	x: 0,
	y: 0,
	distance: 0,
	force: function () {
		f = (Mouse.distance * 4) / this.maxForce;
		if (f < 1) f = 1;
		if (f > this.maxForce) f = this.maxForce;
		return f;
	},
	maxForce: 40
}

var Gun = {
	x: 0,
	y: 0,
	x1: 0,
	y1: 0,
	x2: 0,
	y2: 0,
	len: 0,
	a: 0,
	AmmoType: 1,
	draw: function () {
		
		Gun.x1 = this.x;
		Gun.y1 = this.y;

		Mouse.distance = Math.sqrt(Math.pow(Mouse.x - Gun.x1, 2) + Math.pow(Mouse.y - Gun.y1, 2));

		Gun.len = 30;
		Gun.a = Math.atan2(Mouse.x - Gun.x1, Mouse.y - Gun.y1);
		Gun.x2 = (Mouse.x - Gun.x1) * Gun.len / Mouse.distance + Gun.x1;
		Gun.y2 = (Mouse.y - Gun.y1) * Gun.len / Mouse.distance + Gun.y1;

		ctx.fillStyle = "#5aA";
		ctx.lineWidth = 3;
		ctx.strokeStyle = this.parent.stroke;

		ctx.save();
		ctx.translate(Gun.x1, Gun.y1);
		ctx.rotate(-Gun.a);
        ctx.beginPath();
		ctx.moveTo(-Gun.len / 8, 0);
		ctx.lineTo(-Gun.len / 8 + Gun.len / 16, Gun.len);
		ctx.lineTo(Gun.len / 8 - Gun.len / 16, Gun.len);
		ctx.lineTo(Gun.len / 8, 0);
		ctx.lineTo(-Gun.len / 8, 0);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();

		ctx.beginPath();
		ctx.arc(0, 0, Gun.len / 2, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();

		ctx.restore();
	}
}

var Meter = {
	width: WIDTH / 30,
	height: HEIGHT / 2,
	draw: function () {
		ctx.save();
		ctx.fillStyle = "rgba(150,150,150,0.5)";
		ctx.fillRect(WIDTH - this.width - this.width / 2, HEIGHT - this.height - this.width / 2, this.width, this.height);
		ctx.fillStyle = "rgba(200,200,200,0.5)";
		var power = Mouse.force() * this.height / Mouse.maxForce;
		ctx.fillRect(WIDTH - this.width - this.width / 2, HEIGHT - power - this.width / 2, this.width, power);
		ctx.restore();
	}
}

var Level = {
	objects: null,
	bullets: null,
	sun: null,
	stars: 0,
	
	CalculateBulletsPositions: function () {
		for (var j = 0; j < this.bullets.length; j++) {
			if (this.bullets[j].active == true) {

				for (var i = 0; i < this.objects.length; i++) {
					dist2 = Math.pow((this.objects[i].x - this.bullets[j].x), 2) + Math.pow((this.objects[i].y - this.bullets[j].y), 2);
					dist = Math.sqrt(dist2);
					lastDist = Math.sqrt(Math.pow((this.objects[i].x - this.bullets[j].lastx()), 2) + Math.pow((this.objects[i].y - this.bullets[j].lasty()), 2));

					f = G_CONST * (this.objects[i].r - this.objects[i].holes.length * 0.5) / dist2;
					fdist = f / dist;

					xv = fdist * (this.objects[i].x - this.bullets[j].x);
					yv = fdist * (this.objects[i].y - this.bullets[j].y);

					if (dist > this.objects[i].r) {
						this.bullets[j].dx += xv;
						this.bullets[j].dy += yv;
					}

					if (this.bullets[j].x > WIDTH + OUTER ||
						this.bullets[j].x < -OUTER ||
						this.bullets[j].y > HEIGHT + OUTER ||
						this.bullets[j].y < -OUTER
					) {
						this.bullets[j].active = false;
					}

					if (this.bullets[j].active && dist < this.objects[i].r ||
						this.bullets[j].active && lastDist < this.objects[i].r
						) {
						holehit = 0;
						for (k = 0; k < this.objects[i].holes.length; k++) {
							dist2hole = Math.sqrt(
								Math.pow((this.objects[i].holes[k].x - this.bullets[j].x), 2) +
								Math.pow((this.objects[i].holes[k].y - this.bullets[j].y), 2)
							);
							if (dist2hole < this.objects[i].holes[k].r) {
								holehit++;
							}
						}

						if (holehit == 0) {
							this.bullets[j].active = false;
							a = Math.atan2(this.bullets[j].x - this.objects[i].x, this.bullets[j].y - this.objects[i].y);
							this.objects[i].holes.push(
								new Planet(-a + Math.PI / 2, this.bullets[j].power, dist, 0, this.objects[i], true)
							);
							if (this.bullets[j].type == 1) {
								Sounds.Explosion();
							} else {
								Sounds.Popp();
							}
						}
					}

					for (var k = 0; k < this.objects[i].stars.length; k++) {
						if (this.objects[i].stars[k].active == true) {
							if (this.bullets[j].active &&
								Math.sqrt(
								Math.pow((this.objects[i].stars[k].x - this.bullets[j].x), 2) +
								Math.pow((this.objects[i].stars[k].y - this.bullets[j].y), 2)) <= this.objects[i].stars[k].r + this.objects[i].stars[k].r / 2
							) {
								this.objects[i].stars[k].active = false;
								Sounds.Gold();
								Level.stars -= 1;
							} else if (
								this.objects[i].holes.length > 0 &&
								Math.sqrt(
								Math.pow((this.objects[i].stars[k].x - this.objects[i].holes[this.objects[i].holes.length - 1].x), 2) +
								Math.pow((this.objects[i].stars[k].y - this.objects[i].holes[this.objects[i].holes.length - 1].y), 2)) <= this.objects[i].holes[this.objects[i].holes.length - 1].r + this.objects[i].stars[k].r
							) {
								this.objects[i].stars[k].active = false;
								Sounds.Gold();
								Level.stars -= 1;
							}
						}
					}
				}

				if (this.bullets[j].active == true) {
					this.bullets[j].draw();
				}
				this.bullets[j].x += this.bullets[j].dx;
				this.bullets[j].y += this.bullets[j].dy;
			}
		}
	},

	Draw: function () {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		this.objects = new Array();
		this.sun.setChildrenPositions();
		this.sun.draw();
		this.CalculateBulletsPositions();
		Meter.draw();

		if (Level.stars == 0) {
			unlocked = LEVEL + 1;
			AppState = state.SUCCESS;
			InitButtons();
		}
	}
}

var Bullet = function (x, y, dx, dy, type) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.active = true;
	this.a = 0;
	this.len = 20;
	this.type = type;
	this.power = 15;
	if (type == 2) {
		this.power = 8;
	}

	this.draw = function () {
		if (this.type == 1) {
			this.a = Math.atan2(this.dx, this.dy);

			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(-this.a);
			ctx.fillStyle = "#f21";
			ctx.strokeStyle = "#000";

			ctx.beginPath();
			ctx.moveTo(4, 0);
			ctx.lineTo(6, 0);
			ctx.lineTo(2, 10);
			ctx.lineTo(4, 0);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(-4, 0);
			ctx.lineTo(-6, 0);
			ctx.lineTo(-2, 10);
			ctx.lineTo(-4, 0);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(1, 0);
			ctx.lineTo(2, 10);
			ctx.lineTo(0, 20);
			ctx.lineTo(-2, 10);
			ctx.lineTo(-1, 0);
			ctx.lineTo(1, 0);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();

			ctx.restore();
		} else if(this.type == 2) {
			ctx.beginPath();
			ctx.fillStyle = "#f21";
			ctx.strokeStyle = "#110";
			ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, true);
			ctx.fill();
		}
	}

	this.lastx = function () {
		return this.x - this.dx/2;
	}
	this.lasty = function () {
		return this.y - this.dy/2;
	}
}

function draw() {
	var date = new Date();
	var time = date.getTime();
	timeDiff = time - lastTime;
	fps = 1000 / timeDiff;
	
	if (fps <= 50) {

		lastTime = time;

		switch (AppState) {
			case state.START:
				ctx.clearRect(0, 0, WIDTH, HEIGHT);
				//InitButtons(true);
				break;
			case state.LEVEL:
				Level.Draw();
				break;
			case state.SUCCESS:
				ctx.clearRect(0, 0, WIDTH, HEIGHT);
				break;
			case state.FAIL:
				ctx.clearRect(0, 0, WIDTH, HEIGHT);
				break;
			case state.BONUS:
				Bonus.draw();
				break;
		}
	}

	requestAnimFrame(function () {
		draw();
	});
}

function canvasClick(event) {
	if (AppState == state.LEVEL) {
		if (Level.bullets) {
			if (Gun.AmmoType == 1) {
				Level.bullets.push(
					new Bullet(Gun.x2, Gun.y2, (Gun.x2 - Gun.x1) * Mouse.force() / 100, (Gun.y2 - Gun.y1) * Mouse.force() / 100, Gun.AmmoType)
				);
			}
			else {
				var jiter = 1;
				var jitter1 = jiter / 2 - Math.random() * jiter;
				var jitter2 = jiter / 2 - Math.random() * jiter;
				var jitter3 = jiter / 2 - Math.random() * jiter;
				Level.bullets.push(
					new Bullet(Gun.x2, Gun.y2, (Gun.x2 - Gun.x1) * Mouse.force() / 90 + jitter1, (Gun.y2 - Gun.y1) * Mouse.force() / 90 + jitter3, Gun.AmmoType)
				);
				Level.bullets.push(
					new Bullet(Gun.x2, Gun.y2, (Gun.x2 - Gun.x1) * Mouse.force() / 90 + jitter2, (Gun.y2 - Gun.y1) * Mouse.force() / 90 + jitter1, Gun.AmmoType)
				);
				Level.bullets.push(
					new Bullet(Gun.x2, Gun.y2, (Gun.x2 - Gun.x1) * Mouse.force() / 90 + jitter3, (Gun.y2 - Gun.y1) * Mouse.force() / 90 + jitter2, Gun.AmmoType)
				);
			}
		}
		buttonClick = false;
	} else if (AppState == state.BONUS) {
		buttonClick = true;
		mousex = event.clientX;
		mousey = event.clientY;
		mousex -= canvas.offsetLeft;
		mousey -= canvas.offsetTop;
	}
}

function canvasUp(event) {
    buttonClick = false;
}

function canvasMove(event) {
    var x = event.clientX;
    var y = event.clientY;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    Mouse.x = x;
    Mouse.y = y;

    if (AppState == state.BONUS) {
    	if (buttonClick) {
    		var x = event.clientX;
    		var y = event.clientY;
			x -= canvas.offsetLeft;
    		y -= canvas.offsetTop;
    		disp = Math.random() * INIT_DISP - INIT_DISP / 2;
    		if (balls) {
    			balls.push([
					x + disp,
					y + disp,
					(x - mousex) / 2,
					(y - mousey) / 2,
					1
    			]);
    		}
    		mousex = x;
    		mousey = y;
    	}
    }
}