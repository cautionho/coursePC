$(function() {

	var nowSever = '';

	$.ajax({
		type: "get",
		url: "../../demo2/user/js/url.json",
		async: true,
		success: function(data) {
			nowSever = data.localurl;
			console.log(nowSever);
		}
	});

	var managerVm = new Vue({

		data: {
			managerName: sessionStorage.getItem('managerName')
		}

	}).$mount('#admin');

	//一开始查询就遍历 增加的时候动态监听数据改变
	//最大的vm 渲染整个页面
	var adminVm = new Vue({

		data: {

			id: '',
			lv: '', //当前管理员的等级
			num: 0,
			show: false,
			section: [],
			admin: [],
			sectionHandler: '', //判断修改板块或者新增板块  修改为0 新增为1
			sectionChange: [], //用于存放板块信息  当前板块的id和下标
			adminHandler: '', //判断修改管理员或者新增管理员  修改为0 新增为1
			adminChange: [], //用于存放管理员信息  当前板块的id和下标
			post: [], //用于存放帖子信息
			postDetial: {}, //用于存放当前帖子的详细信息
			pages: 0, //用于存放页数
			postChange: [], //用于存放要操作的帖子的信息
			postHandler: '', //判断修改或新增帖子  修改为0 新增为1

		},

		methods: {

			get: function(val) {

				var that = this;

				this.num = val;

				//ajax请求  *************************查询更新列表*********************************
				//查询板块
				switch(this.num) {
					case 4:
						$.ajax({
							type: "post",
							url: nowSever + '/service/sectionController/querySectionList',
							async: true,
							success: function(responseText) {

								console.log(responseText);
								if(responseText.errorCode == '200') {
									that.updateSection(responseText.result[0]);
								}

							}
						})
						break;
						//帖子管理
					case 6:
						$.ajax({
							type: "post",
							url: nowSever + '/service/postController/queryPostList',
							data: {
								jsonData: JSON.stringify({

									'loginId': sessionStorage.getItem('managerId'),
									'sectionName': '',
									'pageIndex': '1',
									'pageSize': '7',

								})
							},
							async: true,
							success: function(responseText) {

								console.log(responseText);
								if(responseText.errorCode == '200') {
									//默认第一个板块
									$('#sectionOption').children().eq(0).attr('selected', 'selected');

									//更新板块信息
									that.updateSection(responseText.result[0]);

									//更新页数
									that.pages = responseText.result[2];

									//更新帖子列表
									that.updatePostList(responseText.result[1].content)

									//绘制分页
									pagesList(that.pages);
								}

							}
						});
						break;

						//管理员管理
					case 9:
						$.ajax({
							type: "post",
							url: nowSever + '/service/managerController/queryManagerList',
							data: {

								managerId: sessionStorage.getItem('managerId')

							},
							async: true,
							success: function(responseText) {

								console.log(responseText);

								that.updateAdmin(responseText.result);

							}
						});
						break;

						//查看帖子详情
					case 10:

						console.log(event.currentTarget.innerText);
						for(var item in this.post) {
							if(this.post[item].postName == event.currentTarget.innerText) {
								var postInden = this.post[item].postId;
							}
						}

						$.ajax({
							type: "post",
							url: nowSever + "/service/postController/queryPost",
							data: {
								'postId': postInden
							},
							async: true,
							success: function(responseText) {
								console.log(responseText);

								//请求帖子的回复内容
								if(responseText.errorCode == '200') {

									that.updatePostDetails(responseText.result);

									console.log(that.postDetial);

									$.ajax({
										type: "post",
										url: nowSever + "/service/replyController/queryReplyList",
										data: {
											jsonData: JSON.stringify({
												'postId': postInden,
												'pageSize': '7',
												'pageIndex': '1'
											})
										},
										async: true,
										success: function(responseText) {
											console.log(responseText);
										}
									});

								}

							}
						});
						break;
				}

			},

			//*************************删除论坛版块*****************************
			deleteCurrent: function(val) {

				var isDel = confirm('是否确认删除?');

				var that = this;

				//获取当前版块id (通过隐藏域获得)
				var sectionId = val.currentTarget.nextElementSibling.innerText;

				//获取当前要删除对象的下标值
				for(var item in this.section) {

					if(sectionId == this.section[item].sectionId) {
						var index = item;
					}

				}

				if(isDel) {

					$.ajax({
						type: "post",
						url: nowSever + "/service/sectionController/deleteSection",
						data: {
							sectionId: sectionId
						},
						async: true,
						success: function(responseText) {

							alert(responseText.reason);

							that.section.splice(index, 1);

						}
					});
				}

			},

			//*****************判断修改或新增 板块*********************
			sectionType: function(val) {

				//初始化
				this.sectionChange = [];

				var newType = val.currentTarget.innerText;
				//0是修改  1是新增
				this.sectionHandler = newType == '修改' ? 0 : 1;

				var section, sectionIndex;

				if(this.sectionHandler == 0) {
					//修改的ID
					section = val.currentTarget.nextElementSibling.nextElementSibling.innerText;
					//修改的下标
					for(var item in this.section) {

						if(section == this.section[item].sectionId) {
							sectionIndex = item;
						}

					}

					//需要修改的值显示在模态框
					$('#partName').val(this.section[sectionIndex].sectionName);

					$('#partIntro').val(this.section[sectionIndex].describe);

				} else {

					//新增  初始化所有值
					$('#partName').val('');

					$('#partIntro').val('');

				}

				this.sectionChange.push(section, sectionIndex);

			},

			//新增和修改板块
			editSection: function(type, sectionId, index) {

				var that = this;

				var newPartName = $('#partName').val().trim();

				var newPartIntro = $('#partIntro').val().trim();

				//没有传入id则是添加板块
				if(type == 1) {

					$.ajax({
						type: "post",
						url: nowSever + "/service/sectionController/addSection",
						data: {
							section: JSON.stringify({
								'sectionName': newPartName,
								'describe': newPartIntro
							})
						},
						async: true,
						success: function(responseText) {

							alert(responseText.reason);

							if(responseText.errorCode == '200') {

								that.section.push(responseText.result);

							} else {
								return false;
							}

						}

					})

				} else if(type == 0) {

					//修改
					$.ajax({
						type: "post",
						url: nowSever + "/service/sectionController/addSection",
						data: {
							section: JSON.stringify({
								'sectionId': sectionId,
								'sectionName': newPartName,
								'describe': newPartIntro
							})
						},
						async: true,
						success: function(responseText) {
							console.log(responseText);
							alert(responseText.reason);
							if(responseText.errorCode == '200') {
								//更新当条板块信息
								that.section[index].sectionName = responseText.result.sectionName;

								that.section[index].describe = responseText.result.describe;

							} else {
								return false;
							}

						}

					})
				}
			},

			//**********************判断修改或新增帖子************************
			editPost: function(val) {

				//初始化
				this.postChange = [];

				var newType = val.currentTarget.innerText;
				//0是修改  1是新增
				this.postHandler = newType == ' 修改' ? 0 : 1;

				console.log(newType);

				var postIdent, postIndex;

				if(this.postHandler == 0) {
					//修改的ID
					postIdent = val.currentTarget.nextElementSibling.nextElementSibling.innerText;
					//修改的下标
					for(var item in this.post) {

						if(postIdent == this.post[item].postId) {
							postIndex = item;
						}

					}

					//需要修改的值显示在模态框
					//当前板块名
					$('#currentSection').val($('#sectionOption').val());

					//帖子名称
					$('#postName').val(this.post[postIndex].postName);

					//帖子简介
					$('#postIntro').val(this.post[postIndex].describe);

					//帖子内容
					$('#postContent').val(this.post[postIndex].content);

					//帖子作者
					$('#postAuthor').val(this.post[postIndex].userId);

					$('#postLevel').removeAttr('disabled');

				} else {

					//新增  初始化所有值
					$('#currentSection').val(document.getElementsByName('sectionOption')[0].value);

					//帖子名称
					$('#postName').val('');

					//帖子简介
					$('#postIntro').val('');

					//帖子内容
					$('#postContent').val('');

					//帖子作者
					$('#postAuthor').val(sessionStorage.getItem('managerId'));

					$('#postLevel').attr('disabled', 'disabled').val('1');

				}

				this.postChange.push(postIdent, postIndex);

			},

			postHandle: function(type, postId, index) {

				var that = this;

				var sectionName = $('#currentSection').val();

				var newPostName = $('#postName').val().trim();

				var newPostIntro = $('#postIntro').val().trim();

				var newPostContent = $('#postContent').val().trim();

				var postAuthor = $('#postAuthor').val();

				var postLevel = $('#postLevel').val();

				//1是添加
				if(type == 1) {

					$.ajax({
						type: "post",
						url: nowSever + "/service/postController/addOrUpdatePost",
						data: {
							jsonData: JSON.stringify({
								'loginId': sessionStorage.getItem('managerId'),
								'post': {
									'postName': newPostName,
									'describe': newPostIntro,
									'content': newPostContent,
									'sectionName': sectionName,
									'userId': sessionStorage.getItem('managerId'),
								}
							})
						},
						async: true,
						success: function(responseText) {
							console.log(responseText);
							alert(responseText.reason);

							if(responseText.errorCode == '200') {

								that.post.push(responseText.result);

							} else {
								return false;
							}

						}

					})

				} else if(type == 0) {

					//修改
					$.ajax({
						type: "post",
						url: nowSever + "/service/postController/addOrUpdatePost",
						data: {
							jsonData: JSON.stringify({
								'loginId': sessionStorage.getItem('managerId'),
								'post': {
									'postName': newPostName,
									'describe': newPostIntro,
									'content': newPostContent,
									'sectionName': sectionName,
									'userId': postAuthor,
									'postId': postId,
									'postType': postLevel
								}
							})
						},
						async: true,
						success: function(responseText) {
							console.log(responseText);
							alert(responseText.reason);
							if(responseText.errorCode == '200') {

								$.ajax({
									type: "post",
									url: nowSever + "/service/postController/queryPostList",
									data: {
										jsonData: JSON.stringify({

											'loginId': sessionStorage.getItem('managerId'),
											'sectionName': sectionName,
											'pageIndex': '1',
											'pageSize': '7',
										})
									},
									async: true,
									success: function(responseText) {
										console.log(responseText);

										if(responseText.errorCode == '200') {
											$('#sectionOption').val(sectionName);

											that.updatePostList(responseText.result[1].content);
										} else {
											return;
										}

									}
								});

								console.log(that.post[index]);

							} else {
								return false;
							}

						}

					})
				}

			},
			//*******************删除帖子*******************
			deletePost: function(val) {

				var that = this;

				var isDel = confirm('是否确认删除此帖子?');

				//获取当前ID
				var postInden = val.currentTarget.nextElementSibling.innerText;

				var postIndex;

				for(var item in this.post) {
					if(postInden == this.post[item].postId) {
						postIndex = item;
					}
				}
				if(isDel) {

					$.ajax({
						type: "post",
						url: nowSever + "/service/postController/deletePost",
						data: {
							jsonData: JSON.stringify({

								'loginId': sessionStorage.getItem('managerId'),
								'postId': postInden

							})
						},
						async: true,
						success: function(responseText) {
							console.log(responseText);

							if(responseText.errorCode == '200') {

								alert(responseText.reason);

								that.post.splice(postInden, 1);
							} else {
								return;
							}

						}
					});

				}

			},

			//*************************判断修改或新增 管理员***********************
			adminType: function(val) {
				//初始化
				this.adminChange = [];

				var newType = val.currentTarget.innerText;
				//0是修改  1是新增
				this.adminHandler = newType == '修改' ? 0 : 1;

				//id和下标
				var admin, adminIndex;

				if(this.adminHandler == 0) {
					//修改的ID
					admin = val.currentTarget.nextElementSibling.nextElementSibling.innerText;

					//修改的权限
					var level = val.currentTarget.parentElement.previousElementSibling.innerText;

					//修改的下标
					for(var item in this.admin) {

						if(admin == this.admin[item].managerId) {
							adminIndex = item;
						}

					}

					//如果修改的是自己,则不能修改权限
					if(admin == sessionStorage.getItem('managerId')) {

						$('#adminLevel').attr('disabled', 'disabled');

					} else {
						$('#adminLevel').removeAttr('disabled');
					}

					//需要修改的值显示在模态框
					$('#adminAcount').val(this.admin[adminIndex].managerName);

					$('#adminLevel').val(this.admin[adminIndex].managerLevel);

					$('#adminPwd').val(this.admin[adminIndex].password);

					//版主特有   负责的板块
					$('#adminPart').val(this.admin[adminIndex].sectionName);

				} else {

					//新增  初始化所有值
					$('#adminAcount').val('');

					$('#adminLevel').val('1');

					$('#adminPwd').val('');

				}

				//获取板块列表信息
				$.ajax({
					type: "post",
					url: nowSever + "/service/sectionController/querySectionList",
					async: true,
					success: function(responseText) {

						if(responseText.errorCode == '200') {

							adminVm.updateSection(responseText.result);

						}

					}
				});

				//如果是修改 查看当前管理员的等级是否为3(版主) 是则显示其负责的板块
				if($('#adminLevel').val() == '3') {
					$('#adminLevel').next().css({

						display: 'block'

					}).next().css({
						display: 'block'
					})
				} else {
					$('#adminLevel').next().css({
						display: 'none'
					}).next().css({
						display: 'none'
					})
				}

				this.adminChange.push(admin, adminIndex);
			},

			//**************************新增管理员//修改管理员****************************
			editAdmin: function(type, adminId, index) {

				var that = this;

				//添加的管理员的账号 权限等级 密码
				var newAdmin = $('#adminAcount').val().trim();

				var newAdminLevel = $('#adminLevel').val().trim();

				var newAdminPwd = $('#adminPwd').val().trim();

				var adminPart = $('#adminPart').val();

				//添加比自身权限更大的管理员 则缺少权限
				if(newAdminLevel < sessionStorage.getItem('managerLevel')) {

					alert('对不起,缺少权限!');

					return;
					//信息不能为空
				} else if(newAdmin == '' || newAdminLevel == '' || newAdminPwd == '') {

					alert('信息输入有误!');

					return;

				} else {

					//没有传入id则是添加
					if(type == 1) {

						$.ajax({
							type: "post",
							url: nowSever + "/service/managerController/addOrAuthManager",
							data: {

								'managerId': sessionStorage.getItem('managerId'),
								'manager': JSON.stringify({
									'managerName': newAdmin,
									'managerLevel': newAdminLevel,
									'password': newAdminPwd,
									'sectionName': adminPart

								})
							},
							async: true,
							success: function(responseText) {

								alert(responseText.reason);

								console.log(responseText);

								if(responseText.errorCode == '200') {

									that.admin.push(responseText.result);

								} else {
									return false;
								}

							}

						})

					} else if(type == 0) {

						var currentAdmin = sessionStorage.getItem('managerId');
						//修改自身
						if(adminId == currentAdmin) {

							$.ajax({
								type: "post",
								url: nowSever + "/service/managerController/updateManager",
								data: {
									'manager': JSON.stringify({
										'managerId': adminId,
										'managerName': newAdmin,
										'password': newAdminPwd,
										'sectionName': adminPart
									})
								},
								async: true,
								success: function(responseText) {
									console.log(responseText);
									alert(responseText.reason);
									if(responseText.errorCode == '200') {
										that.admin[index].managerName = responseText.result.managerName;
										that.admin[index].password = responseText.result.password;
									} else {
										return;
									}

								}
							});

						} else {

							$.ajax({
								type: "post",
								url: nowSever + "/service/managerController/addOrAuthManager",
								data: {
									'managerId': currentAdmin,
									'manager': JSON.stringify({
										'managerId': adminId,
										'managerName': newAdmin,
										'managerLevel': newAdminLevel,
										'password': newAdminPwd
									})
								},
								async: true,
								success: function(responseText) {
									alert(responseText.reason);
									console.log(responseText);
									if(responseText.errorCode == '200') {
										that.admin[index].managerName = responseText.result.managerName;
										that.admin[index].password = responseText.result.password;
									} else {
										return;
									}
								}
							});

						}
					}

				}

			},

			//****************************删除管理员**********************************
			deleteAdmin: function(val) {

				var that = this;

				//当前管理员的id
				var currentAdmin = sessionStorage.getItem('managerId');

				//要删除的管理员的id
				var deleteAdmin = val.currentTarget.nextElementSibling.innerText;

				//判断是否删除自己
				if(currentAdmin === deleteAdmin) {
					alert('非合法操作!');
					return;
				}

				//当前管理员的权限
				var currentLevel = sessionStorage.getItem('managerLevel');

				//要删除的管路员的权限
				var deleteLevel = val.currentTarget.parentElement.previousElementSibling.innerText;

				//获取当前要删除对象的下标值
				for(var item in this.admin) {

					if(deleteAdmin == this.admin[item].managerId) {
						var index = item;
					}

				}

				if(currentLevel >= deleteLevel) {
					alert('对不起,你没有权限进行操作!');
					return false;
				} else {

					var isDel = confirm('确认删除此管理员?');

					if(isDel) {
						$.ajax({
							type: "post",
							url: nowSever + "/service/managerController/deleteManager",
							data: {
								//当前做删除操作的 已登录的管理员id
								'deleteManagerId': currentAdmin,

								//要删除的管理员的id
								'managerId': deleteAdmin
							},
							async: true,
							success: function(responseText) {
								alert(responseText.reason);

								if(responseText.errorCode == '200') {
									that.admin.splice(index, 1);
								} else {
									return;
								}
							}
						});
					} else {
						return;
					}

				}

			},

			//*******************更新论坛版块vm层***********************
			updateSection: function(val) {
				this.section = [];

				for(var item in val) {
					this.section.push(val[item]);
				}
			},

			//*******************更新管理员vm层**************************
			updateAdmin: function(val) {
				this.admin = [];

				for(var item in val) {
					this.admin.push(val[item]);
				}
			},

			//********************更新帖子vm层******************************
			updatePostList: function(val) {
				this.post = [];

				for(var item in val) {
					this.post.push(val[item]);
				}
			},

			//***********************更新帖子详情**************************
			updatePostDetails: function(val) {
				this.postDetial = [];

				for(var item in val) {
					this.postDetial[item] = val[item];
				}
			}

		},

	}).$mount('#container');

	adminVm.lv = sessionStorage.getItem('managerLevel');

	//外面绑定点击事件  论坛模板新增和修改
	$('#partEdit').on('mousedown', edit);

	function edit() {

		adminVm.editSection(adminVm.sectionHandler, adminVm.sectionChange[0], adminVm.sectionChange[1]);

	}

	//管理员的新增和修改
	$('#adminEdit').on('mousedown', adminEdit);

	function adminEdit() {

		//传参 已存入vm的改变的值
		adminVm.editAdmin(adminVm.adminHandler, adminVm.adminChange[0], adminVm.adminChange[1])

	}

	//帖子的新增和修改
	$('#postPost').on('mousedown', postEdit);

	function postEdit() {

		adminVm.postHandle(adminVm.postHandler, adminVm.postChange[0], adminVm.postChange[1]);

	}

	//帖子列表切换板块
	$('#sectionOption').on('change', function() {

		changePost('1');

	});

	function changePost(pages) {

		$.ajax({
			type: "post",
			url: nowSever + "/service/postController/queryPostList",
			data: {
				jsonData: JSON.stringify({
					'loginId': sessionStorage.getItem('managerId'),
					'sectionName': $('#sectionOption').val(),
					'pageIndex': pages,
					'pageSize': '7',

				})
			},
			async: true,
			success: function(responseText) {

				console.log(responseText);

				adminVm.updatePostList(responseText.result[1].content);

				console.log(adminVm.post);

			}
		});

	}

	function pagesList(num) {

		// 获取分页展示容器
		var container = document.getElementsByClassName('pagination')[0];

		//*******************************分页***************************************
		//初始化
		container.innerHTML = '';

		// 当前页
		var current = 1; //  1
		// 共有几页
		var total = num;
		// 显示几个(单数)
		var show = 7; // 5:2 7:3
		// 1. 根据显示数量算出正常情况当前页的左右各有几个
		var region = Math.floor(show / 2);
		// 2. 计算出当前界面上的起始值
		var begin = current - region; // 可能小于 1
		begin = begin < 1 ? 1 : begin;
		var end = begin + show; // end必须小于total
		if(end > total) {
			end = total + 1;
			begin = end - show;
			begin = begin < 1 ? 1 : begin;
		}

		// 先append上一页
		var prevElement = document.createElement('li');
		prevElement.innerHTML = '<a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>';
		if(current == 1) {
			prevElement.classList.add('disabled');
		}
		container.appendChild(prevElement);
		for(var i = begin; i < end; i++) {
			var liElement = document.createElement('li');
			liElement.innerHTML = '<a href="#">' + i + '</a>';
			if(i == current) {
				// 此时是当前页
				liElement.classList.add('active');
			}
			container.appendChild(liElement);
		}
		var nextElement = document.createElement('li');
		nextElement.innerHTML = '<a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>';
		if(current == total) {
			nextElement.classList.add('disabled');
		}
		container.appendChild(nextElement);

	}

	// *****************给页数添加事件******************
	$('.pagination li').not(':last').not(':first').on('mousedown', changePage);

	$('.pagination li').last().on('mousedown', nextPage);

	$('.pagination li').first().on('mousedown', prevPage);

	function changePage() {

		current = $(this).text();

		if(current == 1) {
			prevElement.classList.add('disabled');
		} else {
			prevElement.classList.remove('disabled');
		}

		if(current == total) {
			nextElement.classList.add('disabled');
		} else {
			nextElement.classList.remove('disabled');
		}

		$(this).addClass('active').siblings().removeClass('active');

	}

	function nextPage() {
		//判断边界
		current += 1;

		current = current >= total ? total : current;

		pageActive($('.pagination li'), current);

	}

	function prevPage() {

		current -= 1;

		current = current <= 1 ? 1 : current;

		pageActive($('.pagination li'), current);

	}

	function pageActive(collection, index) {
		if(index == 1) {
			prevElement.classList.add('disabled');
		} else {
			prevElement.classList.remove('disabled');
		}

		if(index == total) {
			nextElement.classList.add('disabled');
		} else {
			nextElement.classList.remove('disabled');
		}

		collection.eq(index).addClass('active').siblings().removeClass('active');
	}

	$('#adminLevel').on('change', function() {

		if($('#adminLevel').val() == '3') {
			$(this).next().css({

				display: 'block'

			}).next().css({
				display: 'block'
			})
		} else {
			$(this).next().css({
				display: 'none'
			}).next().css({
				display: 'none'
			})
		}

	})

})