// JavaScript Document
$(function (){	
	$('.photos-list img').live('click',function(){
		$(this).toggleClass('middle-photo');
		$(this).parent().find('a').toggleClass('unvisible');
		});	
	$('#message_fu_input,#message_input').autoTextarea({
		maxHeight:1000 //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
	});
	$('#message_fu_input').bind('blur focus keydown keypress keyup',function(){countLetsMessage(this,$('#message_fu_btn'))});
	$('#message_input').bind('blur focus keydown keypress keyup',function(){countLetsMessage(this,$('#message_btn'))});
	var loadPage=request('from','profile');
	$('.other_nav .active').removeClass('active').find('.select').removeClass('select');
	$('.other_nav .'+loadPage).parent().addClass('select').parents('li').addClass('active');
	var loadblock=request('tag','1');
	$('.tab-class-gray a').removeClass('select');
	$('.tab-class-gray').find('.tag'+loadblock).addClass('select');	
	$('.imgholder').mouseenter(function(){$(this).find('.like_mk').css('visibility','visible')});
	$('.imgholder').mouseleave(function(){$(this).find('.like_mk').css('visibility','hidden')});
	

//jquery 定义结尾标记	
})

