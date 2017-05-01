$(function() {
	
	var wait = document.getElementsByClassName('beginAnamition')[0];
	
	wait.style.display = 'none';

	//初始化密码框后面提示
	$('#resign-form input').eq(1).next().html('&nbsp;&nbsp;8-20位,区分大小写').css({

		fontSize: '12px',
		color: 'rgb(192,192,192)'

	})

	var nowSever = '';

	$.ajax({
		type: "get",

		url: "../js/url.json",

		async: true,

		success: function(data) {
			//			console.log(data);
			nowSever = data.localurl;

		}
	});

	//初始化用户名和密码
	var phoneUser = '';
	var emailUser = '';
	var pwd = '';

	$('#resign-option li').click(function() {

		//css控制功能键的样式
		$(this).addClass('choose').siblings().removeClass('choose');

		//判断用户选择用哪种方式登录  初始化表单信息
		if($(this).text() == ('~  邮箱注册')) {

			$('input').eq(0).attr({

					type: 'email',

					name: 'userMail',

				}).val('')
				.next().text('')
				//label 复位
				.next().text('请输入您的邮箱').css({
					color: 'rgb(192,192,192)',
					transform: 'translateY(0px)',
					transition: 'all .5s',
					background: '#fff',
					zIndex: -2,
					color: 'rgb(192,192,192)'
				});

			$('input').eq(1).next().text('');

			phoneUser = ''; //复原phoneUser变量

		} else {

			$('input').eq(0).attr({

					type: 'tel',

					name: 'userPhone',

				}).val('')
				.next().text('')
				.next().text('请输入手机号码').css('color', 'rgb(192,192,192)');

			$('input').eq(1).next().text('');

			emailUser = ''; //复原emailUser变量

		}

		//每次转换的时候还原密码框后面的提示
		$('#resign-form input').eq(1).next().html('&nbsp;&nbsp;8-20位,区分大小写')
			.css({

				fontSize: '12px',
				color: 'rgb(192,192,192)'

			})

	});

	//表单聚焦和失焦事件
	//遍历添加聚焦事件
	$('#resign-form input').each(function(i) {

		$(this).on('focus', setText);

	})

	$('#resign-form input').on('blur', checkText);

	//聚焦时 表单的label向上移动
	function setText() {

		$(this).next().next().css({
			transform: 'translateY(-22px)',
			transition: 'all .5s',
			background: '#fff',
			zIndex: 0,
			color: '#5ECFBA'
		});

	}

	//失焦时,校验输入的信息格式是否正确

	//标志位
	var flag1;

	var flag2;

	function checkText() {

		isSubmit();

		$(this).next().text('');

		var that = $(this);

		//用户名为空 label回到原位  input后显示提示字眼
		if($('#resign-form input').val() == '') {

			$(this).next().next().css({

					transform: 'translateY(0px)',
					transition: 'all .5s',
					background: '#fff',
					zIndex: -2,
					color: 'rgb(192,192,192)'

				})
				.end().html('&nbsp;<b>f&nbsp;</b>' + $(this).next().next().text())
				.css({

					fontSize: '12px',
					color: 'red',
					fontFamily: 'icon-family',

				});

		} else {

			//其他用正则验证用户输入字符串格式是否符合
			//电话号码正则
			var phonePatt = /1[3|4|5|7|8][0-9]{9}/;

			//邮箱正则
			var emailPatt = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

			//密码正则
			var pwdPatt = /^[\w,.!]{8,20}$/;

			//设置label样式
			$(this).next().next().css({

				transform: 'translateY(-22px)',
				transition: 'all .5s',
				background: '#fff',
				zIndex: 0,
				color: '#5ECFBA'

			});

			if($(this).attr('name') == 'userPhone') {

				if(phonePatt.test($(this).val())) {

					phoneUser = $(this).val().trim();

					$(this).next().addClass('wait');

					//检测用户名是否已存在  存在则报错
					$.ajax({
						type: "post",

						url: nowSever + '/service/userRegisterController/checkName',

						data: {
							jsonData: JSON.stringify({
								"userName": phoneUser,
								"type": "phoneUser"
							})
						},

						async: true,

						success: function(data) {

							//判断返回值,如果成功 则执行下面判断正确的操作
							console.log(data);

							that.next().removeClass('wait');

							//用户名在数据库中不存在
							if(data.errorCode == '200') {
								//成功的操作
								that.next().html('&nbsp;t').css({

									fontFamily: 'icon-family',
									color: '#0f0',

								})
								flag1 = true;

							} else {
								//用户名存在
								that.next().html('&nbsp;f 用户名已存在').css({

									fontFamily: 'icon-family',
									color: '#f00',

								})

								flag1 = false;
								//								alert(data.reason);

							}

							isSubmit();

						}
					});
				} else {
					that.next().removeClass('wait');
					that.next().html('&nbsp;f 请输入正确手机号码').css({

						fontFamily: 'icon-family',
						color: '#f00',

					})

					flag1 = false;
				}
			}

			if($(this).attr('name') == 'userMail') {

				if(emailPatt.test($(this).val())) {

					$(this).next().addClass('wait');

					emailUser = $(this).val().trim();

					//验证用户名是否存在
					$.ajax({
						type: "post",

						url: nowSever + '/service/userRegisterController/checkName',

						data: {
							jsonData: JSON.stringify({
								"userName": emailUser,
								"type": "emailUser"
							})
						},

						async: true,

						success: function(data) {

							//判断返回值,如果成功 则执行下面判断正确的操作
							console.log(data);

							that.next().removeClass('wait');

							if(data.errorCode == '200') {
								//成功验证
								that.next().html('&nbsp;t').css({
									fontFamily: 'icon-family',
									color: '#0f0',

								})

								flag1 = true;

							} else {
								that.next().text('  f 用户名已存在').css({

									fontFamily: 'icon-family',
									color: '#f00',

								})

								flag1 = false;
							}

							isSubmit();

						}

					});
				} else {
					that.next().removeClass('wait');
					that.next().html('&nbsp;f 请输入正确邮箱').css({

						fontFamily: 'icon-family',
						color: '#f00',

					})

					flag1 = false;
				}
			};

		}

		if($(this).attr('name') == 'pwd') {

			if(pwdPatt.test($(this).val())) {

				pwd = $(this).val().trim();

				$(this).next().html('&nbsp;t').css({
					fontFamily: 'icon-family',
					color: '#0f0',

				})

				flag2 = true;

			} else {

				$(this).next().html('&nbsp;f').css({

					fontFamily: 'icon-family',
					color: '#f00',

				})

				flag2 = false;
			}

			isSubmit();
		}

	}

	function isSubmit() {
		//判断用户名和密码是否都符合规则 符合则允许提交
		if(flag1 && flag2) {

			$('input[type="submit"]').attr('disabled', null);

		} else {
			$('input[type="submit"]').attr('disabled', 'disabled');
		}
	}

	$('#resign_btn').on('click', function(e) {

		//阻止表单默认提交行为
		var ev = e || window.event;
		ev.preventDefault();

		var userName = emailUser == '' ? phoneUser : emailUser;

		var type = emailUser == '' ? 'phoneUser' : 'emailUser';

		//注册时间

		var time = new Date().format("yyyy-MM-dd hh:mm:ss");

		//注册验证
		$.ajax({
			type: "post",
			url: nowSever + '/service/userRegisterController/register',
			data: {
				jsonData: JSON.stringify({
					"userName": userName,
					"password": pwd,
					"type": type,
					"registerTime": time,
				})
			},
			async: true,
			success: function(data) {
				//判断返回的数据
				//				console.log(data);
				//成功的操作
				if(data.errorCode == '200') {
					//将用户数据遍历到sessionStorage
					console.log(data);

					//					console.log(sessionStorage.getItem('user'))

					for(var item in data.result) {
						sessionStorage.setItem(item, data.result[item]);
					}
					alert(data.reason);

					//将资料写到header中
					if(userName != '') {
						//注册成功跳转页面
						window.open('basics.html', '_self');
						//隐藏登录表单
						$('#dologinbox').hide();
						//用户的东西显示出来
						$('#userMsg').show();

						$('#userMsgName').text(userName);

					} else {

						$('#userMsg').hide();

						$('#dologinbox').show();
					}

					

				} else {
					alert(data.reason);
					return;
				}

			}
		});
	})

	//按登录按钮
	$('#goLogin').on('click', function() {

		$('.outset').removeClass('outZindex');

	})

	//按模态框关闭按钮
	$('button[class="close"]').on('click', function() {

		$('.outset').addClass('outZindex');
		$('#login-form-tips').slideUp()
		$('#login-form-tips').slideUp()

	})
});