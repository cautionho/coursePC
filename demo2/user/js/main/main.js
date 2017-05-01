$(function() {
	var wait = document.getElementsByClassName('beginAnamition')[0];

	wait.style.display = 'block';

	var nowSever = '';

	//论坛vm层
	var forumVm = new Vue({

		data: {

			sections: [],

		},

		methods: {

			getSection: function() {

				var that = this;

				$.ajax({
					type: "post",
					url: nowSever + "/service/sectionController/querySectionList",
					data: '',
					async: true,
					success: function(data) {
						console.log(data);

						if(data.errorCode == '200') {

							that.sections= [];
							that.sections.push(data.result[0]);
							that.sections.push(data.result[1]);

							console.log(that.sections);

						}
					}
				});
			}
		}

	}).$mount('#forum');

	$.ajax({
		type: "get",
		url: "../js/url.json",
		async: true,
		success: function(data) {
			nowSever = data.localurl;
			console.log(nowSever);

			$.ajax({
				type: "post",
				url: nowSever + "/service/courseController/queryCourseList",
				async: true,
				success: function(data) {

					var nav = document.getElementById('nav');

					wait.style.display = 'none';

					console.log(data);

					for(var item in data.result.courseName) {
						nav.innerHTML += '<ul class="nav-stacked"><li class="navbar-header">' + data.result.courseName[item] + '</li></ul>';

						for(var list in data.result.coursesArray[item]) {

							var ulList = document.getElementsByClassName('nav-stacked');

							switch(item) {
								case '0':
									ulList[item].innerHTML += '<li><a href="course.html?' + data.result.coursesArray[item][list].courseId + '">' + data.result.coursesArray[item][list].courseName + '</a></li>'
									break;

								case '1':
									ulList[item].innerHTML += '<li><a href="UI-course.html?' + data.result.coursesArray[item][list].courseId + '">' + data.result.coursesArray[item][list].courseName + '</a></li>'
									break;

								case '2':
									ulList[item].innerHTML += '<li><a href="course.html?' + data.result.coursesArray[item][list].courseId + '">' + data.result.coursesArray[item][list].courseName + '</a></li>'
									break;

								default:
									ulList[item].innerHTML += '<li><a href="course.html?' + data.result.coursesArray[item][list].courseId + '">' + data.result.coursesArray[item][list].courseName + '</a></li>'
									break;
							}
						}

					}

					forumVm.getSection();

				}
			});
		}
	});

})

//导航
eventHandle.addHandler(window, 'scroll', navScroll);

function navScroll() {

	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

	//获取导航
	var nav = document.getElementById('nav');

	nav.style.transition = 'all .5s';

	if(scrollTop > 50) {

		nav.style.top = 0 + 'px';
		nav.style.height = '100%';

	} else {
		nav.style.top = '74px';
	}

}

//主页轮播图
/*

封装!!!!!!!

*/
//获取轮播图下面的小圈
$(function() {
	var bannerNum = document.getElementsByClassName('banner-num')[0].getElementsByTagName('li');

	//小圈的定时器
	var numTimer = null;

	var num = 0;

	for(var i = 0; i < bannerNum.length; i++) {

		eventHandle.addHandler(bannerNum[i], 'mouseover', changeNum);

	}

	function changeNum() {

		clearInterval(numTimer);

		var index = $(this).attr('data-num');

		num = index;

		$(this).css({
			width: '20px',
			background: '#5ECFBA'
		}).siblings().css({
			width: '10px',
			background: 'rgba(255,255,255,.8)'
		});

		$('.img-wrap>img').eq(index).fadeIn(1000).siblings('img').fadeOut();

		numTimer = setInterval(changeImg, 2000);
	}

	numTimer = setInterval(changeImg, 2000);

	function changeImg() {

		$('.banner-num>li').eq(num).css({

			width: '20px',

			background: '#5ECFBA'

		}).siblings().css({

			width: '10px',

			background: 'rgba(255,255,255,.8)'

		})

		$('.img-wrap>img').eq(num).fadeIn(1000).siblings('img').fadeOut();

		num++;

		if(num > 4) {

			num = 0;

		}
	}

	$('.img-wrap img').on('mouseover', stopImg);

	$('.img-wrap img').on('mouseleave', rollImg);

	function stopImg() {

		num = $(this).attr('data-num');

		clearInterval(numTimer);

	}

	function rollImg() {

		numTimer = setInterval(changeImg, 2000);

	}

})

//金牌讲师换页按钮
$(function() {

	$('.teacher').css('width', (($('.teacher>li').eq(0).width() + 40) * $('.teacher li').length) + 'px');

	$('.teacher-name').css('width', (($('.teacher-name>li').eq(0).width() + 40) * $('.teacher li').length) + 'px');

	$('#moveR').on('click', moveRight);

	$('#moveL').on('click', moveLeft);

	$('#moveR').css('background', '#5ECFBA');

	function moveRight() {

		$(this).css('background', '#5ECFBA').siblings().css('background', '#ccc');

		$('.teacher').animate({
			left: '0px'
		});

		$('.teacher-name').animate({
			left: '0px'
		});

	}

	function moveLeft() {

		$(this).css('background', '#5ECFBA').siblings().css('background', '#ccc');

		$('.teacher').animate({
			left: -$('.teacher').width() / 2 - 10 + 'px'
		});

		$('.teacher-name').animate({
			left: -$('.teacher').width() / 2 - 10 + 'px'
		})
	}

});

//hover图片的时候下面的名字消失  (闭包)
var teacher = document.getElementsByClassName('teacher')[0];

var t = teacher.getElementsByTagName('li');

var teacherName = document.getElementsByClassName('teacher-name')[0];

var tName = teacherName.getElementsByTagName('li');

for(var i = 0; i < t.length; i++) {

	t[i].firstElementChild.onmouseover = (function(index) {

		return function hideName() {

			tName[index].firstElementChild.style.opacity = '0';
		}

	})(i);

	t[i].firstElementChild.onmouseout = (function(index) {

		return function showName() {

			tName[index].firstElementChild.style.opacity = '1';
		}

	})(i);
}

//干货社区hover图片旋转效果
$(function() {

	$('.forum>li').on('mouseover', imgRotate);

	$('.forum>li').on('mouseout', recoverRotate);

	function imgRotate() {

		$(this).children().eq(1).children().eq(0).css({
			transition: 'all 1s',
			transform: 'rotateY(-180deg)',
		});

	}

	function recoverRotate() {
		$(this).children().eq(1).children().eq(0).css({
			transition: 'all 1s',
			transform: 'rotateY(0deg)',
		});
	}

	//快速认识麦子学院 点击打开视频
	$('#video0').on('click', openVideo);
	$('#video1').on('click', openVideo);
	$('#video2').on('click', openVideo);
	$('#video3').on('click', openVideo);

	var video = videoModal.getElementsByTagName('video')[0];

	var $source = $('#videoModal>div>video>source');

	function openVideo() {

		switch(this.id) {

			case 'video0':
				changeVideo($source, '../video/ksrsnew.mp4');
				video.load();
				video.play();
				break;

			case 'video1':
				changeVideo($source, '../video/jyhznew.mp4');
				video.load();
				video.play();
				break;

			case 'video2':
				changeVideo($source, '../video/jpjsftnew.mp4');
				video.load();
				video.play();
				break;

			case 'video3':
				changeVideo($source, '../video/xyft1new.mp4');
				video.load();
				video.play();
				break;

		}
	}

});