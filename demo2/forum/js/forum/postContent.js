$(function() {

	var nowSever = '';

	$.ajax({
		type: "get",
		url: "../user/js/url.json",
		async: true,
		success: function(data) {
			nowSever = data.localurl

			postContentVm.getPostMsg();

			postContentVm.getReply();

		}
	});

	var postContentVm = new Vue({

		data: {

			current: [],

			reply: []

		},

		methods: {

			getPostMsg: function() {

				var that = this;

				//拿回帖子的信息
				$.ajax({
					type: "post",
					url: nowSever + "/service/postController/queryPost",
					data: {
						'postId': sessionStorage.getItem('postId')
					},
					async: true,
					success: function(responseText) {

						console.log(responseText);

						if(responseText.errorCode == '200') {

							that.updatePost(responseText.result);

						} else {
							alert('请求异常');
							return;
						}

					}
				});

			},

			getReply: function() {

				var that = this;

				$.ajax({
					type: "post",
					url: nowSever + "/service/replyController/queryReplyList",
					data: {
						jsonData: JSON.stringify({
							'postId': sessionStorage.getItem('postId'),
							'pageIndex': '1',
							'pageSize': '7'
						})
					},
					async: true,
					success: function(responseText) {
						console.log(responseText);

						if(responseText.errorCode == '200') {

							for(var item in responseText.result.content) {
								that.reply.push(responseText.result.content[item]);
							}
						}

					}
				});

			},

			updatePost: function(val) {

				this.current = [];
				this.current.push(val);
//
				var time = new Date(this.current[0].createTime);

//				this.current[0].createTime = Date.prototype;

				console.log(typeof time);

				console.log(time);

				this.current[0].create = time.format('yyyy-MM-dd');

			}

		}

	}).$mount('#main');

	$('#subReply').on('mousedown', postReply);

	function postReply() {

		var newReply = $('#saytext').val();

		console.log(newReply);

		if(newReply == '') {
			alert('提交不能为空!');
		} else {

			$.ajax({
				type: "post",
				url: nowSever + "/service/replyController/addReply",
				data: {
					jsonData: JSON.stringify({
						'loginId': sessionStorage.getItem('userId') || '',
						'newReply': {
							'postId': sessionStorage.getItem('postId'),
							'userId': sessionStorage.getItem('userId') || '',
							'content': newReply,
//							'nickName': sessionStorage.getItem('nickName')
						}
					})
				},
				async: true,
				success: function(data) {
					console.log(data);

					postContentVm.reply.push(data.result);

					var time = new Date(postContentVm.reply[0].createTime);

					postContentVm.reply[-1].create = time.format('yyyy-MM-dd');

					console.log(postContentVm.reply)
				}
			});

		}

	}


	console.log(Date.prototype.format);


})