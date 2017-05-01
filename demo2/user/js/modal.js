$(function(){
	var video = videoModal.getElementsByTagName('video')[0];
	
	$('#video_close').on('click',closeVideo);

	function closeVideo(){
		video.pause();
	}
})

