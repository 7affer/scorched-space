function resetBackground() {
	$('#canvas').css('background', 'url(images/b' + Math.round((Math.random() * 10) % 3 + 1) + '.jpg)');
}

function initLevel() {
	if (LEVEL == 1) {
		Level.sun = new Planet(0, 400, 0, 0, null, false, "#BB300F", "#220F1E", "#000");
		Level.stars = 3;

		gun = new Planet(-Math.PI * 2 / 3, 0, Level.sun.r + 10, 0, Level.sun);
		gun.draw = Gun.draw;

		Level.sun.x = WIDTH / 2;
		Level.sun.y = HEIGHT + Level.sun.r / 2;

		Level.sun.stars.push(new Planet(-Math.PI / 3, 10, Level.sun.r + 10, 0, Level.sun, true));
		Level.sun.stars.push(new Planet(-Math.PI / 3 - Math.PI / 10, 10, Level.sun.r + 10, 0, Level.sun, true));
		Level.sun.stars.push(new Planet(-Math.PI / 3 + Math.PI / 10, 10, Level.sun.r + 10, 0, Level.sun, true));
	}
	else if (LEVEL == 2) {
		Level.sun = new Planet(0, 400, 0, 0, null, false, "#ABC", "#ACB", "#000");
		earth = new Planet(-Math.PI / 2.5, 110, 650, 0, Level.sun, false, "#139", "#026", "#000");
		Level.stars = 3;

		gun = new Planet(-Math.PI * 1.8 / 3, 0, Level.sun.r + 10, 0, Level.sun);
		gun.draw = Gun.draw;

		Level.sun.x = WIDTH / 2;
		Level.sun.y = HEIGHT + Level.sun.r / 2;

		Level.sun.stars.push(new Planet(-Math.PI / 3 + Math.PI / 10, 10, Level.sun.r + 10, 0, Level.sun, true));
	}
	else if (LEVEL == 3) {
		Level.sun = new Planet(0, 400, 0, 0, null, false, "#FBC", "#AFB", "#000");
		earth = new Planet(-Math.PI / 2.5, 100, 680, 0, Level.sun, false, "#139", "#026", "#000");
		moon = new Planet(Math.PI / 8, 20, 150, Math.PI / 10, earth, false, "#A02", "#A10", "#000");
		moon.clouds = new Array();
		Level.stars = 4;

		gun = new Planet(-Math.PI * 1.8 / 3, 0, Level.sun.r + 10, 0, Level.sun);
		gun.draw = Gun.draw;

		Level.sun.x = WIDTH / 2;
		Level.sun.y = HEIGHT + Level.sun.r / 2;
	}
	else if (LEVEL == 4) {
		Level.sun = new Planet(0, 100, 0, 0, null, false, "#AF3", "#3EB", "#000");

		earth = new Planet(Math.PI / 10, 50, 300, 0, Level.sun, false, "#139", "#026", "#000");
		moon = new Planet(Math.PI / 8, 20, 100, 0, earth, false, "#AAA", "#666", "#000");
		mars = new Planet(Math.PI / 4, 30, 500, 0, Level.sun, false, "#521", "#A33", "#000");

		Level.stars = 6;

		gun = new Planet(Math.PI / 4, 0, Level.sun.r + 5, 0, Level.sun);
		gun.draw = Gun.draw;

		Level.sun.x = 120;
		Level.sun.y = 120;
	} else if (LEVEL == 5) {
		Level.sun = new Planet(0, 40, 0, 0, null, false, "#DE1F00", "#AEAF00", "#000");

		mercury = new Planet(Math.PI, 15, 100, Math.PI / 10, Level.sun, false, "#F00", "#210", "#000");
		earth = new Planet(-Math.PI / 3, 20, 200, Math.PI / 40, Level.sun, false, "#016", "#090", "#000");
		moon = new Planet(-Math.PI * 2 / 3, 10, 40, Math.PI / 6, earth, false, "#CCE", "#555", "#000");
		mars = new Planet(Math.PI / 4, 30, 250, Math.PI / 20, Level.sun, false, "#521", "#A33", "#000");

		Level.stars = 8;

		gun = new Planet(Math.PI / 4, 0, Level.sun.r + 5, 0, Level.sun);
		gun.draw = Gun.draw;

		Level.sun.x = WIDTH / 2;
		Level.sun.y = HEIGHT / 2;
	}
	Level.bullets = new Array();
	Level.objects = new Array();
}


var Planet = function (alpha, radius, distance, speed, parent, hole, color1, color2, stroke, holeColor) {
	this.active = true;
	this.children = new Array();
	this.holes = new Array();
	this.clouds = new Array();
	this.stars = new Array();
	this.patterns = new Array();
	this.x = 0;
	this.y = 0;
	this.a = alpha;
	this.d = distance;
	this.r = radius;
	this.speed = speed;
	this.currentRadius = 0;

	this.color1 = "#AAC";
	this.color2 = "#BBC";
	this.stroke = "#222";
	this.holeColor = "#0A0A0A";
	if (color1) this.color1 = color1;
	if (color2) this.color2 = color2;
	if (stroke) this.stroke = stroke;
	if (holeColor) this.holeColor = holeColor;

	if (parent) {
		this.parent = parent;
		if (!hole) {
			this.parent.children.push(this);
		}
	}

	if (hole == false) {
		var cloudspeed = Math.random() * Math.PI * 2 / 10;
		for (var i = 0; i < this.r; i++) {
			this.clouds.push(new Planet(Math.random() * Math.PI * 2, this.r / 10 - Math.random() * this.r / 10, this.r + this.r / 5, cloudspeed - Math.random() * Math.PI * 2 / 50, this, true));
		}

		for (var i = 0; i < 30; i++) {
			this.patterns.push(new Planet(Math.random() * Math.PI * 2, Math.random() * 2 * this.r / 3, Math.random() * this.r, 0, this, true));
		}

		if (parent) {
			for (var i = 0; i < 2; i++) {
				this.stars.push(new Planet(Math.random() * Math.PI * 2, 10, this.r + 10, 0, this, true));
			}
		}
	}

	this.move = function () {
		this.a += speed * 0.01;
	}

	this.setPosition = function () {
		this.move();
		if (this.parent) {
			this.x = this.d * Math.cos(this.a) + this.parent.x;
			this.y = this.d * Math.sin(this.a) + this.parent.y;
		}
	}

	this.setChildrenPositions = function () {
		this.setPosition();
		Level.objects.push(this);
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].setChildrenPositions();
		}
		for (var i = 0; i < this.holes.length; i++) {
			this.holes[i].setPosition();
		}
		for (var i = 0; i < this.stars.length; i++) {
			this.stars[i].setPosition();
		}
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].setPosition();
		}
		for (var i = 0; i < this.patterns.length; i++) {
			this.patterns[i].setPosition();
		}
	}

	this.draw = function () {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].draw();
		}

		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		ctx.clip();

		ctx.beginPath();
		ctx.fillStyle = this.color1;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
		ctx.fill();

		for (i = 0; i < this.patterns.length; i++) {
			ctx.beginPath();
			ctx.globalAlpha = this.patterns[i].r / this.r;
			if (i & 2) {
				ctx.fillStyle = this.color2;
			} else {
				ctx.fillStyle = this.color1;
			}
			ctx.arc(this.patterns[i].x, this.patterns[i].y, this.patterns[i].r, 0, Math.PI * 2, true);
			ctx.fill();
		}

		ctx.globalAlpha = 1;
		
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		ctx.lineWidth = 4;
		ctx.strokeStyle = this.stroke;
		ctx.stroke();

		for (i = 0; i < this.holes.length; i++) {
			if (this.holes[i].currentRadius >= this.holes[i].r) {
				ctx.beginPath();
				ctx.arc(this.holes[i].x, this.holes[i].y, this.holes[i].r, 0, Math.PI * 2, true);
				ctx.fillStyle = this.stroke;
				ctx.fill();
			}
		}

		for (i = 0; i < this.holes.length; i++) {
			if (this.holes[i].currentRadius >= this.holes[i].r) {
				ctx.beginPath();
				ctx.arc(this.holes[i].x, this.holes[i].y, this.holes[i].r - 2, 0, Math.PI * 2, true);
				ctx.fillStyle = this.holeColor;
				ctx.fill();
			}
		}

		ctx.restore();

		for (i = 0; i < this.holes.length; i++) {
			if (this.holes[i].currentRadius < this.holes[i].r) {
				this.holes[i].currentRadius += 3;
				ctx.beginPath();
				ctx.arc(this.holes[i].x, this.holes[i].y, this.holes[i].currentRadius, 0, Math.PI * 2, true);
				ctx.fillStyle = "#d00";
				ctx.fill();
			}
		}

		for (i = 0; i < this.clouds.length; i++) {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = "rgba(100,100,150,0.1)";
			ctx.arc(this.clouds[i].x, this.clouds[i].y, this.clouds[i].r, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.restore();
		}

		for (i = 0; i < this.stars.length; i++) {
			if (this.stars[i].active == true) {
				ctx.save();
				ctx.fillStyle = "#ff0";
				star(this.stars[i].a + Math.PI / 2, this.stars[i].x, this.stars[i].y, this.stars[i].r, 5, 0.5);
				ctx.restore();
			}
		}
	}
}


function star(a, x, y, r, p, m) {
	ctx.save();
	ctx.beginPath();
	ctx.translate(x, y);
	ctx.rotate(a);
	ctx.moveTo(0, 0 - r);
	for (var i = 0; i < p; i++) {
		ctx.rotate(Math.PI / p);
		ctx.lineTo(0, 0 - (r * m));
		ctx.rotate(Math.PI / p);
		ctx.lineTo(0, 0 - r);
	}
	ctx.fill();
	ctx.restore();
}