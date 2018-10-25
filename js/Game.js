function Game(ctx, mountain, land, bird, pipe, flapy, grayBird, startBtn){
	this.ctx = ctx;
	this.flapy = flapy;
	this.mountain = mountain;
	this.land = land;
	this.bird = bird;
	this.pipeArr = [pipe];
	this.grayBird = grayBird;
	this.startBtn = startBtn;
	this.frequency = 0;
	this.timer = null;
	this.homeTimer = null;
	this.readyTimer = null;
	this.overTimer = null;
	this.init();
}
// 初始化
Game.prototype.init = function(){
	this.homestart();
	this.bindBtn();
	this.bindEvent();
}
// 首页
Game.prototype.homestart = function(){
	var me = this;
	this.homeTimer = setInterval(function(){
		me.moveMountain();
		me.renderMountain();
		me.moveLand();
 		me.renderLand();
		me.flapy.move();
		me.renderFlapy();
		me.renderGrayBird();
		me.renderStartBtn();
		
	}, 20)
}
// 首页结束
Game.prototype.homeOver = function(){
	clearInterval(this.homeTimer);
}
// 准备
Game.prototype.getReady = function(){
	var me = this;
	this.readyTimer = setInterval(function(){
		me.frequency ++;
		me.ctx.clearRect(0, 0, 91,94);
		me.moveMountain();
		me.renderMountain();
		me.moveLand();
 		me.renderLand();
 		me.flapy.move();
		me.renderFlapy();
		if(!(me.frequency % 10)){
			me.bird.fly();
		}
		me.renderBird();
	}, 20)
	setTimeout(function(){
		me.readyOver();
		me.start();
	},3000)
}
// 准备结束
Game.prototype.readyOver = function(){
	clearInterval(this.readyTimer);
}
// 开始游戏
Game.prototype.start = function(){
	var me = this;
	this.timer = setInterval(function(){
		me.frequency ++;
		// 清屏
		me.ctx.clearRect(0, 0, 91,94);
		// 渲染山
		// me.checkPx();
		// me.checkLand();
		me.moveMountain();
		me.renderMountain();
		me.moveLand();
		me.renderLand();
		if(!(me.frequency % 10)){
			me.bird.fly();
		}
		me.bird.fillDown();
		me.movePipe();
		me.renderPipe();
		me.renderBird();
		if(!(me.frequency % 65)){
			me.createPipe();
		}
		// me.drawBird();
		// me.drawPipe();
		me.checkBird();
	}, 20)
}
// 结束游戏
Game.prototype.gameOver = function(){
	clearInterval(this.timer);
	var me = this;
	this.overTimer = setInterval(function(){
		me.flapy.y = me.ctx.canvas.height / 2 - me.flapy.img.height;
		me.flapy.home_idx = 2;
		me.flapy.changeImg();
		me.renderMountain();
		me.renderLand();
		me.flapy.move();
		me.renderPipe();
		me.renderBird();
		me.renderFlapy();
		// console.log(this.flapy.img);
	}, 20)
}
// 渲染文字
Game.prototype.renderFlapy = function(){
	var img = this.flapy.img;
	this.ctx.save();
	this.ctx.translate(this.ctx.canvas.width / 2 , 0);
	this.ctx.drawImage(img, 0, 0, img.width, img.height, - img.width / 2, this.flapy.y, img.width, img.height);
	this.ctx.restore();
}
// 渲染灰色的鸟
Game.prototype.renderGrayBird = function(){
	var img = this.grayBird.img;
	this.ctx.save();
	this.ctx.translate(this.ctx.canvas.width / 2 , 0);
	this.ctx.drawImage(img, 0, 0, img.width, img.height, - img.width / 2, this.grayBird.y, img.width, img.height);
	this.ctx.restore();
}
// 渲染开始按钮
Game.prototype.renderStartBtn = function(){
	var img = this.startBtn.img;
	this.ctx.save();
	this.ctx.translate(this.ctx.canvas.width / 2, 0);
	this.ctx.drawImage(img, 0, this.startBtn.img_y, img.width, 70, - img.width / 2, this.startBtn.y, img.width, 70);
	this.ctx.restore();
}
// 按钮事件
Game.prototype.bindBtn = function(){
	var me = this;
	this.ctx.canvas.addEventListener("mousemove", function(e){
		var x = e.clientX - me.offset(me.ctx.canvas).left;
		var y = e.clientY - me.offset(me.ctx.canvas).top;
		var lineLeft = (me.ctx.canvas.width - me.startBtn.img.width) / 2;
		var lineRight = (me.ctx.canvas.width - me.startBtn.img.width) / 2 + me.startBtn.img.width;
		var lineTop = me.startBtn.y;
		var lineBotton = me.startBtn.y + 70;
		if(x > lineLeft && x < lineRight && y < lineBotton && y > lineTop){
			me.startBtn.img_y = 70;
		} else {
			me.startBtn.img_y = 0;
		}
	})
	function btnDown (e){
		var x = e.clientX - me.offset(me.ctx.canvas).left;
		var y = e.clientY - me.offset(me.ctx.canvas).top;
		var lineLeft = (me.ctx.canvas.width - me.startBtn.img.width) / 2;
		var lineRight = (me.ctx.canvas.width - me.startBtn.img.width) / 2 + me.startBtn.img.width;
		var lineTop = me.startBtn.y;
		var lineBotton = me.startBtn.y + 70;
		if(x > lineLeft && x < lineRight && y < lineBotton && y > lineTop){
			me.homeOver();
			me.flapy.home_idx = 1;
			me.flapy.changeImg();
			me.getReady();
			me.ctx.canvas.removeEventListener("mousedown", btnDown, false);
			return;
		} else {
			me.startBtn.img_y = 0;
		}
	}
	this.ctx.canvas.addEventListener("mousedown", btnDown, false);
}
// 元素到页面的距离
Game.prototype.offset = function(dom){
	var resulet = {
		top:dom.offsetTop,
		left: dom.offsetLeft
	}
	var isIE = null;
	var str  = window.navigator.userAgent;
	// 判断是否是ie浏览器
	if(str.indexOf("MSIE 8.0") === -1){
		// 不是ie8
		isIE = false;
	}else{
		isIE = true;
	}
	while(dom != document.body){
		dom = dom.offsetParent;
		if(isIE){
			// 是ie
			resulet.left += dom.offsetLeft;
			resulet.top += dom.offsetTop;
		}else{
			// 不是ie
			resulet.left += dom.offsetLeft + dom.clientLeft;
			resulet.top += dom.offsetTop + dom.clientTop;
		}
	}
	return resulet;
}

// 渲染鸟
Game.prototype.renderBird = function(){
	var img = this.bird.img;
	this.ctx.save();
	this.ctx.translate(this.bird.x, this.bird.y);
	// this.ctx.strokeRect(-this.bird.img.width / 2 + 5, - this.bird.img.height / 2 + 10, this.bird.img.width - 12, this.bird.img.height - 18);
	var deg = this.bird.state === "D" ? (Math.PI / 180) * this.bird.speed : - (Math.PI / 180) * this.bird.speed;
	this.ctx.rotate(deg);
	this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
	this.ctx.restore();
}
// 渲染山 
Game.prototype.renderMountain = function(){
	var img = this.mountain.img;
	this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);
}
// 山移动
Game.prototype.moveMountain = function(){
	var img = this.mountain.img;
	this.mountain.x -= this.mountain.drep;
	if(this.mountain.x < - img.width){
		this.mountain.x = 0;
	}
}
// 渲染地面
Game.prototype.renderLand = function(){
	var img = this.land.img;
	this.ctx.drawImage(img, this.land.x, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width * 2, this.land.y);
}
// 地面移动
Game.prototype.moveLand = function(){
	var img = this.land.img;
	this.land.x -= this.land.drep;
	if(this.land.x < -img.width){
		this.land.x = 0;
	}
}
// 绑定改变鸟方向事件
Game.prototype.bindEvent = function(){
	var me = this;
	this.ctx.canvas.onclick = function(){
		me.bird.goUp();
	}
}
// 渲染管子
Game.prototype.renderPipe = function(){
	var me = this;
	this.pipeArr.forEach(function(value, index){
		var pipe_up = value.img_up;
		var up_x = 0;
		var up_y = pipe_up.height - value.up_height;
		var up_w = pipe_up.width;
		var up_h = value.up_height;
		var canvas_x = value.x - value.drep * value.count;
		var canvas_y = 0;
		var canvas_w = up_w;
		var canvas_h = up_h;
		me.ctx.drawImage(pipe_up, up_x, up_y, up_w, up_h, canvas_x, canvas_y, canvas_w, canvas_h);
		var pipe_down = value.img_down;
		var down_x = 0;
		var down_y = 0;
		var down_w = pipe_down.width;
		var down_h = value.down_height;
		var down_canvas_x = canvas_x;
		var down_canvas_y = 150 + up_h;
		var down_canvas_w = up_w;
		var down_canvas_h = down_h;
		me.ctx.drawImage(pipe_down, down_x, down_y, down_w, down_h, down_canvas_x, down_canvas_y, down_canvas_w, down_canvas_h);	
	})
}
// 移动管子
Game.prototype.movePipe = function(){
	this.pipeArr.forEach(function(value, index){
		value.count ++;
	})
}
// 创建多个管子
Game.prototype.createPipe = function(){
	var newPipe = this.pipeArr[0].createPipe();
	this.pipeArr.push(newPipe);
	for(var i = 0 ; i < this.pipeArr.length ; i ++){
		if(this.pipeArr[i].x - this.pipeArr[i].drep * this.pipeArr[i].count <= - this.pipeArr[i].img_up.width){
			this.pipeArr.splice(i,1);
			return;
		}
	}
}
// 绘制鸟的四个点
/*Game.prototype.drawBird = function(){
	var bird_A = {
		x : - this.bird.img.width / 2 + 5 + this.bird.x,
		y : - this.bird.img.height / 2 + 10 + this.bird.y
	}
	var bird_B = {
		x : -this.bird.img.width / 2 + 5 + this.bird.img.width - 12 + this.bird.x,
		y : - this.bird.img.height / 2 + 10 + this.bird.y
	}
	var bird_C = {
		x : -this.bird.img.width / 2 + 5 + this.bird.x,
		y : - this.bird.img.height / 2 + 10 + this.bird.img.height - 18 + this.bird.y
	}
	var bird_D = {
		x : -this.bird.img.width / 2 + 5 + this.bird.img.width - 12 + this.bird.x,
		y : - this.bird.img.height / 2 + 10 + this.bird.img.height - 18 + this.bird.y
	}
	// this.ctx.strokeRect(-this.bird.img.width / 2 + 5, - this.bird.img.height / 2 + 10, this.bird.img.width - 12, this.bird.img.height - 18);
	this.ctx.beginPath();
	this.ctx.moveTo(bird_A.x, bird_A.y);
	this.ctx.lineTo(bird_B.x, bird_B.y);
	this.ctx.lineTo(bird_D.x, bird_D.y);
	this.ctx.lineTo(bird_C.x, bird_C.y);
	this.ctx.closePath();
	this.ctx.stroke();
}
// 绘制柱子的四个点
Game.prototype.drawPipe = function(){
	var me = this;
	this.pipeArr.forEach(function(value, index){

		var pipeUp_A = {
			x : value.x - value.drep * value.count,
			y : 0
		}
		var pipeUp_B = {
			x : value.x - value.drep * value.count + value.img_up.width,
			y : 0
		}
		var pipeUp_C = {
			x : value.x - value.drep * value.count,
			y : value.up_height
		}
		var pipeUp_D = {
			x : value.x - value.drep * value.count + value.img_up.width,
			y : value.up_height
		}
		var pipeDown_A = {
			x : pipeUp_A.x,
			y : pipeUp_C.y + 150
		}
		var pipeDown_B = {
			x : pipeUp_B.x,
			y : pipeUp_C.y + 150
		}
		var pipeDown_C = {
			x : pipeUp_A.x,
			y : 400
		}
		var pipeDown_D = {
			x : pipeUp_B.x,
			y : 400
		}
		me.ctx.beginPath();
		me.ctx.moveTo(pipeUp_A.x, pipeUp_A.y);
		me.ctx.lineTo(pipeUp_B.x, pipeUp_B.y);
		me.ctx.lineTo(pipeUp_D.x, pipeUp_D.y);
		me.ctx.lineTo(pipeUp_C.x, pipeUp_C.y);
		me.ctx.closePath();
		me.ctx.stroke();
		me.ctx.beginPath();
		me.ctx.moveTo(pipeDown_A.x, pipeDown_A.y);
		me.ctx.lineTo(pipeDown_B.x, pipeDown_B.y);
		me.ctx.lineTo(pipeDown_D.x, pipeDown_D.y);
		me.ctx.lineTo(pipeDown_C.x, pipeDown_C.y);
		me.ctx.closePath();
		me.ctx.stroke();
	})
}*/
// 检测小鸟与管子和地面
Game.prototype.checkBird = function(){
	// var me = this;
	// this.pipeArr.forEach(function(value, index){
	for(var i = 0 ; i < this.pipeArr.length ; i ++){
		var pipe = this.pipeArr[i];
		var pipeUp_A = {
			x : pipe.x - pipe.drep * pipe.count,
			y : 0
		}
		var pipeUp_B = {
			x : pipe.x - pipe.drep * pipe.count + pipe.img_up.width,
			y : 0
		}
		var pipeUp_C = {
			x : pipe.x - pipe.drep * pipe.count,
			y : pipe.up_height
		}
		var pipeUp_D = {
			x : pipe.x - pipe.drep * pipe.count + pipe.img_up.width,
			y : pipe.up_height
		}
		var pipeDown_A = {
			x : pipeUp_A.x,
			y : pipeUp_C.y + 150
		}
		var pipeDown_B = {
			x : pipeUp_B.x,
			y : pipeUp_C.y + 150
		}
		var pipeDown_C = {
			x : pipeUp_A.x,
			y : 400
		}
		var pipeDown_D = {
			x : pipeUp_B.x,
			y : 400
		}
		var bird_A = {
			x : -this.bird.img.width / 2 + 5 + this.bird.x,
			y : - this.bird.img.height / 2 + 10 + this.bird.y
		}
		var bird_B = {
			x : -this.bird.img.width / 2 + 5 + this.bird.img.width - 12 + this.bird.x,
			y : - this.bird.img.height / 2 + 10 + this.bird.y
		}
		var bird_C = {
			x : -this.bird.img.width / 2 + 5 + this.bird.x,
			y : - this.bird.img.height / 2 + 10 + this.bird.img.height - 18 + this.bird.y
		}
		var bird_D = {
			x : -this.bird.img.width / 2 + 5 + this.bird.img.width - 12 + this.bird.x,
			y : - this.bird.img.height / 2 + 10 + this.bird.img.height - 18 + this.bird.y
		}
		if(bird_B.x >= pipeUp_A.x && bird_B.y <= pipeUp_C.y && bird_A.x <= pipeUp_B.x){
			this.gameOver();
			return;
		}
		if(bird_B.x >= pipeDown_A.x && bird_C.y >= pipeDown_A.y && bird_A.x <= pipeDown_B.x){
			this.gameOver();
			return;
		}
		if(bird_C.y >= 400){
			this.gameOver();
			return;
		}
	}
}

// 用像素法检测小鸟与管子
Game.prototype.checkPx = function(){
	this.ctx.clearRect(0, 0, 360, 521);
	this.ctx.save();
	this.renderPipe();
	this.ctx.globalCompositeOperation = "source-in";
	this.renderBird();
	this.ctx.restore();
	var imgs = this.ctx.getImageData(0, 0, 360, 521);
	for(var i = 0 ; i < imgs.data.length ; i ++){
		if(imgs.data[i]){
			// console.log(1);
			this.gameOver();
			return;
		}
	}
}
// 检测地面与小鸟
Game.prototype.checkLand = function(){
	this.ctx.clearRect(0, 0, 360, 521);
	this.ctx.save();
	this.renderLand();
	this.ctx.globalCompositeOperation = "source-in";
	this.renderBird();
	this.ctx.restore();
	var imgs = this.ctx.getImageData(0, 0, 360, 521);
	for(var i = 0 ; i < imgs.data.length ; i ++){
		if(imgs.data[i]){
			// console.log(1);
			this.gameOver();
			return;
		}
	}
}