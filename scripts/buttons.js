function InitButtons(dontReloadButtons) {

	$('#canvas-container .button').remove();
	buttons = [];
	if (!dontReloadButtons) {
		resetBackground();
	}
	if (AppState == state.START) {
		buttons.push(new Button(0, 0, "Scorched Space", function () {
			InitButtons(true);
		}, 45));
		buttons.push(new Button(WIDTH / 4, HEIGHT * ((buttons.length + 0.5) / 7), "Level 1", function () {
			AppState = state.LEVEL;
			resetBackground();
			LEVEL = 1;
			initLevel();
			InitButtons();
			Sounds.Click();
		}, 40));
		buttons.push(new Button(WIDTH / 2, HEIGHT * ((buttons.length + 0.5) / 7), "Level 2", function () {
			AppState = state.LEVEL;
			resetBackground();
			LEVEL = 2;
			initLevel();
			InitButtons();
			Sounds.Click();
		}, 40));
		buttons.push(new Button(WIDTH / 4, HEIGHT * ((buttons.length + 0.5) / 7), "Level 3", function () {
			AppState = state.LEVEL;
			resetBackground();
			LEVEL = 3;
			initLevel();
			InitButtons();
			Sounds.Click();
		}, 40));
		buttons.push(new Button(WIDTH / 2, HEIGHT * ((buttons.length + 0.5) / 7), "Level 4", function () {
			AppState = state.LEVEL;
			resetBackground();
			LEVEL = 4;
			initLevel();
			InitButtons();
			Sounds.Click();
		}, 40));
		buttons.push(new Button(WIDTH / 4, HEIGHT * ((buttons.length + 0.5) / 7), "Level 5", function () {
			AppState = state.LEVEL;
			resetBackground();
			LEVEL = 5;
			initLevel();
			InitButtons();
			Sounds.Click();
		}, 40));
		buttons.push(new Button(WIDTH - WIDTH / 12, HEIGHT - HEIGHT / 12, "?", function () {
			Bonus.init();
			AppState = state.BONUS;
			InitButtons();
			Sounds.Click();
		}, 20));
	}
	else if (AppState == state.LEVEL) {
		buttons.push(new Button(WIDTH - 60, 10, "EXIT", function () {
			AppState = state.START;
			InitButtons();
		}, 12));
		buttons.push(new Button(WIDTH - 60 - WIDTH / 10, 10, "RESTART", function () {
			initLevel();
			InitButtons();
			Sounds.Click();
		}, 12));
		buttons.push(new Button(10, HEIGHT - HEIGHT / 10 - 10, "AMMO 1", function () {
			Gun.AmmoType = 1;
			$('#canvas-container .button').css('border', 'none');
			$(this).css('border', '1px solid #FFF');
		}, 20));
		if (Gun.AmmoType == 1) {
			$("#button" + buttonNum).css('border', '1px solid #FFF');
		}
		buttons.push(new Button(WIDTH / 9 + 20, HEIGHT - HEIGHT / 10 - 10, "AMMO 2", function () {
			Gun.AmmoType = 2;
			$('#canvas-container .button').css('border', 'none');
			$(this).css('border', '1px solid #FFF');
		}, 20));
		if (Gun.AmmoType == 2) {
			$("#button" + buttonNum).css('border', '1px solid #FFF');
		}
	}
	else if (AppState == state.SUCCESS) {
		buttons.push(new Button(WIDTH / 5, HEIGHT / 4, "LEVEL " + LEVEL + " COMPLETED", function () {
			InitButtons();
		}, 40));
		buttons.push(new Button(WIDTH / 5, HEIGHT / 2, "GET BACK TO MENU", function () {
			AppState = state.START;
			InitButtons();
		}, 40));
	}
	else if (AppState == state.FAIL) {

	}
	else if (AppState == state.GRATZ) {

	}
	else if (AppState == state.BONUS) {
		buttons.push(new Button(WIDTH - 60, 10, "EXIT", function () {
			AppState = state.START;
			InitButtons();
		}, 12));
	}
}

var buttonNum = 0;
var Button = function (x, y, text, onclick, fontsize, font) {

	var margin = fontsize / 2;
	ctx.font = fontsize + "px Audiowide";
	var height = 2 * margin + fontsize;
	var width = 2 * margin + ctx.measureText(text).width;

	buttonNum += 1;

	$('#canvas-container').append('<canvas id="button' + buttonNum + '" class="button">button</canvas>');

	this.canvas = document.getElementById('button' + buttonNum);
	$(this.canvas).css("top", y);
	$(this.canvas).css("left", x);
	$(this.canvas).attr("width", width);
	$(this.canvas).attr("height", height);

	this.ctx = this.canvas.getContext("2d");

	this.ctx.save();
	this.ctx.fillStyle = "rgba(20,20,20,0.1)";
	this.ctx.fillRect(0, 0, width, height);
	this.ctx.font = fontsize + "px Audiowide";
	this.ctx.fillStyle = "rgba(255,255,255,1)";
	this.ctx.strokeStyle = "rgba(0,0,0,1)";
	this.ctx.fillText(text, margin, margin + fontsize);
	this.ctx.lineWidth = 0.8;
	this.ctx.strokeStyle = "rgba(255,255,255,0.25)";
	var i = 5; while (i--) {
		var jiter = 2 * margin;
		var left = jiter / 2 - Math.random() * jiter;
		var top = jiter / 2 - Math.random() * jiter;
		this.ctx.strokeText(text, left + margin, top + margin + fontsize);
	}
	this.ctx.restore();

	$(this.canvas).click(onclick);
}