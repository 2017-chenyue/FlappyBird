function Bird(imgArr, x, y){
	this.imgArr = imgArr;
	this.img_idx = parseInt(Math.random() * imgArr.length); 
	this.img = this.imgArr[this.img_idx];
	this.x = x;
	this.y = y;
	this.timer = null;
	this.state = "D";
	this.speed = 0;
}
Bird.prototype.fly = function(){
	this.img_idx ++;
	if(this.img_idx >= this.imgArr.length){
		this.img_idx = 0;
	}
	this.img = this.imgArr[this.img_idx];
}
Bird.prototype.fillDown = function(){
	if(this.state === "D"){
		this.speed ++;
		this.y += Math.sqrt(this.speed);
	} else {
		this.speed --;
		if(this.speed === 0){
			this.state = "D";
			return;
		}
		this.y -= Math.sqrt(this.speed);
	}
}
Bird.prototype.goUp = function(){
	this.state = "U";
	this.speed = 20;
}