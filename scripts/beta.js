var canvas;
var ctx;
var OBJECTS = 4;
var BALLS = 0;
var INIT_DISP = 3;
var COLISIONS = true;
var OUTER = 400;

var buttonClick = false;
var mousex;
var mousey;
var objects;
var balls;

function circle(x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, true);
	ctx.fill();
}

function rect(x, y, w, h) {
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.closePath();
	ctx.fill();
}

var loadedImages = 0;

Bonus = {
	img1: null,
	img2: null,

	init: function () {
		objects = new Array();

		for (var i = 0; i < OBJECTS; i++) {
			xobj = Math.random() * 600 + 100;
			yobj = Math.random() * 400 + 100;
			objects.push([xobj, yobj, Math.random() * 20]);
		}

		balls = new Array();

		ctx.fillStyle = "rgba(255, 255, 255, 1)";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		if (!this.img1) {
			this.img1 = new Image();
			this.img1.src = 'images/jquery.png';
			this.img1.onload = function () {
				loadedImages += 1;
			}
		}
		if (!this.img2) {
			this.img2 = new Image();
			this.img2.src = 'images/html5.png';
			this.img2.onload = function () {
				loadedImages += 1;
			}
		}
	},

	draw: function () {
		if (loadedImages == 2) {
			ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			ctx.fillStyle = "#DDD";
			for (var i = 0; i < objects.length; i++) {
				xo = objects[i][0];
				yo = objects[i][1];
				ro = objects[i][2];
				ctx.fillStyle = "#444444";
				circle(xo, yo, ro);
			}

			for (var j = 0; j < balls.length; j++) {
				x = balls[j][0];
				y = balls[j][1];
				if (balls[j][4] == 1) {
					for (var i = 0; i < objects.length; i++) {
						xo = objects[i][0];
						yo = objects[i][1];
						ro = objects[i][2];

						dist2 = Math.pow((xo - x), 2) + Math.pow((yo - y), 2);
						dist = Math.sqrt(dist2);

						f = G_CONST * ro / dist2;
						fdist = f / dist;

						xv = fdist * (xo - x);
						yv = fdist * (yo - y);

						balls[j][2] += xv;
						balls[j][3] += yv;

						if (x > WIDTH + OUTER ||
							x < -OUTER ||
							y > HEIGHT + OUTER ||
							y < -OUTER
						) {
							balls[j][4] = 0;
						}

						if (dist < ro && COLISIONS) {
							balls[j][4] = 0;
						}
					}

					var red = 0;
					var v = Math.abs(balls[j][2]) + Math.abs(balls[j][3]);
					if (v > 4) {
						red = 255;
					} else {
						red = 255 * v / 4;
					}

					var green = 255 - red;

					if (j % 2 == 0) {
						ctx.fillStyle = "rgb(" + Math.round(red) + "," + Math.round(green) + ", 255)";
					} else {
						ctx.fillStyle = "rgb(" + Math.round(red) + "," + Math.round(green) + ", 0)";
					}
					circle(x, y, 1.5);
					balls[j][0] += balls[j][2];
					balls[j][1] += balls[j][3];
				}
			}
			ctx.drawImage(this.img2, 100, 100);
			ctx.drawImage(this.img1, 500, 400);
		}
	}
}