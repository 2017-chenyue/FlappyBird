// 主页
function Home(homeimg, y){
	this.homeimg = homeimg;
	this.home_idx = 0;
	this.img = this.homeimg[this.home_idx];
	this.y = y;
	this.state = "D";
	this.speed = 0;
}
Home.prototype.move = function(){
	if(this.state === "D"){
		this.speed ++;
		this.y += 0.7;
	} else {
		this.speed --;
		this.y -= 0.7;
	}
	if(this.speed == 25){
		this.state = "U";
	} 
	if(this.speed == 0){
		this.state = "D";
	}
}
Home.prototype.changeImg = function(){
	this.img = this.homeimg[this.home_idx];
}
function StartBtn (homeimg, y, img_y){
	var b = new Home(homeimg, y);
	b.img_y = img_y;
	return b;
}