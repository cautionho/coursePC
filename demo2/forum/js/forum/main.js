$(function() {

	//判断用户是否登录了
	if(sessionStorage.getItem('userId') != '') {

		$('#forumLogin').hide();
		$('#forumLoginMsg').show();

	} else {
		$('#forumLogin').show();

		$('#forumLoginMsg').hide();
	}

	var nowSever = '';

	$.ajax({
		type: "get",
		url: "../user/js/url.json",
		async: true,
		success: function(data) {
			nowSever = data.localurl;
			console.log(nowSever);

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
						forumVm.sections.push(data.result[0][item]);
					}

					for(var item in data.result[1]) {
						forumVm.hotPost.push(data.result[1][item]);
					}

				}
			});
		}
	});

	var userVm = new Vue({

		data: {

			'userName': sessionStorage.getItem('email') || sessionStorage.getItem('phone')

		}

	}).$mount('#forumLoginMsg');

	//vm层
	var forumVm = new Vue({

		data: {

			sections: [], //板块信息
			hotPost: [], //热帖
			post: [], //普通帖子

		},

		methods: {

			//获取指定板块中的所有帖子
			getSection: function(e) {

				var that = this;

				var sectionName = e.currentTarget.innerText;

				$.ajax({
					type: "post",
					url: nowSever + "/service/postController/queryPostList",
					data: {
						jsonData: JSON.stringify({

							'loginId': sessionStorage.getItem('userId') || '',
							'sectionName': sectionName,
							'pageIndex': '1',
							'pageSize': '7'

						})
					},
					async: true,
					success: function(responseText) {
						console.log(responseText)
						if(responseText.errorCode == '200') {
							//更新热帖
							that.hotPost = [];
							//更新帖子
							that.post = [];

							for(var item in responseText.result[0]) {
								that.hotPost.push(responseText.result[0][item]);
							}

							for(var item in responseText.result[1]) {
								that.post.push(responseText.result[1][item]);
							}
						} else {
							alert('请求异常');
						}

					}
				});

			},

			//*****************判断是否显示删除按钮*******************
			showDel: function(e) {

				var currentId = $(e.currentTarget).children().children('.userId').text();

				if(currentId == sessionStorage.getItem('userId')) {

					$(e.currentTarget).children().children('.isDel').show();
					$(e.currentTarget).siblings().children().children('.isDel').hide();

				} else {
					$(e.currentTarget).children().children('.isDel').hide();
				}

			},

			//*************************删除帖子***************************
			delCurrent: function(e) {

				var that = this;

				//获取当前的ID
				var currentId = $(e.currentTarget).prev().prev('.postId').text();

				var currentIndex, postType;

				//获取下标
				for(var item in this.hotPost) {
					if(currentId == this.hotPost[item].postId) {
						currentIndex = item;
						postType = 'hot';
					}
				}

				for(var item in this.post) {
					if(currentId == this.post[item].postId) {
						currentIndex = item;
						postType = 'normal';
					}
				}

				var isDel = confirm('确定要删除此帖?');

				if(isDel) {

					$.ajax({
						type: "post",
						url: nowSever + "/service/postController/deletePost",
						data: {
							jsonData: JSON.stringify({
								'loginId': sessionStorage.getItem('userId'),
								'postId': currentId
							})
						},
						async: true,
						success: function(responseText) {
							alert(responseText.reason);

							if(responseText.errorCode == '200') {

								//删的是热帖
								if(postType == 'hot') {
									that.hotPost.splice(currentIndex, 1);

									//删普通帖
								} else if(postType == 'normal') {
									that.post.splice(currentIndex, 1);
								}

							}
						}
					});

				}

			},

			//************************查看帖子详情*************************
			goDetails: function(e) {
				//***************获取当前帖子的id*******************
				var currentId = $(e.currentTarget).children().children('.postId').text();

				$.ajax({
					type: "post",
					url: nowSever + "/service/postController/queryPost",
					data: {
						'postId': currentId
					},
					async: true,
					success: function(responseText) {
						console.log(responseText);

						//						for(var item in responseText.result){
						//
						//							localStorage.setItem(item,responseText.result[item]);
						//
						//						}
						sessionStorage.setItem('postId', responseText.result.postId);

						//						sessionStorage.setItem('content',responseText.result.content);

						window.open('./contant.html', '_self');
					}
				});

			}
		}

	}).$mount('#main');

	$("ul.search-type").click(function() {

			$(".btn-subtype").toggleClass("btn-subtype-rotat"),

				$(".subtype-wrap").slideToggle(200)

		}),
		$("ul.ul-users").find("li").each(function(t, n) {

			(t + 1) % 3 == 0 && $(this).css("marginRight", "0px")

		}),

		$("#wechat").on("mouseenter", function() {

			$(this).find("img").stop().fadeIn()

		}).on("mouseleave", function() {

			$(this).find("img").stop().fadeOut()

		})

});