//回到顶部
$(function(){
	
	$(window).on('scroll',showGoTop);
	
	function showGoTop(){
		
		if($(window).scrollTop() >= 1000){
			$('#goTop').show(500);
		}else{
			$('#goTop').hide(500);
		}
		
	}
	
	var speed = 200;
	
	$('#goTop').on('click',gotoTop);
	
	function gotoTop(){
		
		$(window).scrollTop($(window).scrollTop()-speed);
		
		if($(window).scrollTop() <= 0){
//			clearTimeout(timer);
			return;
		}
		
//		timer = setTimeout(gotoTop,50);
		window.requestAnimationFrame(gotoTop);
		
	}

})
