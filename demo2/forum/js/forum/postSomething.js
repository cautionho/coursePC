$(function() {

	//	$('.emotion').qqFace({
	//
	//		id: 'facebox',
	//
	//		assign: 'saytext',
	//
	//		path: 'arclist/' //表情存放的路径
	//
	//	});
	//
	//	$(".sub_btn").click(function() {
	//
	//		var str = $("#saytext").val();
	//
	//		var newReply = $(".show>li").eq(0).clone(true);
	//
	//		$(newReply).css({
	//
	//			display: 'block',
	//		})
	//
	//		$(".comment-container>.comment-ul").append(newReply);
	//
	//		$(".show>li").eq(-1).children('div.comment-ul-contant').children('p').html(replace_em(str));
	//
	//	});
	//
	//	//查看结果
	//
	//	function replace_em(str) {
	//
	//		str = str.replace(/\</g, '&lt;');
	//
	//		str = str.replace(/\>/g, '&gt;');
	//
	//		str = str.replace(/\n/g, '<br/>');
	//
	//		str = str.replace(/\[em_([0-9]*)\]/g, '<img src="arclist/$1.gif" border="0" />');
	//
	//		return str;
	//
	//	}

	//获取url
	var nowSever = '';

	$.ajax({
		type: "get",
		url: "../user/js/url.json",
		async: true,
		success: function(data) {
			nowSever = data.localurl;
			//请求板块列表
			$.ajax({
				type: "post",
				url: nowSever + "/service/sectionController/querySectionList",
				data: '',
				async: true,
				success: function(data) {
					console.log(data)
					//更新板块列表
					for(var item in data.result[0]) {
						postVm.sections.push(data.result[0][item]);
					}
				}
			});
		}
	});

	sessionStorage.setItem('userId','58ef8e38c887b92b30a42039');

	var postVm = new Vue({

		data: {

			sections: [],
			post : [] //当前发布的帖子的内容

		}

	}).$mount('#main');

	//提交帖子的内容
	$('#subPost').on('mousedown', submitPost);

	function submitPost() {

		//获取板块
		var sectionName = $('#sectionOption').val();
		console.log(sectionName);

		//获取标题
		var postTitle = $('#postTitle').val();

		//获取简介
		var postIntro = $('#postIntro').val();

		//获取内容
		var postContent = $('#saytext').val();

		if(postTitle == '' || postIntro == '' || postContent == '') {
			alert('输入有误!');
			return;
		} else {

			$.ajax({
				type: "post",
				url: nowSever + "/service/postController/addOrUpdatePost",
				data: {
					jsonData: JSON.stringify({
						'loginId': sessionStorage.getItem('userId'),
						'post': {
							'postName': postTitle,
							'describe': postIntro,
							'content': postContent,
							'sectionName': sectionName,
							'userId': sessionStorage.getItem('userId')
						}
					})
				},
				async: true,
				success: function(data) {
					alert(data.reason)
					console.log(data);

					if(data.errorCode == '200'){

						for(var item in data.result){
							postVm.post[item] = data.result[item];
							sessionStorage.setItem(item,data.result[item]);
						}

						window.open('./contant.html','_self');
					}else{
						return;
					}
				}
			});

		}

	}

});