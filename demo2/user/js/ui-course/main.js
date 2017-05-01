//setTimeout(stopWait,2000)
//function stopWait(){
var wait = document.getElementsByClassName('beginAnamition')[0];
//	wait.style.transition = 'all .5s'

//}

//遍历
$(function() {

	var dataUrl = document.location.href;

	var beginUrl = dataUrl.indexOf('?') + 1;

	var endUrl = dataUrl.lastIndexOf('#') == -1 ? dataUrl.length : dataUrl.lastIndexOf('#');
	//当前课程名 用于从后台获取资料
	var courseName = dataUrl.slice(beginUrl, endUrl);

	var nowSever = '';

	$.ajax({
		type: "get",
		url: "../js/url.json",
		async: true,
		success: function(data) {
			//			console.log(data);
			nowSever = data.localurl;

			$.ajax({
				type: "post",
				url: nowSever + "/service/courseController/queryCourse",
				data: {
					//				courseId: JSON.stringify({
					"courseId": courseName,
					//				})
				},
				async: true,
				success: function(data) {
					wait.style.display = 'none';

					console.log(data);

					var data1 = {
						storage: data,
					}

					var data2 = {
						data: data1,
					}

					var html = template('courseBaseOutline', data2);

					document.getElementById('baseoutline').innerHTML = html;

					var html1 = template('courseIntro', data2);

					document.getElementById('intro').innerHTML = html1;

					var html2 = template('coursePath', data2);

					document.getElementById('coursepath').innerHTML = html2;

					for(var item in data.result.teachers) {
						//						console.log(item);
						console.log(data.result.teachers[item]);
						$('.body-banner-container')[0].innerHTML += '<li><img src="' + data.result.teachers[item].pictureUrl + '"></li>'

						$('.body-banner-intro')[0].innerHTML += '<li><h2 class="ui-h2"><b>'+data.result.teachers[item].teachName+'　　</b>'+data.result.teachers[item].keyWord+'</h2><p>'+data.result.teachers[item].introduction+'</p></li>'
					}

					//教师轮播图啊啊啊啊啊啊啊啊
					//图片容器

					var imgContainer = document.getElementsByClassName('body-banner-container')[0];

					//内容成块叠加
					imgContainer.innerHTML += imgContainer.innerHTML;

					//图片集合
					var imgLi = imgContainer.getElementsByTagName('li');

					//初始化图片样式
					$(imgLi).eq(1).children('img').attr('class', 'middleImg')
						.end().siblings().children('img').attr('class', 'sideImg');

					var introContainer = document.getElementsByClassName('body-banner-intro')[0];

					//内容成块叠加
					introContainer.innerHTML += introContainer.innerHTML;

					//内容集合
					introLi = introContainer.getElementsByTagName('li');

					//初始化内容样式
					$(introLi).eq(1).show().siblings().hide();

					var timer = null;

					timer = setInterval(moveImg, 2000);

					var index = 2

					var left = 1;

					function moveImg() {
						//初始化图片样式
						$(imgLi).eq(index).children('img').css('transition', 'all 1s').attr('class', 'middleImg')
							.end().siblings().children('img').css('transition', 'all 1s').attr('class', 'sideImg');

						//初始化内容样式
						$(introLi).eq(index).fadeIn(1000).siblings().fadeOut(500);

						//初始化容器位置
						$(imgContainer).css({
							transition: 'all 1s',
							left: -220 * left + 'px',
						})

						left++;
						index++;

						if(index > 5) {
							//还原位置 还原数据
							$(imgContainer).css({
								transition: 'none',
								left: '0',
							})
							index = 2;
							left = 1;
							$(imgLi).eq(1).children('img').css('transition', 'none').attr('class', 'middleImg')
								.end().siblings().children('img').attr('class', 'sideImg');
							$(introLi).eq(1).show().siblings().hide();
						}
					}

					//鼠标悬停 停止播放 离开继续
					$(imgLi).each(function(i) {
						$(this).on('mouseover', function() {
							clearInterval(timer);
						}).on('mouseout', function() {
							timer = setInterval(moveImg, 2000);
						})
					})

//					//按左按右
//					$('#moveRight').on('click', function() {
//						clearInterval(timer);
//
//						index -= 2;
//						left -= 2;
//
//						$(imgLi).eq(index).children('img').css('transition', 'all 1s').attr('class', 'middleImg')
//							.end().siblings().children('img').css('transition', 'all 1s').attr('class', 'sideImg');
//
//						//初始化内容样式
//						$(introLi).eq(index).fadeIn(1000).siblings().fadeOut(500);
//
//						//初始化容器位置
//						$(imgContainer).css({
//							transition: 'all 1s',
//							left: -220 * left + 'px',
//						})
//
//					});
//
//					$('#moveLeft').on('click', function() {
//						clearInterval(timer);
//
//						$(imgLi).eq(index).children('img').css('transition', 'all 1s').attr('class', 'middleImg')
//							.end().siblings().children('img').css('transition', 'all 1s').attr('class', 'sideImg');
//
//						//初始化内容样式
//						$(introLi).eq(index).fadeIn(1000).siblings().fadeOut(500);
//
//						//初始化容器位置
//						$(imgContainer).css({
//							transition: 'all 1s',
//							left: -220 * left + 'px',
//						})
//
//						index++;
//						left++;
//
//						if(index > 5) {
//							//还原位置 还原数据
//							$(imgContainer).css({
//								transition: 'none',
//								left: '0',
//							})
//							index = 2;
//							left = 1;
//							$(imgLi).eq(1).children('img').css('transition', 'none').attr('class', 'middleImg')
//								.end().siblings().children('img').attr('class', 'sideImg');
//							$(introLi).eq(1).show().siblings().hide();
//						}
//
//						timer = setInterval(moveImg, 2000);
//
//					})

				}
			});

		}
	});

	var playVideo = document.getElementById('playVideo');

	var playServeVideo = document.getElementById('playServeVideo');

	var playSelectVideo = document.getElementById('playSelectVideo');

	var videoModal = document.getElementById('videoModal');

	var video = videoModal.getElementsByTagName('video')[0];

	eventHandle.addHandler(playVideo, 'click', play);
	eventHandle.addHandler(playServeVideo, 'click', play);
	eventHandle.addHandler(playSelectVideo, 'click', play);

	function play() {

		switch(this.id) {

			case 'playVideo':
				video.firstElementChild.setAttribute('src', '../video/ksrsnew.mp4');

				break;

			case 'playServeVideo':
				video.firstElementChild.setAttribute('src', '../video/jyhznew.mp4');
				break;

			case 'playSelectVideo':
				video.firstElementChild.setAttribute('src', '../video/jpjsftnew.mp4');
				break;

		}

		video.load();
		video.play();

	}

	//尾部轮播图
	var imgWrap = document.getElementsByClassName('foot-banner-content')[0];
	//
	var imgLi = imgWrap.getElementsByTagName('li');

	var imgNum = document.getElementsByClassName('foot-banner-num')[0];

	var imgNumLi = imgNum.getElementsByTagName('li');

	////容器总宽度
	var imgWrapWidth = imgWrap.style.width = imgLi.length * imgLi[0].offsetWidth + 'px';

	var timer = null;
	//步长
	var speed = parseInt($(imgLi).eq(0).width());

	var index = 0;
	//图片容器总宽度
	var target = (imgNumLi.length) * parseInt(getStyle(imgLi[1], 'width'));

	timer = setInterval(footBanner, 2000);

	function footBanner() {

		$(imgNumLi).eq(index).css('background', '#fff').siblings().css('background', 'transparent');

		$(imgWrap).animate({

			left: index * (-speed) + 'px',

		})

		index++;

		if(index > imgLi.length - 1) {

			$(imgNumLi).eq(0).css('background', '#fff').siblings().css('background', 'transparent');

			index = 0;
		}

		if(parseInt($(imgWrap).css('left')) <= -target) {

			$(imgWrap).stop().css('left', '0');
		}

	}

	$(imgNumLi).on('click', change);

	function change() {

		clearInterval(timer);

		index = $(this).attr('data-num');

		$(this).css('background', '#fff').siblings().css('background', 'transparent');

		$(imgWrap).animate({

			left: index * (-speed) + 'px',

		})

		timer = setInterval(footBanner, 2000);

	}

	$('.foot-banner li').on('mouseover', stopImg);

	$('.foot-banner li').on('mouseleave', rollImg);

	function stopImg() {

		index = $(this).attr('data-num');

		clearInterval(timer);

	}

	function rollImg() {

		clearInterval(timer);

		timer = setInterval(footBanner, 2000);

	}

	//渐现特效  600的时候

	$('.ui-process li').css('opacity', '0');

	$('.path>li').css('opacity', '0');

	$('.choice>li').css('opacity', '0');

	window.onscroll = function() {

		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

		if(scrollTop >= 500) {
			$('.ui-process li').eq(0).animate({
				opacity: '1',
			}, 800, function() {
				$('.ui-process li').eq(1).animate({
					opacity: '1',
				}, 800, function() {
					$('.ui-process li').eq(2).animate({
						opacity: '1'
					}, 800, function() {
						$('.ui-process li').eq(3).animate({
							opacity: '1'
						}, 800)
					})
				})
			})
		}

		if(scrollTop >= 2600) {

			$('.path li').eq(0).animate({
				opacity: '1',
			}, 800, function() {
				$('.path li').eq(1).animate({
					opacity: '1',
				}, 800, function() {
					$('.path li').eq(2).animate({
						opacity: '1',
					}, 800, function() {
						$('.path li').eq(3).animate({
							opacity: '1',
						}, 800, function() {
							$('.path li').eq(4).animate({
								opacity: '1'
							}, 800);
						});
					});
				});
			});
		}

		if(scrollTop > 3400) {
			$('.choice li').eq(0).animate({

				opacity: '1',

			}, 800, function() {

				$('.choice li').eq(1).animate({

					opacity: '1',

				}, 800, function() {

					$('.choice li').eq(2).animate({

						opacity: '1',

					}, 800, function() {

						$('.choice li').eq(3).animate({

							opacity: '1',

						}, 800, function() {

							$('.choice li').eq(4).animate({

								opacity: '1',

							}, 800);
						});
					});
				});
			});
		}

		//吸顶导航出现
		if(scrollTop >= 800) {

			$('#top-nav').slideDown();

		} else {
			$('#top-nav').slideUp();
		}

	}

	/***********************************导航选项卡***************************************/
	$('#goIntro,#topGoIntro').on('click', function() {

		goPage('#ui-intro', '#ui-content');

		changeAttrStyle('#goIntro,#topGoIntro', 'borderBottom', '3px solid #00d0b0', 'transparent', true);

	});

	$('#goContent,#topGoContent').on('click', function() {

		goPage('#ui-content', '#ui-intro');

		changeAttrStyle('#goContent,#topGoContent', 'borderBottom', '3px solid #00d0b0', 'transparent', true);

	})

})