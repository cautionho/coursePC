$(function() {

	$('#s1 span').each(function() {
		$(this).click(function() {
			$('#s1 span').css({
				background: 'url(../img/personal/personal.png) no-repeat 0px -510px'
			})
			$(this).css({
				background: 'url(../img/personal/personal.png) no-repeat -16px -510px'
			})
		})
	})

	$('#s2 li').each(function() {
		$(this).click(function() {
			var index = $('#s2 li').index($(this));
			$('#s2 li').css({
				color: '#999'
			})
			$(this).css({
				color: '#5ecfba'
			})
			$('#s2 i').css({
				left: 90 * index + 'px',
				transition: 'all 0.5s'
			})
		})
	}).mouseover(function() {
		$(this).css({
			color: '#5ecfba'
		})
	}).mouseout(function() {
		$('#s2 li').css({
			color: '#999'
		})
	})

	$('#s3 button').each(function() {
		$(this).click(function() {
			$('#s3 button').css({
				background: '#f5f5f5',
				color: '#999'
			})
			$(this).css({
				background: '#5ecfba',
				color: '#fff'
			})
		})
	})

	$('.main-left>ul>li').click(function() {
		var index = $('.main-left>ul>li').index($(this));

		$('.main-right .ddd').css({
			display: 'none'
		})
		$('.main-right .ddd').eq(index).css({
			display: 'block'
		})
	})

	$('.main-left>ul>li').eq(0).mouseover(function() {
		$('.main-left>ul>li:eq(0) span').css({
			background: 'url(../img/personal/personal.png) no-repeat 0px -132px'
		})
		$('.main-left>ul>li:eq(0)>a').css({
			color: '#5ecfba'
		})
		$('.main-left>ul>li:eq(0)>i').css({
			display: 'block'
		})
	}).mouseout(function() {
		$('.main-left>ul>li:eq(0)>span').css({
			background: 'url(../img/personal/personal.png) no-repeat 0px -114px'
		})
		$('.main-left>ul>li:eq(0)>a').css({
			color: '#337AB7'
		})
		$('.main-left>ul>li:eq(0)>i').css({
			display: 'none'
		})
	})

	$('.main-left>ul>li').eq(1).mouseover(function() {
		$('.main-left>ul>li:eq(1) span').css({
			background: 'url(../img/personal/personal.png) no-repeat 0px -167px',
			height: '17px'
		})
		$('.main-left>ul>li:eq(1)>a').css({
			color: '#5ecfba'
		})
		$('.main-left>ul>li:eq(1)>i').css({
			display: 'block'
		})
	}).mouseout(function() {
		$('.main-left>ul>li:eq(1)>span').css({
			background: 'url(../img/personal/personal.png) no-repeat 0px -150px'
		})
		$('.main-left>ul>li:eq(1)>a').css({
			color: '#337AB7'
		})
		$('.main-left>ul>li:eq(1)>i').css({
			display: 'none'
		})
	})

	$('.main-left>ul>li').eq(2).mouseover(function() {
		$('.main-left>ul>li:eq(2) span').css({
			background: 'url(../img/personal/personal.png) no-repeat 0px -363px'
		})
		$('.main-left>ul>li:eq(2)>a').css({
			color: '#5ecfba'
		})
		$('.main-left>ul>li:eq(2)>i').css({
			display: 'block'
		})
	}).mouseout(function() {
		$('.main-left>ul>li:eq(2)>span').css({
			background: 'url(../img/personal/personal.png) no-repeat 0px -343px'
		})
		$('.main-left>ul>li:eq(2)>a').css({
			color: '#337AB7'
		})
		$('.main-left>ul>li:eq(2)>i').css({
			display: 'none'
		})
	})

	/***************************修改资料逻辑判断*****************************/
	var nowSever = '';

	$.ajax({
		type: "get",
		url: "../js/url.json",
		async: true,
		success: function(data) {
			nowSever = data.localurl;
		}
	});

	///service/userContrller

	//定义用户对象
	var userPro = {
		userId: sessionStorage.getItem('userId'),
		phone: sessionStorage.getItem('phone') || '',
		email: sessionStorage.getItem('email') || '',
		sex: sessionStorage.getItem('sex') || '男', //性别默认为男
		birth: sessionStorage.getItem('birth') || '',
	}

	var birthYear = '';
	var birthMonth = '';
	var birthDay = '';

	var addrPri = '';
	var addrCity = '';

	var nickPatt = /^[\u4e00-\u9fff\w]{5,16}$/;;

	//头像路径改变
//	$('#imghead').on('',changeHead);
	
	function changeHead(){
		console.log(111)
		userPro.head = $(this).attr('src');
		console.log(userPro.head);
	}

	//昵称改变
	$('#nick').on('blur', changeNick);

	//修改电话号码 模态框
	$('#changePhone').on('mousedown', changePhone);

	//修改邮箱 模态框
	$('#changeEmail').on('mousedown', changeEmail);

	//修改性别
	$('#s1 span').on('click', changeSex);

	//修改密码 模态框
	$('#changePwd').on('click', changePwd);

	//修改生日  分开获取年月日
	$('#birthday select').eq(0).on('change', getBirthYear);
	$('#birthday select').eq(1).on('change', getBirthMonth);
	$('#birthday select').eq(2).on('change', getBirthDay);

	//分开获取省和市
	$('#addr select').eq(0).on('change', getAddrPri);
	$('#addr select').eq(1).on('change', getAddrCity);

	//昵称改变
	function changeNick() {

		//做正则
		if(!nickPatt.test($(this).val())) {

			$(this).val('').attr('placeholder', '输入有误');

		} else {
			userPro.nickName = $(this).val();
		}

	}

	//修改电话号码或邮箱或密码

	function changePhone() {

		var name = prompt("请输入电话号码（解绑则不输入）", userPro.phone).trim();
		
		//做正则
		
		var that = this;

		if(name == null) {
			return;
		} else {
			$.ajax({
				type: "post",
				url: nowSever + "/service/userController/bindingOrNot",
				data: {
					jsonData: JSON.stringify({
						"userId": userPro.userId,
						"phone": name,
						"email": userPro.email,
					})
				},

				async: true,
				success: function(data) {
					alert(data.reason);
					console.log(data);
					if(data.errorCode == '200') {
						for(var item in data.result) {
							sessionStorage.setItem(item, data.result[item]);
						}
						
						userPro.phone = name;
						
						$(that).prev().html(name);
						
					}else{
						$(that).prev().html(sessionStorage.getItem('phone'));
					}
				}
			})
		}
	}
	
	function changeEmail() {

		var name = prompt("请输入邮箱（解绑则不输入）", userPro.email).trim();
		//做正则
		
		var that = this;
		
		if(name == null) {
			return;
		} else {
			$.ajax({
				type: "post",
				url: nowSever + "/service/userController/bindingOrNot",
				data: {
					jsonData: JSON.stringify({
						"userId": userPro.userId,
						"email": name,
						"phone": userPro.phone,
					})
				},

				async: true,
				success: function(data) {
					alert(data.reason);
					console.log(data);
					if(data.errorCode == '200') {
						for(var item in data.result) {
							sessionStorage.setItem(item, data.result[item]);
						}
						
						userPro.email = name;
						
						$(that).prev().html(name);
						
					}else{
						$(that).prev().html(sessionStorage.getItem('email'));
					}
				}
			})
		}

		
	}
	
	function changePwd() {

		var pwd = prompt("请输入", userPro.password);
		
		var that = this;

		if(name == null) {
			return;
		} else {
			$.ajax({
				type: "post",
				url: nowSever + "/service/userController/updatePassword",
				data: {
					jsonData: JSON.stringify({
						"userId": userPro.userId,
						"password": pwd,
					})
				},

				async: true,
				success: function(data) {
					alert(data.reason);
					console.log(data);
					if(data.errorCode == '200') {
						for(var item in data.result) {
							sessionStorage.setItem(item, data.result[item]);
						}
						
					}
				}
			})
		}
	}

	function changeSex() {
		//0为男 1为女
		userPro.sex = $(this).attr('data-sex') == '0' ? '男' : '女';

	}

	//获取年份
	function getBirthYear() {

		birthYear = $(this).val();

		userPro.birth = birthYear;

	}
	//获取月份
	function getBirthMonth() {
		birthMonth = $(this).val();

		userPro.birth += '-' + birthMonth;
	}

	//获取天
	function getBirthDay() {
		birthDay = $(this).val();

		userPro.birth += '-' + birthDay;
	}

	//获取地址
	function getAddrPri() {

		userPro.address = $(this).val();

	}

	function getAddrCity() {
		userPro.address += ' ' + $(this).val();
	}

	$('#saveProfile').on('click', updateUser);

	function updateUser() {
		$.ajax({
			type: "post",
			url: nowSever + '/service/userController/userUpdata',
			data: {
				jsonData: JSON.stringify({
					"user": userPro
				})
			},
			async: true,
			success: function(data) {
				console.log(data);
				//将返回数据重新遍历到sessionStorage中
				for(var item in data.result) {
					sessionStorage.setItem(item, data.result[item]);
				}

				if(data.errorCode == '200') {
					alert(data.reason);
					//刷新页面
//					window.open('./basics.html', '_self');

				} else {
					alert(data.reason);
				}
			}
		});
	}

})