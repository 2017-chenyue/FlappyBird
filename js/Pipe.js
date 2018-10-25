function Pipe(img_up, img_down, drep, x){
	this.img_up = img_up;
	this.img_down = img_down;
	// 柱子移动的步长
	this.drep = drep;
	this.x = x;
	this.up_height = parseInt(Math.random() * 249) + 1;
	this.down_height = 250 - this.up_height;
	// 柱子移动的次数
	this.count = 0;
}
Pipe.prototype.createPipe = function(){
	return new Pipe(this.img_up, this.img_down, this.drep, this.x);
}