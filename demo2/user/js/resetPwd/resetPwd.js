$(function(){
	
	var flag1 = false;
	
	var flag2 = false;
	
	//从数据库寻找是否有匹配的用户名
//	$.post('...',{username:$('#username').val()},false);

	//电话号码正则
	var phonePatt = /1[3|4|5|7|8][0-9]{9}/;
			
	//邮箱正则
	var emailPatt = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	
	$('.code').keyup(function(){
		
		//判断验证码是否输入正确
		if($('.code').val().toLowerCase() == 'ntbe'){
		
			flag1 = true;
			
		}else{
			
			flag1 = false;
			
		}
		
		console.log(flag1);
		
		if(flag1 && flag2){
		
		$('#next-step').removeAttr('disabled');
		
	}
		
	})
	
	$('#username').blur(function(){
		
		if(phonePatt.test($('#username').val()) || emailPatt.test($('#username').val())){
			
			flag2 = true;
			
		}else{
			
			flag2 = false;
			
		}
		
		console.log(flag2);
		
		if(flag1 && flag2){
		
		$('#next-step').removeAttr('disabled');
		
	}
		
	})
	
	$('#next-step').click(function(){
		
		$('#usernameform').hide().next().show();
		$('.forget-user-nav li').eq(0).css({
			
			background : 'none',
			
			color : '#000',
			
		}).next().css({
			
			background : 'url(../img/resetPwd/sub_nav_2.png) no-repeat 0 0',
			
			color : '#2E82FF',
			
		})
		
	})
	
	
})
