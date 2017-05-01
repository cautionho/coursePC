$(function() {

	//判断用户是否已登录

	(function checkLogin() {

		var user = sessionStorage.getItem('userId');

		if(user != null) {
			$('#dologinbox').hide();
			$('#userMsg').show();
			$('#userMsgName').text(sessionStorage.email || sessionStorage.phone);
		} else {
			$('#userMsg').hide();
			$('#dologinbox').show();
		}
	})();

});

//搜索框跨域请求
var search = document.getElementById('search');

var list = document.getElementById('list');

search.onkeyup = function() {

	var script = document.createElement('script');

	var scrs = document.getElementsByTagName('script');

	if(this.value != '') {
		$(function() {

			$('#list').slideDown(500);

		});

		//			document.documentElement.removeChild(scrs[scrs.length-1]);

	} else {
		$(function() {

			$('#list').slideUp(500);

		});
	}

	script.src = 'http://suggest.maiziedu.com/suggest/?keyword=' + this.value + '&callback=cb';

	document.body.appendChild(script);

}

function cb(data) {

	console.log(data);

	var li = '';

	for(var i = 1; i < data.length; i++) {
		li += '<li>';
		li += '<a href="http://www.maiziedu.com/search/course/' + data[i].name + '-1">' + data[i].name + '</a>';
		li += '</li>';
	}
	document.getElementById('list').innerHTML = li;
}

//按搜索按钮跳转搜索
var searchBtn = document.getElementById('searchBtn');

eventHandle.addHandler(searchBtn, 'click', searchMsg);

function searchMsg() {

	this.firstElementChild.href = 'http://www.maiziedu.com/search/course/' + search.value + '-1'

}

//跳转个人中心页面
var goPersonal = document.getElementById('userMsgName');

eventHandle.addHandler(goPersonal,'click',personalPage);
//goPersonal.addEventListener('click',personalPage,false);

function personalPage(){

	window.open('basics.html','_self');

}
