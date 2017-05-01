$(function() {

	$('body').css({
		backgroundSize: 'auto,' + document.documentElement.clientHeight + 'px'
	})

	$('.container').css({
		height: document.documentElement.clientHeight + 'px',
	})

	var nowSever = '';

	//获取服务器
	$.ajax({
		type: "get",
		url: "../user/js/url.json",
		async: true,
		success: function(data) {
			nowSever = data.localurl;
		}
	});

	var flag = [0, 0];

	var user = /^(?=[0-9a-zA-Z@_.]+$)/

	//用户失焦
	$('#adminName').blur(function() {
		if($('#adminName').val() == '') {
			$('.uname')
				.text('User name can not empty')
				.css('color', '#f00');
			flag[0] = false;
		}
	})

	//密码失焦
	$('#adminPwd').blur(function() {
		if($('#adminPwd').val() == '') {
			$('.upass')
				.text('Password can not empty')
				.css('color', '#f00');
			flag[1] = false;
		}
	})

	//用户聚焦
	$('#adminName').focus(function() {
		if($('#adminName').val() == '') {
			$('.uname')
				.text('Please input username')
				.css('color', '#000');
		}
	})

	//密码聚焦
	$('#adminPwd').focus(function() {
		if($('#adminPwd').val() == '') {
			$('.upass')
				.text('Please input password')
				.css('color', '#000');
		}
	})

	//用户按下判断
	$('#adminName').keydown(function() {
		if($('#adminName').val() != '') {
			if(user.test($('#adminName').val())) {
				$('.uname').text('');
				flag[0] = true;
			} else {
				$('.uname').text('format error')
					.css('color', '#f00');
				flag[0] = false;
			}

		}
		panduan();
	})
	//密码按下判断
	$('#adminPwd').keydown(function() {
		if($('#adminPwd').val() != '') {
			if(user.test($('#adminPwd').val())) {
				$('.upass').text('');
				flag[1] = true;
			} else {
				$('.upass').text('format error')
					.css('color', '#f00');
				flag[1] = false;
			}

		}
		panduan();
	})

	function panduan() {
		if(flag[0] == true && flag[1] == true) {
			$('#adminLogin').removeAttr('disabled');
		} else {
			$('#adminLogin').attr('disabled', 'disabled');
		}
	}

	$('#adminLogin').on('mousedown', doLogin);

	function doLogin() {

		$.ajax({
			type: "post",
			url: nowSever + "/service/managerController/managerLogin",
			data: {
				jsonData: JSON.stringify({
					managerName: $('#adminName').val(),
					password: $('#adminPwd').val()
				})
			},
			async: true,
			success: function(data) {
				alert(data.reason);

				if(data.errorCode == '200') {

					for(var item in data.result) {
						sessionStorage.setItem(item, data.result[item]);
						console.log(sessionStorage.getItem(item))
					}
					window.open('manage.html', '_self');

				}
			},
			error: function(data) {
				console.log(data);
			}
		});
	}

})