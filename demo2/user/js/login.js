$(function() {

	//页面加载
	var wait = document.getElementsByClassName('beginAnamition')[0];
//
//	wait.style.display = 'none';

	var nowSever = '';

	$.ajax({
		type: "get",
		url: "../js/url.json",
		async: true,
		success: function(data) {
			nowSever = data.localurl;
		}
	});

	$('#id_account_l,#id_password_l').focus(function() {
		$('#login-form-tips').slideUp()
	})

	//电话号码正则
	var phonePatt = /1[3|4|5|7|8][0-9]{9}/;

	//邮箱正则
	var emailPatt = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

	//密码正则
	var pwdPatt = /^[\w,.!]{8,20}$/;

	var pattern = /resign/

	var flag1 = false;

	var flag2 = false;

	var userName = '';

	var pwd = '';

	$('#id_account_l').keyup(function() {

		if($(this).val() == '') {

			$('#login-form-tips').text('用户名不能为空').slideDown().css('color', '#f00');

			flag1 = false;

		} else if(phonePatt.test($(this).val()) || emailPatt.test($(this).val())) {

			userName = $(this).val().trim();

			flag1 = true;

		} else {

			$('#login-form-tips').text('用户名或密码错误,请检查').slideDown().css('color', '#f00');

			flag1 = false;

		}

		if(flag1 && flag2) {

			$('#login_btn').addClass('btn-success');

		} else {

			$('#login_btn').removeClass('btn-success');

		}

	})

	$('#id_password_l').blur(function() {


		if($(this).val() == '') {

			$('#login-form-tips').text('密码不能为空').slideDown().css('color', '#f00');

			flag2 = false;

		} else if(pwdPatt.test($(this).val())) {

			pwd = $(this).val().trim();

			flag2 = true;

		} else {

			$('#login-form-tips').text('用户名或密码错误,请检查').slideDown().css('color', '#f00');

			flag2 = false;

		}

		if(flag1 && flag2) {

			$('#login-form-tips').slideUp();

			$('#login_btn').addClass('btn-success');

			//页面等待
			wait.style.display = 'block';

			//判断邮箱还是电话号码账号
			type = userName.indexOf('@') == -1 ? 'phoneUser' : 'emailUser';

			$.ajax({
				type: "post",
				url: nowSever + '/service/userRegisterController/login',
				data: {
					jsonData: JSON.stringify({
						'userName': userName,
						'password': pwd,
						'type': type,
					})
				},
				async: true,
				success: function(data) {
					wait.style.display = 'none';

					if(data.errorCode == '200') {
						$('#login_btn').attr('data-dismiss', 'modal');
					}else{
						$('#login_btn').attr('data-dismiss','');
					}
				}
			});

		}

	})

	var loginBtn = document.getElementById('login_btn');

	var username = $('#id_account_l').val();

	loginBtn.onclick = function() {

		if($('#id_password_l').val() == '' || $('#id_password_l').val() == '') {

			$('#login-form-tips').text('用户名或密码不能为空').slideDown().css('color', '#f00');

			return;
		} else if(flag1 && flag2) {

			//后面给数据
			$.ajax({
				type: "post",
				url: nowSever + '/service/userRegisterController/login',
				data: {
					jsonData: JSON.stringify({
						'userName': userName,
						'password': pwd,
						'type': type,
					})
				},
				async: true,
				success: function(data) {
					//登录成功
					if(data.errorCode == '200') {
						//将用户资料遍历到sessionStorage中
						for(var item in data.result) {
							sessionStorage.setItem(item, data.result[item]);
						}
						alert(data.reason);

						var user = userName;
						loginSuccess(user);

						var data1 = {
							storage : sessionStorage,
						}

						var data2 = {
							data : data1,
						}

						var html = template('loginMsg',data2);

						document.getElementById('userMsg').innerHTML = html;

					} else if(data.error == '400') {
						//密码错误的
						$('#loginModal').show();
						alert(data.reason);
					} else {
						//该用户不存在
						loginFault();
						$('#loginModal').show();
						alert(data.reason);
					}
				}
			});
		}
	}

	function loginSuccess(user) {

	if(pattern.test(window.location.href)) {

		window.open('./xJia.html', '_self');

	} else {

		if(user != '') {
			//隐藏登录表单
			$('#dologinbox').hide();
			//用户的东西显示出来
			$('#userMsg').show();

//			$('#userHead').attr('src',sessionStorage.getItem('head'));

//			$('#userMsgName').text(user);

		} else {

			$('#userMsg').hide();

			$('#dologinbox').show();
		}

	}
}

	function loginFault() {
		$('#login-form-tips').text('用户名或密码错误,请检查').slideDown().css('color', '#f00');
	}

	//退出登录
	$('#loginout').on('click', loginOut);

	function loginOut() {

		alert('登出成功！');

		//销毁数据
		for(var item in sessionStorage){
			sessionStorage.removeItem(item);
		}
//		sessionStorage.removeItem('user');

		$('#userMsg').hide();

		$('#dologinbox').show();

		window.open('./xJia.html', '_self');


	}

})