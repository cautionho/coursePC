//添加事件监听 兼容性 封装对象
var eventHandle = {
	addHandler: function(obj, ev, func) {
		if(obj.attachEvent) {
			return obj.attachEvent('on' + ev, func);
		} else {
			return obj.addEventListener(ev, func, false);
		}
	},

	removeHandler: function(obj, ev, func) {
		if(obj.detachEvent) {
			obj.detachEvent('on' + ev, func);
		} else {
			obj.removeEventListener(ev, func);
		}
	}
};

function getStyle(obj, attr) {

	if(window.getComputedStyle) {
		return window.getComputedStyle(obj, null)[attr];
	}

}

//封装换视频路径的函数(首页)
function changeVideo(obj, s) {
	return obj.attr('src', s);
}

//点击谁 显示谁
function clickShow(showobj, hideobj, showfun, hidefun) {
	$(function() {

		$(showobj).fadeIn(500).siblings(hideobj).fadeOut(500);

	})
}

//main选项卡
function goPage(showObj, hideElement, changeBottomObj, color) {
	$(showObj).show(500)
	$(hideElement).hide(500);
}

function changeAttrStyle(Obj, Attr, style, afterStyle, flag) {
	$(Obj).css(Attr, style);

	if(flag == true) {
		$(Obj).siblings().css(Attr, afterStyle);
	} else {
		return;
	}
}

//格式化时间
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1,
				RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

//nowSever = '';
//
//$.ajax({
//	type:"get",
//	url:"../js/url.json",
//	async:true,
//	success : function(data){
//		nowSever = data.localurl;
//	}
//});
