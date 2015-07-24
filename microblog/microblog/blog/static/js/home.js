$(function () {
	//home.html
	$('.userinfolink').live('mouseover', function(){
		if($(this).data('uid')!=undefined)
			showuserpanel($(this),$(this).data('uid'));
		else if($(this).parents('.comment').length>0)
			showuserpanel($(this),'comment');
		else if($(this).parents('.media').length>0)
			showuserpanel($(this),'media');
		});
	$('.userinfolink').live('mouseout', function(){hideuserpanel($(this))});
	$('.userpanel').live('mouseover', function(){$(this).show()});
	$('.userpanel').live('mouseout', function(){$(this).hide()});
	$('.media').live('hover',function(){
		_obj=$(this).parents('.media');
		if(_obj.length>0)
			_obj.find('.media .W_func_share .del_btn').toggleClass('hide');
		else{
			$(this).find('.W_func_share .del_btn:last').toggleClass('hide');
		}
		});	
	$('.message').live('hover',function(){$(this).find('.del_btn').toggleClass('hide');});
	$('.records li').live('hover',function(){$(this).find('.del_btn').toggleClass('hide');});
	$('.comment').live('hover',function(){	$(this).find('.W_func_comment .del_btn').toggleClass('hide'); });
	$('.upbtn').live('mouseover',function(){dingshare(this,'get')});	
	$('.upbtn').live('mouseout',function(){$('.up_list').fadeOut()});
	$('.up_list').live('mouseover',function(){$(this).stop(true,false);$(this).show()});
	$('.up_list').live('mouseout',function(){$(this).fadeOut()});	
	   
	$('#Share_Poster_Container').bind('blur focus keydown keypress keyup',function(){countLetsShare(this)});
	$('#zhuan-text').bind('blur focus keydown keypress keyup',function(){countLetsZhuan(this)});
	$('.comment-text , .reply-comment-text').live('blur focus keydown keypress keyup',function(){countLetsComment(this)});
	$('#sign_panel_input').live('blur focus keydown keypress keyup',function(){countLetsMessage(this,$('#sign_btn'))});
	$('.kind-rec .label span').live('mouseover',function(){showPreviewImg(this)});
	$('.kind-rec .label span').live('mouseout',function(){hidePreviewImg()});
	$('.tab-class-btn a').bind('click',function(){$(this).parent().find('a').removeClass('select');$(this).addClass('select');});
	$('.tab-type a').bind('click',function(){$(this).parent().find('a').removeClass();$(this).addClass('btn btn-warning');});
	$('#QD-button').click(function(){
		_left=$('.QD-rec').offset().left-$('.QD-dialog').outerWidth()+$('.QD-rec').outerWidth();
		_top=$('.QD-rec').offset().top+$('.QD-rec').outerHeight();
		$('.QD-dialog').css({'left':_left+'px','top':_top+'px'}).fadeIn(function(){
			$('.main_blog').bind('click',function(){$('.QD-dialog,.emotpanel').hide();$('.main_blog,.QD-dialog').unbind('click');})
			});		
		});
	$('.QD-dialog-btn-close').click(function(){$('.QD-dialog,.emotpanel').hide();$('.main_blog,.QD-dialog').unbind('click');});
	$('#signlistbtn').toggle(function() {
		$('.signs').stop().animate({'left':'15px'});
		$(this).html('<i class="icon-chevron-right icon-white"></i> 返回签到');
	}, function() {
		$('.signs').stop().animate({'left':'410px'});
		$(this).html('<i class="icon-chevron-left icon-white"></i> 我的签到');
	});
	
	
	//提交喜分享
	$('#Post_Share').live('click',function(){
		var _text=$('#Share_Poster_Container').val();
		var _image='';
		var _video=$('.label-video').data('url');
		var _transmit='';
		var _type=$('.Share_Container input[type=radio]:checked').val();
		var syncWeibo=false;  //新浪微博同步开关
		var syncQQ=false;	//腾讯微博同步开关
		if($('.icon_weibo').find('.active').length>0)
			syncWeibo=true;
		if($('.icon_tt').find('.active').length>0)
			syncQQ=true;
		imgLabel=$('.label-image');
		for(i=0; i<imgLabel.length; i++){
			if(i==imgLabel.length-1)
			_image+=imgLabel.eq(i).data('url');
			else
			_image+=imgLabel.eq(i).data('url')+'||';
			}
		saveShare(_text,_image,_video,_transmit,_type,syncWeibo,syncQQ);	
		});
	//转发喜分享
	$('#zhuan-btn').live('click',function(){
		var _text=$('#zhuan-text').val();
		var _image='';
		var _video='';
		var _transmit=$('#zhuanShare').data('info').zhuan_id;
		var _share_id=$('#zhuanShare').data('info').share_id;
		var _type=$('#zhuanShare').data('info').type;	
		var tar=$('#zhuanShare').data('info').tar;
		sharecount=tar.parents('.media:first').data('info').sharecount;
		sharecount++;
		tar.parents('.media:first').data('info').sharecount=sharecount;
		tar.text('转发('+sharecount+')');
		if (_transmit==_share_id)
		_obj=tar.parents('.W_func_share:first');
		else
		_obj=tar.parents('.media:last').find('.W_func_share:last');
		saveShare(_text,_image,_video,_transmit,_type);	
		$('#zhuanShare').modal('hide')
		if($('#zhuanShare input[type=checkbox]:checked').length>0)
			saveComment(_text,_share_id,_obj);
		$('#zhuanShare input[type=checkbox]').prop('checked',false);
		//scroll(0,0);
		});
	//提交评论
	$('.comment-btn').live('click',function(){
		var _tar=$(this).parents('.comment-rec:first');
		var _text=_tar.find('.comment-text').val();		
		var _shareid=_tar.data('info').shareid;
		var _obj=$(this).parents('.W_comment:first').prev();
		saveComment(_text,_shareid,_obj);
		if(_tar.find('.comment-chkbox input[type=checkbox]:checked').length>0){
			_text+=' ';
			_image='';
			_video='';
			_transmit=_shareid;
			_type=_tar.data('info').type;
			setTimeout(function(){saveShare(_text,_image,_video,_transmit,_type);}, 1000);
			}
		_tar.find('.comment-chkbox input[type=checkbox]').prop('checked',false);
		_tar.find('.comment-text').val('');	
		});
	//提交回复
	$('.reply-comment-btn').live('click',function(){
		var _tar=$(this).parents('.reply-comment-rec:first');
		var _text=_tar.find('.reply-comment-text').val();		
		var _shareid=_tar.data('info').shareid;
		var _obj=$(this).parents('.W_comment:first').prev();
		saveComment(_text,_shareid,_obj);
		if(_tar.find('.reply-comment-chkbox input[type=checkbox]:checked').length>0){
			_text+=' ';
			_image='';
			_video='';
			_transmit=_shareid;
			_type=_tar.data('info').type;
			setTimeout(function(){saveShare(_text,_image,_video,_transmit,_type);}, 1000);
			}
		_tar.remove();
		});
		
	//自动下拉参数及函数动作
	$(window).scroll(function(){
		var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
		var winHeight= $(window).height();
		var dbHiht = $("body").height();          //页面(约等于窗体)高度/单位px
		var main = $(".W_content");                         //主体元素
		if((srollPos + winHeight) >= (dbHiht-range) && loadNum != maxnum){
			showList(listData,perLoad);
			loadNum++;
		}
		//回到顶部按钮
		if($(this).scrollTop() >= $(window).height()*2) {
			$('#scrollTop').fadeIn(); 
		} else {
			$('#scrollTop').fadeOut();
		}
	});	
	
//jquery 定义结尾标记	
})
