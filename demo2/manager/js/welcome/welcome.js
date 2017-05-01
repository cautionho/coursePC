var canvas = document.getElementById('canvas');

var context = null;

if(canvas.getContext) {

	context = canvas.getContext('2d');

}

//创建小圆点对象
var circle = {

	circleCountTotal: 30, //小圆点个数

	circleSpeed: 2, //默认速度
	circleRespeed: 1, //变速

	circleShadowColor: 'rgb(255,100,200)', //小圆点阴影颜色
	circleShadowBlur: 20,
	circleShadowOffsetX: .5,
	circleShadowOffsetY: .5,

	circleRadius: 3, //小圆点半径
	circleReradius: 10, //变化的半径

	circleColor: 'rgb(200,0,0)',

	lineColor: {
		r: 200,
		g: 0,
		b: 0,
		a: 1
	},

	maxdistance: 100, //两点间最大距离
}

//创建一个数组 存放小圆点
var particle = [];

//声明画布的 宽 高 变量
var w, h;

init();

//先创建一个初始化画布的函数
function init() {

	//初始化画布的宽高
	getSize();

	getGlobalAlpha();

	//创建小圆点数组
	for(var i = 0; i < circle.circleCountTotal; i++) {
		particle.push(new random());
	}

	loopDraw();

}

//初始化画布宽高
function getSize() {
	//画布的宽高等于浏览器的可视宽高
	w = canvas.width = window.innerWidth;

	h = canvas.height = window.innerHeight;

}

//初始化画布透明度
function getGlobalAlpha() {

	context.globalAlpha = 1;

}

//设定小圆点的样式/位置的函数
function random() {

	//小圆点的x坐标和y坐标  随机
	this.x = Math.random() * w;

	this.y = Math.random() * h;

	this.speed = circle.circleSpeed + circle.circleRespeed * Math.random(); //随机速度

	this.radius = circle.circleRadius + circle.circleReradius * Math.random(); //随机半径

	//				this.color = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')', //小圆点的颜色

	this.color = circle.circleColor;

	this.shadowColor = circle.circleShadowColor;

	this.shadowBlur = circle.circleShadowBlur;

	this.shadowOffsetX = circle.circleShadowOffsetX;

	this.shadowOffsetY = circle.circleShadowOffsetY;

	this.direction = Math.floor(Math.random() * 360); //运动方向 随机角度

	this.lineColor = circle.lineColor; //线的颜色

	this.alpha = circle.lineColor.a; //透明度

	this.distance = circle.maxdistance; //两点间最大距离

	//分别计算x轴的速度和y轴的速度
	this.speedTotal = {

		//cos = x/r;
		x: this.speed * Math.cos(this.direction),

		//sin = y/r
		y: this.speed * Math.sin(this.direction),

	}

	this.nextPosition = function() {

		//判断小圆点是否到达了边界
		this.isborder();

		//更新小圆点的下一个位置
		this.x += this.speedTotal.x;

		this.y += this.speedTotal.y;

	}

	this.isborder = function() {

		if(this.x + this.radius > w || this.x - this.radius <= 0) {
			//反向运动
			this.speedTotal.x *= -1;

		}

		if(this.y + this.radius > h || this.y - this.radius <= 0) {

			//反向运动
			this.speedTotal.y *= -1;

		}

		//到达边界后当前坐标位置
		if(this.x > w) {
			this.x = w;
		}

		if(this.y > h) {
			this.y = h;
		}

		if(this.x <= 0) {
			this.x = 0;
		}

		if(this.y <= 0) {
			this.y = 0;
		}

		//相撞后反向
		//					for(var i = 0;i<circle.circleCountTotal; i++){
		//	            		if(Math.abs(particle[i].x - this.x + this.radius + particle[i].radius) <= 0.1){
		//	            			particle[i].speedTotal.x *= -1;
		//	            			this.speedTotal.x *= -1;
		//	            		}
		//	            		if(Math.abs(particle[i].y - this.y + this.radius + particle[i].radius) <= .1){
		//	            			particle[i].speedTotal.y *= -1;
		//	            			this.speedTotal.y *= -1;
		//	            		}
		//		        	}

	}

	//画小圆点
	this.drawObj = function() {

		context.beginPath();

		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

		context.stroke();

		context.closePath();

		context.fillStyle = this.color;

		context.fill();

		//					context.strokeStyle = this.color;

		//					context.stroke();

		context.shadowColor = this.shadowColor;

		context.shadowBlur = this.shadowBlur;

		context.shadowOffsetX = this.shadowOffsetX;

		context.shadowOffsetY = this.shadowOffsetY;

	}

	//画线
	this.line = function(currentDistance, obj1, obj2) {

		context.beginPath();

		if(currentDistance <= this.distance) {

			this.alpha = Math.abs(currentDistance - this.distance) / 100;

			context.strokeStyle = 'rgba(' + this.lineColor.r + ',' + this.lineColor.g + ',' + this.lineColor.b + ',' + this.alpha + ')';

			context.moveTo(obj1.x, obj1.y);

			context.lineTo(obj2.x, obj2.y);

			context.stroke();

		} else {
			return;
		}

		context.closePath();

	}

}

//通过原型添加方法
random.prototype = {

}

//绘图操作
function loopDraw() {

	//清空画布
	context.clearRect(0, 0, w, h);

	for(var i = 0; i < particle.length; i++) {

		particle[i].nextPosition();
		particle[i].drawObj();

		//画线
		for(var j = 0; j < particle.length; j++) {

			var lineX = Math.abs(particle[i].x - particle[j].x);
			var lineY = Math.abs(particle[i].y - particle[j].y);

			var currentDistance = Math.sqrt(lineX * lineX + lineY * lineY);

			particle[i].line(currentDistance, particle[i], particle[j]);
		}

	}

	//重复执行绘图操作
	window.requestAnimationFrame(loopDraw);

}