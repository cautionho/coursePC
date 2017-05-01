var dataUrl = document.location.href;

var beginUrl = dataUrl.indexOf('?') + 1;

var endUrl = dataUrl.lastIndexOf('#') == -1 ? dataUrl.length : dataUrl.lastIndexOf('#');

//当前课程名 用于从后台获取资料
var courseName = dataUrl.slice(beginUrl, endUrl);

var container = document.getElementById('ios-point-img-container');

var imgLi = container.children;

var nowSever = '';

var wait = document.getElementsByClassName('beginAnamition')[0];

wait.style.display = 'block';
$(function() {
	$.ajax({
		type: "get",
		url: "../js/url.json",
		async: true,
		success: function(data) {
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
					console.log(data);

					wait.style.display = 'none';

					document.title = data.result.courseName + ' - 莘 + 学院';

					var data1 = {
						storage: data.result,
					}

					var data2 = {
						data: data1,
					}

					console.log(data2);

					var html1 = template('coursename', data2);

					document.getElementById('coursetitle').innerHTML = html1;

					var html2 = template('baseOutline', data2);

					document.getElementById('point').innerHTML = html2;

					var html3 = template('courseTeacher', data2);

					document.getElementById('demo').innerHTML = html3;

					$('.ios-teacher-num>li').on('click', changeImg);

					//滚动图片的遍历
					for(var item in data.result.outline.lessionPeriods) {
						container.innerHTML += '<li><div class="img-details"><h5>项目实战</h5><h4>' + data.result.outline.lessionPeriods[item].lessionKey + '</h4><ul></ul></div><div class="img-details"><h5>项目实战</h5><h4>' + data.result.outline.lessionPeriods[item].lessionKey + '</h4><p>' + data.result.outline.lessionPeriods[item].introduction + '</p></div></li>';

						for(var index in data.result.outline.lessionPeriods[item].lessionPoint) {

							imgLi[item].firstElementChild.querySelector('ul').innerHTML += '<li><i></i>' + data.result.outline.lessionPeriods[item].lessionPoint[index] + '</li>'

						}
					}
					container.style.width = (parseInt(getStyle(imgLi[0], 'width')) + 20) * imgLi.length + 'px';

				}
			});
		}
	});



	//***********************课程大纲图片滚动条效果****************************

	var currentX = 0;

	var mouseX = 0;

	var mouseClientX = 0;

	var barX = 0;

	$('#scrollbar').mousedown(function(e) {

		var ev = window.event || e;

		$(this).css('background', '#BBB');

		//			//鼠标距离滑块的左边距
		mouseX = ev.offsetX;
		//
		//			//滚动条框距离可视区的左边距
		barX = $('.ios-point-bar').offset().left;

		$(this).on('mousemove', domove);

		$(window).on('mousemove', domove);

	})

	function domove(e) {

		var ev = e || window.event;

		//步长
		//		var step = ( $('#ios-point-img-container').width() / $('#scrollbar').width());

		var step = ($('#ios-point-img-container').width() / $('#scrollbar').width()) / 3.65;

		//鼠标距离可视区的左边距
		mouseClientX = ev.clientX;

		//滚动条当前位置
		currentX = mouseClientX - mouseX - barX;

		target = $('.ios-point-bar').width() - $('#scrollbar').width();

		if(currentX < 0) {

			$('#scrollbar').css('left', 0);

			$('#ios-point-img-container').css('left', 0);

		} else if(Math.floor(currentX) > target) {

			$('#scrollbar').css('left', target + 'px');

			$('#ios-point-img-container').css('left', -target * step + 'px');

		} else {

			$('#scrollbar').css('left', currentX + 'px');

			$('#ios-point-img-container').css('left', -currentX * step + 'px');

		}

	}

	$('#scrollbar')

		.mouseleave(function() {

			$('#scrollbar').off('mousemove', domove);

		})
		.mouseup(function() {

			$(window).off('mousemove', domove);

			$('#scrollbar').off('mousemove', domove);

			$('#scrollbar').css('background', '#ccc');

		})

	$(window).mouseup(function() {

		$(window).off('mousemove', domove);

		$('#scrollbar').off('mousemove', domove);

		$('#scrollbar').css('background', '#ccc');

	})

	//***********************课程老师轮播********************************

	$('.ios-teacher-num li').eq(0).children('div').fadeOut();

	var index = 0;

	function changeImg() {

		index = $(this).attr('data-num');

		$(this).children('img').css({

				width: '90px',

				height: '90px',

			}).end().children('div').fadeOut()

			.end().siblings().children('img').css({

				width: '70px',

				height: '70px',

			}).end().children('div').fadeIn();

		if(index == 1) {

			$('.ios-teacher-img li').eq(index).css({

				transform: 'translateY(0px)'
			})
		} else {

			$('.ios-teacher-img li').eq(index).siblings().css({

				transform: 'translateY(450px)'
			})
		}

	}

	//学生作品轮播图

	//初始化第一张图片
	$('.sliceImg li').each(function(i) {

		$(this).css({

			background: 'url(../img/iOS-img/20160707172455_55153.png) no-repeat 0 0',

			backgroundPositionY: -i * 42 + 'px',

		})

	});

	//定时器
	var stuWorkTimer = null;

	var index = 0;

	var imgurl = '';

	//切换图片
	stuWorkTimer = setInterval(stuWorkChange, 3000);

	function stuWorkChange() {

		if($('.sliceImg li').animated) {

			return;

		} else {

			imgurl = $('.imgWarp li').eq(index).children('img').attr('src');

			$('.sliceImg li').each(function(i) {

				$(this).css({

					background: 'url(' + imgurl + ') no-repeat 0 0',

					backgroundPositionY: -i * 42 + 'px',

				})
			})

			if(index == $('.imgWarp li').length - 1) {

				imgurl = $('.imgWarp li').eq(0).children('img').attr('src');

				$('.imgWarp li').eq(0).show(500).siblings().hide(500);

				$('.stuWorkNum li').eq(0).css({

					background: 'orange',

					width: '20px',

				}).siblings().css({

					background: 'rgba(0,0,0,.1)',

					width: '10px',

				});

			} else {

				imgurl = $('.imgWarp li').eq(index + 1).children('img').attr('src');

				$('.imgWarp li').eq(index + 1).show(500).siblings().hide(500);

				$('.stuWorkNum li').eq(index + 1).css({

					background: 'orange',

					width: '20px',

				}).siblings().css({

					background: 'rgba(0,0,0,.1)',

					width: '10px',

				});
			}

			//先考虑本身图片切换
			//		$('.imgWarp li').eq(index+1).show().siblings().hide();

			$('.sliceImg li:odd').animate({

				left: '-800px',

				opacity: '0'

			}, 2000, function() {

				$('.sliceImg li:odd').css({

					backgroundImage: 'url(' + imgurl + ')',

					opacity: '1',

				}).css({

					left: '0',
				})

			}).delay(1000)

			$('.sliceImg li:even').animate({

				right: '-800px',

				opacity: '0'

			}, 2000, function() {

				$('.sliceImg li:even').css({

					backgroundImage: 'url(' + imgurl + ')',

					opacity: '1',

				}).css({

					right: '0',
				})

			}).delay(1000)

			index++;

			if(index > $('.imgWarp li').length - 1) {

				index = 0;

			}

		}

	}

	var preNum = '';

	$('.stuWorkNum>li').on('click', checkedImg);

	function checkedImg() {

		clearInterval(stuWorkTimer);

		if($('.sliceImg li').animated) {

			$('.sliceImg li').stop();

		} else {

			$(this).css({

				background: 'orange',

				width: '20px',

			}).siblings().css({

				background: 'rgba(0,0,0,.1)',

				width: '10px',

			});

			preNum += index + $(this).attr('data-num');

			preNum = preNum.slice(-2, -1);

			index = $(this).attr('data-num');

			//显示上一张按过的照片
			imgurl = $('.imgWarp li').eq(index).children('img').attr('src');

			$('.imgWarp li').eq(index).show(500).siblings().hide(500);

			$('.sliceImg li:odd').animate({

				left: '-800px',

				opacity: '0'

			}, 2000, function() {

				$('.sliceImg li:odd').css({

					backgroundImage: 'url(' + imgurl + ')',

					opacity: '1',

				}).css({

					left: '0',
				})

			})

			$('.sliceImg li:even').animate({

				right: '-800px',

				opacity: '0'

			}, 2000, function() {

				$('.sliceImg li:even').css({

					backgroundImage: 'url(' + imgurl + ')',

					opacity: '1',

				}).css({

					right: '0',
				})

			})

			stuWorkTimer = setInterval(stuWorkChange, 3000);
		}

	}

	$('.imgWarp,.sliceImg').mouseover(function() {

		clearInterval(stuWorkTimer);

	}).mouseleave(function() {

		stuWorkTimer = setInterval(stuWorkChange, 3000);

	})

	//**********************学习************************************
	$('#select-one').on('click', function() {

			clickShow('.getWhat', '.whatCareer', 'fadeIn');

			$(this).css('background', '#fff').siblings().css('background', 'transparent');
		})
		.next().on('click', function() {

			clickShow('.whatCareer', '.getWhat', 'fadeIn');

			$(this).css('background', '#fff').siblings().css('background', 'transparent');

		});

	//导航选项卡功能
	$('#go-ios-intro').on('click', function() {

		goPage('#ios-intro', '#ios-active');

		changeAttrStyle('#go-ios-intro', 'borderBottom', '3px solid #115f9d', 'transparent', true);
	})

	$('#go-ios-active').on('click', function() {

		goPage('#ios-active', '#ios-intro');

		changeAttrStyle('#go-ios-active', 'borderBottom', '3px solid #115f9d', 'transparent', true);
	})
});

function openVideo() {
	var video = document.getElementById('videoModal').getElementsByTagName('video')[0];

	video.load();
	video.play();
}