var GradeArray=[100,300,900,2700,7100,1000000000]; //用户等级划分

//占位替换函数
String.prototype.format = function () {
    if (arguments.length == 0) return this;
    for (var s = this, i = 0; i < arguments.length; i++)
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return s;
};

//自动下拉参数及函数动作
var range = 70;             //距下边界长度/单位px
var maxnum = 3;            //设置加载最多次数
var perLoad=10;			//每次加载的数量
var loadNum = 0;


//最后一次刷新展示分享列表事件
var listUpdateData=new Object();
var showListTime=getLastTime();


//定义全局分享参数:喜分享json数据，分页面，已显示条数
var listData=new Object();
var displayedList=0;
var listPage=1;
var listType='all';
var listClass='';
var listUid=0;

//定义搜索全局变量
var displayedSearch=0;
var searchType='content';
var searchKey='';
var searchPage=1;
var searchUid=0;

//设置全局list POST参数
function getList(dict){
	for(var data in dict){
		if(data=='list')
			listType=dict[data];
		if(data=='class')
			listClass=dict[data];
		if(data=='page')
			listPage=dict[data];
		if(data=='displayed')
			displayedList=dict[data];
		if(data=='uid')
			listUid=dict[data];
	}
	//alert('list='+listType+'; class='+listClass+'; page='+listPage+'; displayed='+displayedList+'; uid='+listUid);
	loadNum=0;
	listData=new Object();
	$('.W_content').html('');
	$('#W_container > .W_loading').find('span').text('正在加载中，请稍候...').end().show();
	$('.search-result,.searchpage').hide();
	$('.listpage-input').val(listPage);
	$('.tab-type,.listpage').show();
	fetchshares(listType,listClass,listPage,listUid);
}

//设置全局search POST参数
function getSearch(dict){
	for(var data in dict){
		if(data=='type')
			searchType=dict[data];
		if(data=='page')
			searchPage=dict[data];
		if(data=='displayed')
			displayedSearch=dict[data];
		if(data=='uid')
			searchUid=dict[data];
	}
	searchKey=$('.search-query').val();
	if(!trim(searchKey,2)){
		showtip('error','请至少输入2位查找的关键词！');
		return;
	}
	loadNum=0;
	listData=new Object();
	$('.W_content').html('');
	$('#W_container > .W_loading').find('span').text('正在加载中，请稍候...').end().show();
	$('.tab-type,.listpage').hide();
	$('.searchpage-input').val(searchPage);
	$('.searchpage').show();
	searchshare(searchType,searchKey,searchPage,searchUid);
}

//保存喜分享
function saveShare(_text,_image,_video,_transmit,_type,_weibo,_qq){
	if(!trim(_text,1)){
		showtip('info','亲，先写点什么再与大家分享吧！');
		return;
	}
	else {
		var pub_content=getCookie('pub_content');
		var pub_count=parseInt(getCookie('pub_count'));
		var pub_time=getCookie('pub_time');
		if(unescape(pub_content)!=null && unescape(pub_content)==_text){
			showtip('error','请不要发表重复内容的喜分享！');
			return;
			}
		// if(pub_time!=null && pub_count!=null && pub_count>=3){
		// 	showtip('error','你发分享的速度过快，请休息10分钟再试！');
		// 	return;
		// 	}
		$.ajax({
			url: "/saveshare/",
			type: "POST",
			data: { text:_text, image:_image, video:_video, transmit:_transmit, type:_type, weibo:_weibo,qq:_qq},
			dataType: 'json',
			timeout: 10000		
			}).done(function(resultData) {
				//alert(resultData);
				//return;
				var $content=shareList(resultData,0,false);
				$content.css({display:'none'});
				showtip('success','成功发表微博！');
				$('#Share_Poster_Container').val('');
				$('.kind-rec').html('');
				uploaderLen=$('.uploadify').length;
				if (uploaderLen>0)
				$('#photofileInput').uploadify('destroy')
				$('.W_content').prepend($content)
				$('.W_content .media:first').slideDown('fast',function(){
					_obj=$content.find('.media-body .popover-content');
					if(_obj.length>0)
						fetchshare(resultData.items[0].transmit,_obj);
					});
				setCookie('pub_content',_text,'h24');		
				if(pub_time==null){
					setCookie('pub_count',1,'h24');
					setCookie('pub_time','Y','s600');
				}
				else {
					setCookie('pub_count',pub_count+1,'h24');
				}
				initShowPhoto();
				});
		}
	}

//保存评论
function saveComment(_text,_shareid,_obj){
	if(!trim(_text,1)){
		showtip('info','亲，先写点什么再发表评论吧！');
		return;
	}
	var pub_content=getCookie('pub_content');
	var pub_count=parseInt(getCookie('pub_count'));
	var pub_time=getCookie('pub_time');
	// if(unescape(pub_content)!=null && unescape(pub_content)==_text){
	// 	showtip('error','请不要发表重复内容的评论！');
	// 	return;
	// 	}
	// if(pub_time!=null && pub_count!=null && pub_count>=5){
	// 	showtip('error','你发评论的速度过快，请休息会再试！');
	// 	return;
	// 	}
	$.ajax({
		url: "/savecomment/",
		type: "POST",
		data: { text:_text, shareid:_shareid},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			//alert(resultData);
			//return;
			if(resultData.data=="Y"){
			var $content=commentlist(resultData,0,{},true);
			$content.css({display:'none'});
			showtip('success','成功发表你的评论！');
			if(_obj.length>0){
			_tar=_obj.next().find('.comment-list:first');
			_tar.prepend($content)
			_tar.find('.comment:first').slideDown('fast');
			_tar_count=_obj.find('a:last');
			commentcount=_obj.parents('.media:first').data('info').commentcount;
			commentcount++;
			_obj.parents('.media:first').data('info').commentcount=commentcount;
			_tar_count.text('评论('+commentcount+')');
			}
			setCookie('pub_content',_text,'h24');
			if(pub_time==null){
				setCookie('pub_count',1,'h24');
				setCookie('pub_time','Y','s60');
			} else 
				setCookie('pub_count',pub_count+1,'h24');
			} else 
				showtip('error','此项操作失效，如有疑问请联系系统管理员！');
			});
		return true;
	}

//获取喜分享列表
function fetchshares(_list,_class,_page,_uid){
	$.ajax({
		url: "/fetchshares/",
		type: "POST",
		data: { list:_list , classid:_class , page:_page , uid:_uid},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			//alert(resultData)
			showListTime=getLastTime(); //更新最后一次获取数据库时间。
			$('.update-shares').hide();
			if(resultData.data=="Y"){
				$('#W_container > .W_loading').hide();
				listData=resultData;
				listData['isSearch']=false;
				showList(resultData,20);
				}
			else 
			$('#W_container > .W_loading span').text('无有效数据');
			});
}

//获取@我喜分享列表
function fetchATshares(isSearch,_page,_nickname,_content,_tag,_list){
	$.ajax({
		url: "/fetchATshares/",
		type: "POST",
		data: { page:_page , nickname:_nickname , content:_content , tag:_tag , list:_list},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData.data=="Y"){
				$('#W_container > .W_loading').hide();
				listData=resultData;
				listData['isSearch']=isSearch;
				showList(resultData,20);
				}
			else 
			$('#W_container > .W_loading span').text('无有效数据');
			if(isSearch){
			$('.search-result').find('strong').text(resultData.resultcount).end().show();
			$('.list-result').hide();
			}
			else{
			$('.list-result').find('span').text(resultData.resultcount).end().show();
			$('.search-result').hide();
			}
			});
}

//获取搜索列表
function searchshare(_type,_key,_page,_uid){
	$.ajax({
		url: "/searchshare/",
		type: "POST",
		data: { searchtype:_type , searchkey:_key , searchpage:_page , searchuid:_uid},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			//alert(resultData)
			if(resultData.data=="Y"){
				$('#W_container > .W_loading').hide();
				listData=resultData;
				listData['isSearch']=true;
				showList(resultData,20);
				}
			else 
			$('#W_container > .W_loading span').text('很遗憾,并没有找到');
			$('.search-result').find('strong').text(resultData.resultcount).end().show();
			});
}


//显示分享列表
function showList(jsonData,num){
	//alert(jsonData.items[0].transmit);
	if(jsonData.items==undefined)
	return;
	if(!listData.isSearch)
		var _displayedList=displayedList;
	else 
		var _displayedList=displayedSearch;
	var maxLength=_displayedList+num;
	if(maxLength>listData.items.length)
	maxLength=listData.items.length;
	for(var i=_displayedList;i<maxLength;i++){
		//alert(jsonData.items[i].transmit);
		$('.W_content').append(shareList(listData,i,false));
		}
	for(var j=_displayedList;j<maxLength;j++){
		_obj=$('.W_content > .media').eq(j).find('.media-body .popover-content');
		if(_obj.length>0)
			fetchshare(listData.items[j].transmit,_obj);
		}
	if(!listData.isSearch)
		displayedList+=num;
	else 
		displayedSearch+=num;
	initShowPhoto();
	}	


//获取单个喜分享
function fetchshare(id,_obj){
	$.ajax({
		url: "/fetchshare/",
		type: "POST",
		data: { id:id},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			//alert(resultData)
			if(resultData.data=="Y"){
				_obj.html(shareList(resultData,0,true));
				blockInitShowPhoto(_obj);
				}
			else {
				_obj.parents('.topic-zhuan').remove();
				}
			});
}

//列表初始化 参数 数据 索引 是否转发
function shareList(jsonData,i,zhuan){
	var listTemplate='';
	if(!zhuan)
	listTemplate+='<div class="media media-sep">';
	else 
	listTemplate+='<div class="media">';
	if(!zhuan){
	listTemplate+='<a class="pull-left userinfolink" href="/{0}/">';
	listTemplate+='<img src="{1}" alt="{2}" width="50" height="50" class="media-object">';
	listTemplate+='</a>';
	}
	listTemplate+='<div class="media-body">';
	if(zhuan)
	listTemplate+='<h6 class="media-heading"><a href="/{0}/">@{3}</a></h6>';
	else
	listTemplate+='<h5 class="media-heading"><a class="userinfolink" href="/{0}/">{3}</a></h5>';
	if(jsonData.items[i].iscream)
	listTemplate+='<i class="W_icon icon_jing pull-left"></i>';
	listTemplate+='{4}';
	listTemplate+='<div class="W_func_share row-fluid font12 muted">';
	listTemplate+='<div class="span2">{5}</div>';
	listTemplate+='<div class="span3">来自<a onclick="getList({\'class\':{6},\'page\':1,\'displayed\':0})" href="javascript:void(0);" >{7}</a>{11}</div>';
	listTemplate+='<div class="span6 pull-right text-right">';
	if(jsonData.staff || jsonData.uid==jsonData.items[i].uid)
	listTemplate+='<i class="del_btn hide"><a onClick="delshare(this)" href="javascript:void(0);">删除</a> |</i> ';
	if(jsonData.staff && jsonData.items[i].iscream)
	listTemplate+='<a data-method="cancel" onClick="jingshare(this)" href="javascript:void(0);">取消精</a> | ';
	else if(jsonData.staff)
	listTemplate+='<a data-method="jia" onClick="jingshare(this)" href="javascript:void(0);">精</a> | ';
	if(jsonData.items[i].isding)
	listTemplate+='<a data-method="cancel" class="upbtn" onClick="dingshare(this,\'click\')" href="javascript:void(0);">取消赞({8})</a> | ';
	else
	listTemplate+='<a data-method="jia" class="upbtn" onClick="dingshare(this,\'click\')" href="javascript:void(0);">赞({8})</a> | ';
	listTemplate+='<a onClick="zhuanshare(this)" href="javascript:void(0);">转发({9})</a> | ';
	listTemplate+='<a onClick="togglecomment(this)" href="javascript:void(0);">评论({10})</a>';
	listTemplate+='</div>';
	listTemplate+='</div>';
	listTemplate+='<div class="W_comment clearfix hide"></div>';
	listTemplate+='</div>';
	listTemplate+='</div>';
	
	var content=listTemplate.format(
	jsonData.items[i].username,
	setGravatar(jsonData.items[i].gravatar,jsonData.items[i].sex,50),
	jsonData.items[i].nickname,
	jsonData.items[i].nickname,
	itemShowTemplate(jsonData.items[i],zhuan),
	getDateDiff(getDateTimeStamp(jsonData.items[i].pubdate)),
	jsonData.items[i].class_id,
	jsonData.items[i].class_name,
	jsonData.items[i].dingcount,
	jsonData.items[i].sharecount,
	jsonData.items[i].commentcount,
	paraFrom(jsonData.items[i].source)
	);
	var $content=$(content);
	$content.data("info",{ id:jsonData.items[i].id, uid:jsonData.items[i].uid,username:jsonData.items[i].username,type:jsonData.items[i].class_name,nickname:jsonData.items[i].nickname,commentcount:jsonData.items[i].commentcount,sharecount:jsonData.items[i].sharecount});
	return $content
}

//分析分享来源
function paraFrom(source){
	if(source!=undefined && source!=""){
		if(source=="android"){
			return '<i class="android" title="来自Android移动客户端"></i>';
			}
		else {
			return '<i class="apple" title="来自Apple移动客户端"></i>';
			}
		}
	else
		return '';
	}
//显示分享文字、图片、视频模板
function itemShowTemplate(data,zhuan){
	var strArray=data.content.split('|||');
	var text=strArray[0];
	var photo=$.trim(strArray[1]);
	var video=$.trim(strArray[2]);
	var template='<div class="topic-text">';
	template+=paraShare(text);
	if(video && !trim(video.split('||')[0],1))
	template+=' <a href="'+video.split('||')[3]+'" target="_blank">视频<i class="W_icon iconvideo"></i></a>';
	else if(video && trim(video.split('||')[0],1))
	template+=' <a href="'+video.split('||')[3]+'" target="_blank">视频：'+video.split('||')[0]+'<i class="W_icon iconvideo"></i></a>';
	template+='</div>';

	if(photo){
		var photos=photo.split('||');
		template+='<div class="topic-photos">';
		template+='<ul class="photos-list clearfix">';
		for(var _p in photos){
			template+='<li><img class="small-photo lazy" alt="小图片" src="/media/images/grey.gif" data-original="/media/upload/images/thumb/'+photos[_p]+'"><a class="W_icon unvisible" href="/media/upload/images/'+photos[_p]+'" title="查看大图" target="_blank"></a></li>';
			}
		template+='</ul></div>';
		}
		
	if(video){		
		var vArray=video.split('||');		
		template+='<div data-video="'+vArray[2]+'" class="topic-video clearfix">';
		template+='<div class="video-btn">';
		if (trim(vArray[1],1))
		template+='<img onclick="showVideoPanel(this)" src="'+vArray[1]+'" />';
		if (trim(vArray[0],1))
		template+='<a onclick="showVideoPanel(this)" href="javascript:void(0);" title="'+vArray[0]+'"></a></div>';
		else
		template+='<a onclick="showVideoPanel(this)" href="javascript:void(0);" title="观看视频"></a></div>';
		template+='<div class="video-panel">';
		template+='<div class="video-close" style=""><a onclick="hideVideoPanel(this)" href="javascript:void(0);" >收起</a></div>';
		template+='<div class="video-obj">';
		template+='</div></div></div>';
		}
		
	if (!zhuan){
	if(data.transmit){
		template+='<div class="topic-zhuan clearfix">';
		template+='<div class="popover bottom zhuan-rec">';
		template+='<div class="arrow"></div>';
		template+='<div class="popover-content clearfix">';
		template+='<div class="W_loading"><span>正在加载中，请稍候...</span></div>';		
		template+='</div></div></div>';		
		}
	}
	return template;
	}

//显示用户名片
function showuserpanel(_obj,_tar){	
	if(_obj.next('.userpanel').length>0)
	_obj.next('.userpanel').show();
	else{
		initcardrec(_obj,_tar);
		if (_tar=='comment' || _tar=='media') 
		_uid=_obj.parents('.'+_tar).data('info').uid;
		else
		_uid=_tar
		$.ajax({
			url: "/usercardinfo/",
			type: "POST",
			data: { uid:_uid},
			dataType: 'json',
			timeout: 10000		
			}).done(function(resultData) {
				setcardtemplate(resultData,_obj);
			});
		
		}
	}

//隐藏用户名片
function hideuserpanel(_obj){
	if(_obj.next().find('.arrow').length>0)
	_obj.next().hide();
	}
	
//初始化名片模板
function initcardrec(_obj,_tar){
	var cardTemplate='<div class="popover top userpanel">';
	cardTemplate+='<div class="arrow"></div>';
	cardTemplate+='<h3 class="popover-title">会员名片</h3>';
	cardTemplate+='<div class="popover-content clearfix">';
	cardTemplate+='<div class="W_loading"><span>正在加载中，请稍候...</span></div>';
	cardTemplate+='</div></div>';
	
	$cardTemplate=$(cardTemplate);
	var _y=_obj.position().top;
	var _x=_obj.position().left;
	if(document.body.clientWidth-_x<340){
	_x=_x-340+50;
	$cardTemplate.find('.arrow').css({'left':'93%'});
	}
	_obj.after($cardTemplate);
	if(_tar=='comment')
	_obj.next().css({'top':(_y-72)+'px','left':_x+'px'});
	else
	_obj.next().css({'top':(_y-75)+'px','left':_x+'px'});	
	_obj.next().show();
	}
	
//格式化户名片模板
function setcardtemplate(jsonData,_obj){
	var cardTemplate='<div class="card clearfix">';
	cardTemplate+='<a class="pull-left" href="/{0}/">';
	cardTemplate+='<img src="{1}" alt="{2}" width="50" height="50">';
	cardTemplate+='</a>';
	cardTemplate+='<div class="cardinfo pull-left">';
	cardTemplate+='<p><a href="/{0}/" target="_blank">{2}</a>{3}</p>';
	cardTemplate+='<p>{4} {5} </p>';
	cardTemplate+='<p><a href="/{0}/?from=follow&tag=1#tab" target="_blank">关注</a><span>{6}</span><span class="muted">|</span><a href="/{0}?from=follow&tag=2#tab" target="_blank">粉丝</a><span>{7}</span><span class="muted">|</span><a href="/{0}/" target="_blank">分享</a><span>{8}</span><span class="muted">|</span><a href="/{0}/?from=album#tab" target="_blank">相册</a><span>{11}</span></p>';
	cardTemplate+='</div>';
	cardTemplate+='</div>';
	cardTemplate+='<div class="cardxinqing"><a class="muted" href="/{0}/?from=record#tab" target="_blank">记录:</a>{9}</div>';
	if(jsonData.login_uid!=jsonData.uid){
	cardTemplate+='<div class="cardfunc row-fluid">';
	cardTemplate+='<div class="span5"><a data-nickname="{2}" onclick="Letter(this)" href="javascript:void(0);">私信</a> <sep>|</sep> <a href="/{0}/?from=message#tab" target="_blank">留言</a>';
	if(jsonData.relation!=2 && jsonData.relation!=3)
	cardTemplate+=' <sep>|</sep> <a class="begfollow" onclick="Follow(this,false,\'beg\')" href="javascript:void(0);">求关注</a>';
	cardTemplate+='</div>';
	cardTemplate+='<div class="span6 pull-right"><span class="btn btn-mini btn-warning pull-right">';	
	if(jsonData.relation==1)
	cardTemplate+='<i class="icon-ok icon-white"></i>已关注 <a class="delfollow" onclick="Follow(this,false,\'del\')" href="javascript:void(0);">取消</a>';
	else if(jsonData.relation==3)
	cardTemplate+='<i class="icon-retweet icon-white"></i>相互关注 <a class="delfollow" onclick="Follow(this,false,\'del\')" href="javascript:void(0);">取消</a>';
	else
	cardTemplate+='<i class="icon-plus icon-white"></i><a class="addfollow" onclick="Follow(this,false,\'add\')" href="javascript:void(0);">关注</a>';
	cardTemplate+='</span></div>';
	cardTemplate+='</div>';
	}
	
	var content=cardTemplate.format(
	jsonData.username,
	setGravatar(jsonData.gravatar,jsonData.sex,50),
	jsonData.nickname,
	setUserGrade(jsonData.userjf),
	setUserSex(jsonData.sex),
	jsonData.area!=''?jsonData.area:'其他',
	jsonData.follow,
	jsonData.fans,
	jsonData.share,
	replaceEmot(jsonData.xinqing),
	jsonData.uid,
	jsonData.photos
	)
	$cardTemplate=$(content);
	_obj.next().data("info",{ uid:jsonData.uid, username:jsonData.username });
	_obj.next().css({'top':'-=100','height':'180px'});
	_obj.next().find('.popover-content').html($cardTemplate);
	}
	
//设置用户性别
function setUserSex(sex){
	if(sex==1)
	return '<em class="W_icon male" title="男"></em>';
	else
	return '<em class="W_icon female" title="女"></em>';
	}
	
//删除喜分享
function delshare(_obj){
	reference=$(_obj).parents('.media').data("info");
	$.ajax({
		url: "/delshare/",
		type: "POST",
		data: { id:reference.id, uid:reference.uid},
		dataType: 'html',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData=="Y"){
				showtip('success','成功删除！');
				$(_obj).parents('.media').slideUp('fast',function(){$(this).remove()});
				}
			else {
				showtip('error','此项操作失效，如有疑问请联系系统管理员！');
				}
		});
}

//删除喜分享评论
function delcomment(_obj){
	reference=$(_obj).parents('.comment').data("info");
	$.ajax({
		url: "/delcomment/",
		type: "POST",
		data: { id:reference.comment_id, uid:reference.uid},
		dataType: 'html',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData=="Y"){
				showtip('success','成功删除评论！');
				$(_obj).parents('.comment').slideUp('fast',function(){$(this).remove()});
				commentcount=$(_obj).parents('.media:first').data('info').commentcount;
				commentcount--;
				$(_obj).parents('.media:first').data('info').commentcount=commentcount;
				$(_obj).parents('.W_comment').prev().find('a:last').text('评论('+commentcount+')');
				}
			else {
				showtip('error','此项操作失效，如有疑问请联系系统管理员！');
				}
		});
}

//加精华
function jingshare(_obj){
	reference=$(_obj).parents('.media').data("info");
	method=$(_obj).data("method");
		$.ajax({
		url: "/jingshare/",
		type: "POST",
		data: { id:reference.id, method:method},
		dataType: 'html',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData=="Y"){
				if(method=='jia'){
					$(_obj).text('取消精');
					$(_obj).data("method",'cancel');
					showtip('success','成功加为精华分享！');
					}
				else {
					$(_obj).text('精');
					$(_obj).data("method",'jia');
					showtip('success','成功取消精华分享！');
					}
				}
			else {
				showtip('error','此项操作失效，如有疑问请联系系统管理员！');
				}
		});
	}
	
//加赞
function dingshare(_obj,_action){
	reference=$(_obj).parents('.media').data("info");
	if(_action=='click')
		method=$(_obj).data("method");
	else
		method=_action;
		$.ajax({
		url: "/dingshare/",
		type: "POST",
		data: { id:reference.id, method:method},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData.data=="Y"){
				if(method=='jia'){
					$(_obj).text('取消赞('+resultData.count+')');
					$(_obj).data("method",'cancel');
					showtip('success','成功对分享发表赞！');
					}
				else if(method=='cancel') {
					$(_obj).text('赞('+resultData.count+')');
					$(_obj).data("method",'jia');
					showtip('success','成功对分享取消赞！');
					}
				if(resultData.items.length>0){
					var _x=$(_obj).offset().left;
					var _y=$(_obj).offset().top;
					$('.up_list').css({left:_x+'px',top:_y+15+'px'});
					uplist_template(resultData.items,reference);
				}
				}
			else {
				showtip('error','此项操作失效，如有疑问请联系系统管理员！');
				}
		});
	}

//顶分享用户列表模板
function uplist_template(items,reference){
	var template='<div class="span2"><a href="/{0}/"><img src="{1}" alt="{2}" title="{2}"/></a></div>';
	var morebtn='<div class="span2"><a class="btn btn-warning" title="查看更多" href="/{0}/{1}/">...</a></div>';
	var content='';
	for(var _item in items) {
		content+=template.format(items[_item].username,setGravatar(items[_item].gravatar,items[_item].sex,30),items[_item].nickname);
		}
	if(items.length>=5)
	content+=morebtn.format(reference.id,reference.username);
	$('.up_list .row-fluid').html(content);
	$('.up_list').fadeIn();
	}

//转发用户分享
function zhuanshare(_obj){
	$media=$(_obj).parents('.media').find('.media');
	var _text='';
	var _html='';
	var _nickname='';
	var templateHtml='';
	var _tar=$(_obj);
	if($media.length>0){
	_zhuan_id=$media.data('info').id;
	_type=$media.data('info').type;	
	if($(_obj).parents('.media').length<2){
	_text='//@'+$media.parents('.media').find('.media-heading:first').text()+': '+$media.parents('.media').find('.topic-text:first').text();
	_nickname=$media.parents('.media').data('info').nickname;
	_tar=$media.find('.W_func_share a').eq(-2);
	} else {
		_nickname=$media.find('.media-heading:first').text().replace(/@/g,'');
		}
	_html=$media.find('.media-heading:first').html().replace(/userinfolink/,'""')+$media.find('.topic-text:first').html();
	}
	else {
	_zhuan_id=$(_obj).parents('.media').data('info').id;
	_type=$(_obj).parents('.media').data('info').type;
	_nickname=$(_obj).parents('.media').data('info').nickname;
	_html=$(_obj).parents('.media').find('.media-heading:first').html().replace(/userinfolink/,'""')+$(_obj).parents('.media').find('.topic-text:first').html();
	}
	_share_id=$(_obj).parents('.media:first').data('info').id;
	$('#zhuanShare').data('info',{zhuan_id:_zhuan_id,share_id:_share_id,type:_type,tar:_tar});
	templateHtml='<div class="showLine">';
	templateHtml+=_html;
	templateHtml+='</div>';
	templateHtml+='<a class=" pull-right" onclick="fullZhuan(this)" title="展开" href="javascript:void(0);"><i class="icon-chevron-down"></i></a>';
	$('#zhuanShare .quote_share').html(templateHtml);
	$('#zhuan-text').text(_text);
	countLetters($('#zhuan-text').eq(0),318);
	$('#zhuanShare').find('.checkbox span').text(' 同时评论给 '+_nickname);
	$('#zhuanShare').modal({
						backdrop: false,
						keyboard: false
						});
	}

//发私信 
function Letter(_obj){
	nickname=$(_obj).data('nickname');
	content=$(_obj).data('content');
	if(nickname!=undefined)
		$('#letter-nickname').val(nickname);
		$('#letter-text').val(content);
	$('#Letter').modal({
						backdrop: false,
						keyboard: false
						});
	}

//显示视频
function showVideoPanel(_obj){
	video=$(_obj).parents('.topic-video').data('video')
	var template='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" height="380" width="480">';
	template+='<param name="wmode" value="opaque" />';
	template+='<param name="allowFullScreen" value="true" />';
	template+='<param name="movie" value="'+video+'" />';
	template+='<param name="quality" value="high" />';
	template+='<embed src="'+video+'" allowfullscreen="true" quality="high" wmode="transparent" allowscriptaccess="always" type="application/x-shockwave-flash" align="middle" height="380" width="480"></embed>';
	template+='</object>';
	$(_obj).parent().hide();
	$(_obj).parents('.topic-video').find('.video-obj').html(template);
	$(_obj).parents('.topic-video').find('.video-panel').show();
	}
//收起视频
function hideVideoPanel(_obj){
	$(_obj).parents('.video-panel').hide();
	$(_obj).parents('.topic-video').find('.video-obj').html('');
	$(_obj).parents('.topic-video').find('.video-btn').show();
	}
//分析分享内容的@#标签
function paraShare(_str){
	_str=' '+_str+' ';
	text='';
	reg1=new RegExp('@.*?(?=[ ,.?:;"<>{}|*()`~!@#$%^&])','gm'); //分析at列表
	reg2=new RegExp('#.*?(?:#{1})','gm'); //分析引用列表
	reg3=new RegExp("(http://)?hi.bxn.com([0-9a-z/_!~*'().;?:@&=+$,%#-]*)*",'gm'); //分析本站url链接
	atList=_str.match(reg1);
	atStr=_str.split(reg1);
	if(atList!=null){
		for(var i=0;i<atList.length;i++){
			text+=atStr[i]+'<a href="/n/'+atList[i].replace(/@/g,'')+'/">'+atList[i]+'</a>';
			}
	}
	text+=atStr[atStr.length-1];
	
	quoteList=text.match(reg2);
	quoteStr=text.split(reg2);	
	text='';
	if(quoteList!=null){		
		for(var i=0;i<quoteList.length;i++){
			text+=quoteStr[i]+'<a onclick="getTag(\''+quoteList[i].replace(/#/g,'')+'\')" href="javascript:void(0);">'+quoteList[i]+'</a>';
			}
	}
	text+=quoteStr[quoteStr.length-1];
	urlList=text.match(reg3);
	urlStr=text.split(reg3);
	text='';
	if(urlList!=null){		
		for(var i=0;i<urlList.length;i++){
			text+=urlStr[i]+'<a target="_blank" href="http://'+urlList[i].replace('http://','')+'">http://'+urlList[i].replace('http://','')+'</a>';
			}
	}
	text+=urlStr[urlStr.length-1];
	text=replaceEmot(text);
	return text;
	}
//展开转发内容
function fullZhuan(_obj){
	$(_obj).hide();
	$(_obj).prev().toggleClass('showMultiLine');
	}
//统计内容数字
function countLetters(_obj,number){
	_str=$(_obj).val();
	_tar=$(_obj).prev();
	total=number;
	len=total-_str.length;
	if(trim(_str,total)){
	_tar.find('b').text('已经超过');
	_tar.find('span').attr('class','red').text(Math.abs(len));
	return true;
	}
	else{		
	_tar.find('b').text('还可以输入');
	_tar.find('span').attr('class','gray').text(Math.abs(len));	
	return false;
	}
	}
//发分享字数统计
function countLetsShare(_obj){
	if(countLetters(_obj,140))
	$('#Post_Share').attr('disabled','disabled');
	else
	$('#Post_Share').removeAttr('disabled');
	}
//转发字数统计
function countLetsZhuan(_obj){
	if(countLetters(_obj,140))
	$('#zhuan-btn').attr('disabled','disabled');
	else
	$('#zhuan-btn').removeAttr('disabled');
	}
//私信字数统计
function countLetsLetter(_obj){
	if(countLetters(_obj,140))
	$('#letter-btn').attr('disabled','disabled');
	else
	$('#letter-btn').removeAttr('disabled');
	}

//评论字数统计
function countLetsComment(_obj){
	if(countLetters(_obj,140))
	$(_obj).val($(_obj).val().substr(0 ,140));
	}
//留言字数统计
function countLetsMessage(_obj,_tar){
	if(countLetters(_obj,140))
	_tar.attr('disabled','disabled');
	else
	_tar.removeAttr('disabled');
	}
//带编辑器输入框字数统计
function countEditorLetter(){
	_str=$('#Discuss_Poster_Container').val();
	_tar=$('.num');
	total=500;
	len=total-_str.length;
	if(trim(_str,total)){
	_tar.find('b').text('已经超过');
	_tar.find('span').attr('class','red').text(Math.abs(len));
	$('#discuss_btn').prop('disabled',true);
	}
	else{		
	_tar.find('b').text('还可以输入');
	_tar.find('span').attr('class','gray').text(Math.abs(len));	
	$('#discuss_btn').prop('disabled',false);
	}
	}

//显示或隐藏评论列表
function togglecomment(_obj){
	_tar=$(_obj).parents('.media:first').find('.W_comment:last');
	if(_tar.find('.comment-rec').length>0)
	hidecomment(_tar);
	else 
	showcomment(_tar)
	}
	
//获取评论列表
function showcomment(_obj){	
	var share_id=_obj.parents('.media:first').data('info').id;	
	var type=_obj.parents('.media:first').data('info').type
	var commentcount=_obj.parents('.media:first').data('info').commentcount;
	var share_user=_obj.parents('.media:first').data('info').username;
	var info={share_id:share_id, share_user:share_user, commentcount:commentcount};
	_obj.html(commentrec(share_id,type)).show();
	$.ajax({
		url: "/fetchcomments/",
		type: "POST",
		data: { id:share_id},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			var _tar=_obj.find('.comment-rec .popover-content');
			template='<textarea rows="1" class="comment-text"  title="评论内容" placeholder="请输入评论内容"></textarea>';
			template+='<div class="row-fluid">';
			template+='<div class="span1"><a class="W_icon icon_emot" title="插入表情" onclick="commentEmotPanel(this)" href="javascript:void(0);">表情</a></div>';
			template+='<div class="span4 text-left"><label class="checkbox font12 comment-chkbox"><input type="checkbox">同时转发到我的微博</label></div>';
			template+='<div class="span2 offset4 text-right" style="float:right;"><button type="button" class="btn btn-small btn-warning comment-btn">评论</button></div>';
			template+='</div>';	
			template+='<div class="comment-list"></div>';			
			_tar.html(template);
			_tar.find(".comment-text").focus().autoTextarea({
			maxHeight:1000 //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
			});
			if(resultData.data=="Y"){
				for(var i=0;i<resultData.items.length;i++){
					_tar.find('.comment-list').append(commentlist(resultData,i,info,true));
					}
				}
			});
	}
	
//隐藏评论列表
function hidecomment(_obj){
	_obj.hide().html('');
	}
	
//初始化评论框
function commentrec(id,type){
	var template='<div class="popover bottom comment-rec">';
	template+='<div class="arrow" style="left: 93%;"></div>';
	template+='<div class="popover-content clearfix">';
	template+='<div class="W_loading"><span>正在加载中，请稍候...</span></div>';
	template+='</div></div>';
	$template=$(template);
	$template.data('info',{shareid:id,type:type});
	return 	$template;
	}
	
//初始化评论回复框
function replycommentrec(id,type){
	var template='<div class="popover bottom reply-comment-rec">';
	template+='<div class="arrow" style="left: 94%;"></div>';
	template+='<div class="popover-content clearfix">';
	template+='<textarea rows="1" class="reply-comment-text"  title="回复内容" placeholder="请输入回复内容"></textarea>';
	template+='<div class="row-fluid">';
	template+='<div class="span1"><a class="W_icon icon_emot" title="插入表情" onclick="replyCommentEmotPanel(this)" href="javascript:void(0);">表情</a></div>';
	template+='<div class="span5 text-left"><label class="checkbox font12 reply-comment-chkbox"><input type="checkbox">同时转发到我的微博</label></div>';
	template+='<div class="span2 offset3 text-right" style="float:right;"><button type="button" class="btn btn-small reply-comment-btn">回复</button></div>';
	template+='</div>';
	template+='</div></div>';
	$template=$(template);
	$template.data('info',{shareid:id,type:type});
	return 	$template;
	}
//初始化评论列表
function commentlist(jsonData,i,info,showmore){
	var template='<div class="comment media-sep font12">';
	template+='<a class="pull-left userinfolink" href="/{0}/">';
	template+='<img src="{1}" alt="{2}" width="30" height="30" class="comment-object">';
	template+='</a>';
	template+='<div class="comment-body">';
	template+='<a class="userinfolink" href="/{0}/">{2}</a>：{3} <span class="muted">({4})</span> ';
	template+='<div class="W_func_comment row-fluid muted">';
	template+='<div class="span11 pull-right text-right">';
	if(jsonData.staff || jsonData.uid==jsonData.items[i].uid)
	template+='<i class="del_btn hide"><a onClick="delcomment(this)" href="javascript:void(0);">删除</a> |</i> ';
	template+='<a onClick="replycomment(this)" href="javascript:void(0);">回复</a>';
	template+='</div></div></div></div>';
	if (i>=9 && showmore){
		template+='<p class="commentmore font12">后面还有'+(info.commentcount-10)+'条评论，<a href="/{5}/{6}/">点击查看<span class="CH">&gt;&gt;</span></a></p>'
		}
	
	var content=template.format(
	jsonData.items[i].username,
	setGravatar(jsonData.items[i].gravatar,jsonData.items[i].sex,30),
	jsonData.items[i].nickname,
	paraShare(jsonData.items[i].content),
	getDateDiff(getDateTimeStamp(jsonData.items[i].pubdate)),
	info.share_id,
	info.share_user
	);
	var $content=$(content);
	$content.data("info",{share_id:jsonData.share_id, comment_id:jsonData.items[i].comment_id, uid:jsonData.items[i].uid, nickname:jsonData.items[i].nickname});
	return $content
	}

//显示回复框
function replycomment(_obj){	
	_tar=$(_obj).parents('.comment .comment-body');
	if(_tar.find('.reply-comment-rec').length>0){
	_tar.find('.reply-comment-rec').remove();
	}
	else {
	var share_id=$(_obj).parents('.media:first').data('info').id;	
	var type=$(_obj).parents('.media:first').data('info').type
	var nickname=$(_obj).parents('.comment').data('info').nickname;
	_tar.append(replycommentrec(share_id,type)).show();
	_tar.find(".reply-comment-text").val('回复@'+nickname+' ：');
	_tar.find(".reply-comment-text").focus().autoTextarea({
			maxHeight:1000 //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
			});
	_tar.find('.reply-comment-rec').show();
	}
	}
	
//初始化AT评论回复框
function replyATcommentrec(id,type){
	var template='<div class="reply-comment-rec" style="background-color:transparent;"><hr style="margin-bottom:10px;"/>';
	template+='<textarea rows="1" class="reply-comment-text"  title="回复内容" placeholder="请输入回复内容"></textarea>';
	template+='<div class="row-fluid">';
	template+='<div class="span1"><a class="W_icon icon_emot" title="插入表情" onclick="replyCommentEmotPanel(this)" href="javascript:void(0);">表情</a></div>';
	template+='<div class="span5 text-left"><label class="checkbox font12 reply-comment-chkbox"><input type="checkbox">同时转发到我的微博</label></div>';
	template+='<div class="span2 offset3 text-right" style="float:right;"><button type="button" class="btn btn-small reply-comment-btn">回复</button></div>';
	template+='</div>';
	template+='</div>';
	$template=$(template);
	$template.data('info',{shareid:id,type:type});
	return 	$template;
	}

//显示AT回复框
function replyATcomment(_obj){
	_tar=$(_obj).parents('.popover-content:first');
	if(_tar.find('.reply-comment-rec').length>0){
	_tar.find('.reply-comment-rec').remove();
	}
	else {
	var share_id=_tar.data('id');	
	var type=_tar.data('type')
	var nickname=_tar.data('nickname')
	_tar.append(replyATcommentrec(share_id,type)).show();
	_tar.find(".reply-comment-text").val('回复@'+nickname+' :');
	_tar.find(".reply-comment-text").focus().autoTextarea({
			maxHeight:1000 //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
			});
	}
	}

//显示图片插入框
function photoPanel(_obj){
	closePanel();
	obj=$(_obj).parent().find('a:first');
	var _x=obj.position().left;
	var _y=obj.position().top;
	uploaderLen=$('.uploadify').length;
	if (chkFlash()){
		if (uploaderLen<1)
			initUploader();
	}
	else
	$('.normal-upload-panel').show();
	$('.photopanel').css({left:_x+'px',top:_y+19+'px'}).show(function(){$('.main_blog').bind('click',function(){closePanel()})});	
	}
//显示视频插入框
function videoPanel(_obj){
	closePanel();
	obj=$(_obj).parent().find('a:first');
	var _x=obj.position().left;
	var _y=obj.position().top;
	$('.video-preview').hide();
	$('.video-input').show();
	$('.videopanel').css({left:_x+'px',top:_y+19+'px'}).show(function(){$('.main_blog').bind('click',function(){closePanel()})});	
	}
//返回视频输入框
function backVideoInput(){
	$('.video-preview').hide();
	$('.video-input').show();
	}
//获取视频预览数据
function getVideoInfo(){
	var video=$('#netVideo').val();
	if(trim(video,12)){
		$.ajax({
		url: "/getvideoinfo/",
		type: "POST",
		data: { video:video},
		dataType: 'html',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData!=''){
				var videoArray=resultData.split('||');
				if(trim(videoArray[0],1))
				$('.video-title').text(videoArray[0]);
				else
				$('.video-title').text('视频');
				if(trim(videoArray[1],12)){
				$('.video-image').attr('src',videoArray[1]);
				$('.video-image').attr('title',videoArray[0]);
				}
				else{
					$('.video-image').attr('src','/media/images/videobg.png');
					$('.video-image').attr('title','没有预览');
					}
				$('.video-preview').show();
				$('.video-input').hide();
				$('.videopanel').data('url',video);
				$('#netVideo').val('');
				}
			else
			showtip('error','请输入正确的视频地址！');
		});
		}
	else
	showtip('error','请输入正确的视频地址！');
	}
//插入视频标签
function videoInsert(){
	txt=$('.video-title').text();
	img=$('.video-image').attr('src');
	url=$('.videopanel').data('url');
	videoLabel=$('.label-video');
	if(videoLabel.length>0){
		if(confirm("您已经使用了一次视频，是否覆盖已选择视频？")){
			videoLabel.remove();			
			kindInsert('video',txt,img,url);
			}
		}
	else
		kindInsert('video',txt,img,url);
	closePanel();
	}
//显示话题插入框
function subjectPanel(_obj){
	closePanel();
	obj=$(_obj).parent().find('a:first');
	var _x=obj.position().left;
	var _y=obj.position().top;
	$('.subjectpanel').css({left:_x+'px',top:_y+19+'px'}).show(function(){$('.main_blog').bind('click',function(){closePanel()})});	
	}

//插入话题
function insertSubject(tag,key){	
	var txt=document.getElementById('Share_Poster_Container');
	insertAtCursor(txt, tag);	
	if(key){
		var str='在这里输入你想要说的话题';
		var len = txt.value.length;	
		var index=txt.value.indexOf('#'+str+'#');
		if (txt.createTextRange) {//for IE
		var range = txt.createTextRange();		
		range.moveStart("character", index+1);
		range.moveEnd("character", 1-(len-index-str.length));
		range.select();
		} else {
		txt.setSelectionRange(index+1, index+1+str.length);
		txt.focus();
		}
		}
	}
//显示预览框
function showPreviewImg(_obj){
	var _x=$(_obj).position().left;
	var _y=$(_obj).position().top;
	$('.previewpanel img').attr('src',$(_obj).data('image'));
	$('.previewpanel').css({left:_x+'px',top:_y+19+'px'}).show();	
	}
//隐藏预览框
function hidePreviewImg(){
	$('.previewpanel').hide();
	}

//显示拼图模式
function ptMode(){
	closePanel();
	obj=$('.kind-insert').find('a:first');
	var _x=obj.position().left;
	var _y=obj.position().top;
	$('.ptpanel').css({left:_x+'px',top:_y+19+'px'}).show(function(){$('.main_blog').bind('click',function(){closePanel()})});
	xiuxiu.embedSWF("xiuxiuContent",2,"100%","470px");
	/*第1个参数是加载编辑器div容器，第2个参数是编辑器类型，第3个参数是div容器宽，第4个参数是div容器高*/
	xiuxiu.setUploadURL("http://"+getHost(document.URL)+"/upload_photo/");//修改为上传接收图片程序地址
	xiuxiu.setUploadType(2);
	xiuxiu.setUploadDataFieldName ('Filedata','xiuxiuContent');
	xiuxiu.onInit = function ()
	{
	//xiuxiu.loadPhoto("http://open.web.meitu.com/sources/images/1.jpg");//修改为要处理的图片url
	}
	xiuxiu.onBeforeUpload = function (data, id)
	{
	  var size = data. size;
	  if(size > 5 * 1024 * 1024)
	  { 
		showtip('error','上传图片最大不能超过5M！'); 
		return false; 
	  }
	  return true; 
	}
	xiuxiu.onDebug = function (data)
	{
		alert("错误响应" + data);
	}
	xiuxiu.onUploadResponse = function (data)
	{

		//alert("上传响应" + data); //可以开启调试
		type='image';
		txt= eval('(' + data + ')').save_name;
		img='/media/upload/images/thumb/'+txt;
		url=txt;
		kindInsert(type,txt,img,url);
		closePanel();
	}
	xiuxiu.onClose = function (id)
	{
		closePanel();
	}
}

//插入图片、视频标签
function kindInsert(type,txt,img,url){
	var template='<span  data-url="'+url+'" class="label label-warning ';
	if(type=='video'){
	template+='label-video">';
	template+='<i class="icon-film icon-white"></i> ';
	}
	else{
	template+='label-image">';
	template+='<i class="icon-picture icon-white"></i> ';
	}	
	template+='<span class="cursor-normal" data-image="'+img+'">'+txt+'</span>';
	if(type=='video')
	template+='<a onclick="$(this).parents(\'.label\').remove();" href="javascript:void(0);" title="删除该视频" class="close-label">&times;</a></span>';
	else
	template+='<a onclick="$(this).parents(\'.label\').remove();" href="javascript:void(0);" title="删除该图片" class="close-label">&times;</a></span>';
	$('.kind-rec').append(template);
	}

//初始化上传插件	
function initUploader(){	
	$('#photofileInput').uploadify({
	//以下参数均是可选
    'buttonText' : '选择图片',
	'width' : 80,
	'swf' : '/static/swf/uploadify.swf', //指定上传控件的主体文件，默认'uploader.swf'
	'uploader' : '/upload_photo/', //指定服务器端上传处理文件，默认'upload.php'
	'cancelImg' : '/media/images/uploadify-cancel.png', //指定取消上传的图片，默认'cancel.png'
	'auto' : false, //选定文件后是否自动上传，默认false
	'muti' : true, //是否允许同时上传多文件，默认false
	'fileTypeDesc' : 'Image Files (.JPG,.JPEG,.GIF,.PNG,.BMP)', //出现在上传对话框中的文件类型描述
	'fileTypeExts' : '*.jpg;*.jpeg;*.gif;*.png;*.bmp', //控制可上传文件的扩展名，启用本项时需同时声明fileDesc
	'fileSizeLimit' : 1024*20+'KB', //控制上传文件的大小，单位byte
	'uploadLimit' :6 ,//多文件上传时，同时上传文件数目限制
	'onSelect' : function(file) {
		$('.upload-panel').show();
	},
	'onUploadStart' : function(file) {
         $('#photofileInput').uploadify('disable', true)
		 $('.upload-panel').hide();
	} ,
	'onUploadSuccess' : function(file, data, response) {
		type='image';
		txt= eval('(' + data + ')').save_name;
		img='/media/upload/images/thumb/'+txt;
		url=txt;
		kindInsert(type,txt,img,url)
    },
	'onQueueComplete' : function(queueData) {
		showtip('success',queueData.uploadsSuccessful+'个图片文件上传成功！');
		$('#photofileInput').uploadify('disable', false)
		closePanel();
	} 
　　});
	}


//检测手机号码的合法性
function ismobile(str){
if(str.length != 11){
return false;
}else{
    var t=/^(13\d{9})|(15\d{9})|(18\d{9})|(0\d{10,11})$/;
    return t.test(str);
    }
}

//验证书否为电话号码
function isTelphone(str){
if(str.length == 0){
return false;
}else{
    var p1 =  /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/; 
	return p1.test(str);
    }
}

//验证数据是否为空
function trim(str,len){
	string=str.replace(/^\s+|\s+$/g,"");
	if(string!='')
	return (string.length>=len)?true:false;
	else
	return false;
	}

//去除空字符
function trimBlank(str){
	string=str.replace(/^\s+|\s+$/g,"");
	return string;
	}	
//验证是否为合法邮箱
function isemail(str){ 
var regEmail = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
return regEmail.test(str);
}

//验证是否英文和数字
function isEorD(str){
 var reg=/^\w+$/
 return reg.test(str);
}

//验证是否数字
function isNumber(str){
 var reg=/^\d+$/
 return reg.test(str);
}

//验证是否中文、英文、数字和符号
function isCEDorF(str){
 var reg=/^[\u4E00-\u9FA5\w_.@+-]+$/
 return reg.test(str);
}

//验证是否合法的url地址
function isURL(str){
str = str.match(/http:\/\/.+/); 
if (str == null) 
return false; 
else 
return true; 
}

//身份证合法验证
function isCardNo(card){  
// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
if(reg.test(card) === false)  
return  false;  
else
return  true;  
} 

//增加cookie
//这是有设定过期时间的使用示例：
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30
function setCookie(name,value,time)
{
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";
}

function getsec(str)
{
   var str1=str.substring(1,str.length)*1;
   var str2=str.substring(0,1);
   if (str2=="s")
   {
        return str1*1000;
   }
   else if (str2=="h")
   {
       return str1*60*60*1000;
   }
   else if (str2=="d")
   {
       return str1*24*60*60*1000;
   }
}

//读取cookies
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return (arr[2]);
    else
        return null;
}

//删除cookies
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

//获取url参数
function request(paras,defaultValue)
{ 
	var url = location.href; 
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
	var paraObj = {} 
	for (var i=0; j=paraString[i]; i++){ 
	paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
	} 
	var returnValue = paraObj[paras.toLowerCase()]; 
	if(typeof(returnValue)=="undefined"){ 
	return defaultValue; 
	}else{ 
	returnValue=returnValue.split('#')[0];
	return returnValue; 
	} 
}

// 用js计算时间差,得到比较人性化的结果
var minute = 1000 * 60;
var hour = minute * 60;
var day = hour * 24;
var halfamonth = day * 15;
var month = day * 30;
 
function getDateDiff(dateTimeStamp){
var now = new Date().getTime();
var diffValue = now - dateTimeStamp;
 
/*if(diffValue < 0){
 //非法操作
 alert("结束日期不能小于开始日期！");
 }
  alert("当前时间："+now);*/
var monthC =diffValue/month;
var weekC =diffValue/(7*day);
var dayC =diffValue/day;
var hourC =diffValue/hour;
var minC =diffValue/minute;
 
if(monthC>=1){
 result=parseInt(monthC) + "月前";
 }
 else if(weekC>=1){
 result=parseInt(weekC) + "星期前";
 }
 else if(dayC>=1){
 result=parseInt(dayC) +"天前";
 }
 else if(hourC>=1){
 result=parseInt(hourC) +"小时前";
 }
 else if(minC>=1){
 result=parseInt(minC) +"分钟前";
 }else
 result="刚刚发表";
  //alert("当前时间："+dateTimeStamp);
 return result;
}

//获取时间戳
function getDateTimeStamp(dateStr){
 return Date.parse(dateStr.replace(/-/gi,"/"));
}

//让指定的DIV始终显示在屏幕正中间  
function letDivCenter(divName){   
	var top = ($(window).height() - $(divName).outerHeight())/2;   
	var left = ($(window).width() - $(divName).outerWidth())/2;   
	var scrollTop = $(document).scrollTop();   
	var scrollLeft = $(document).scrollLeft();   
	$(divName).css( {'top' : top + scrollTop+'px', left : left + scrollLeft+'px' }) ;
}

//获取文件路径的扩展名
function getExt(path){
	var Ext=/\.[^\.]+$/.exec(path);
	return Ext;
	}

//显示提示信息板
function showtip(type,content){
	className='';
	tiptitle='提示: ';
	switch (type){
		case 'info': 
			className='alert-info';
			tiptitle='提示:';
			break;
		case 'success': 
			className='alert-success';
			tiptitle='成功:';
			break;	
		case 'error': 
			className='alert-error';
			tiptitle='错误:';
			break;
		case 'danger': 
			className='alert-danger';
			tiptitle='危险:';
			break;
		}
	_obj=$('.tippanel');
	_obj.removeClass('alert-info alert-success alert-error alert-danger').addClass(className);
	_obj.html('<strong>'+tiptitle+' </strong>'+content);
	letDivCenter(_obj);
	_obj.stop(true,true);
	_obj.fadeIn().delay(4000).fadeOut();
	}
	
// 在光标处插入字符串
// myField 文本框对象
// 要插入的值
function insertAtCursor(myField, myValue) 
{ 
//IE support 
if (document.selection) 
{ 
myField.focus(); 
sel = document.selection.createRange(); 
sel.text = myValue; 
sel.select(); 
} 
//MOZILLA/NETSCAPE support 
else if (myField.selectionStart || myField.selectionStart == '0') 
{ 
var startPos = myField.selectionStart; 
var endPos = myField.selectionEnd; 
// save scrollTop before insert 
var restoreTop = myField.scrollTop; 
myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos,myField.value.length); 
if (restoreTop > 0) 
{ 
// restore previous scrollTop 
myField.scrollTop = restoreTop; 
} 
myField.focus(); 
myField.selectionStart = startPos + myValue.length; 
myField.selectionEnd = startPos + myValue.length; 
} else { 
myField.value += myValue; 
myField.focus(); 
} 
} 

//修改地址栏URL参数解决url参数问题
function changeURLPar(destiny, par, par_value)
{
var pattern = par+'=([^&]*)';
var replaceText = par+'='+par_value;
if (destiny.match(pattern))
{
var tmp = '/\\'+par+'=[^&]*/';
tmp = destiny.replace(eval(tmp), replaceText);
return (tmp);
}
else
{
if (destiny.match('[\?]'))
{
return destiny+'&'+ replaceText;
}
else
{
return destiny+'?'+replaceText;
}
}
return destiny+'\n'+par+'\n'+par_value;
} 

//获取当前时间
function getLastTime(){
	var date=new Date();
	var dateStr='{0}-{1}-{2} {3}:{4}:{5}';
	dateStr=dateStr.format(
	date.getFullYear(),
	date.getMonth()+1,
	date.getDate(),
	date.getHours(),
	date.getMinutes(),
	date.getSeconds()
	);
	return dateStr;
	}
//初始化图片显示
function initShowPhoto(){
	$("img.lazy").lazyload({ 
    threshold : 200,
    effect : "fadeIn"
	});
	$(window).scrollTop($(window).scrollTop()+1); 
	}
//局域范围内初始化图片显示
function blockInitShowPhoto(_obj){
	_obj.find("img.lazy").lazyload({ 
    threshold : 200,
    effect : "fadeIn"
	});
	$(window).scrollTop($(window).scrollTop()+1); 
	}

//显示表情插入框
function emotPanel(_obj,_tar){
	closePanel();
	var _x=$(_obj).position().left;
	var _y=$(_obj).position().top;
	$('.emotpanel').css({left:_x+'px',top:_y+19+'px'}).show(function(){$('.main_blog,.other_main_blog,.wrap').bind('click',function(){closePanel()})});	
	$('.emotpanel').data('info',{tar:_tar})
	$('.emotpanel').find('.popover-content:first').load('/static/html/emot.html');
	}
//显示表情插入框
function emotPanel2(_obj,_tar){
	var _x=$(_obj).offset().left;
	var _y=$(_obj).offset().top;
	$('.emotpanel').css({left:_x+'px',top:_y+19+'px'}).show(function(){
		$('.QD-dialog').bind('click',function(){$('.emotpanel').hide();$('.QD-dialog').unbind('click');})
		});	
	$('.emotpanel').data('info',{tar:_tar})
	$('.emotpanel').find('.popover-content:first').load('/static/html/emot.html');
	}
//隐藏kind-edit面板
function closePanel(){
	$('.emotpanel,.photopanel,.videopanel,.subjectpanel,.ptpanel,.videopreviewpanel').hide();
	$('.main_blog,.other_main_blog,.wrap').unbind('click');
	}
//转发表情插入框
function zhuanEmotPanel(_obj,_tar){
	var _x=$(_obj).position().left;
	var _y=$(_obj).position().top;
	$('.zhuanemotpanel').css({left:_x-5+'px',top:_y+19+'px'}).show(function(){$('#zhuanShare,#Letter').find('.modal-header,.modal-body,.modal-footer').bind('click',function(){closeZhuanPanel()})});	
	$('.zhuanemotpanel').data('info',{tar:_tar})
	$('.zhuanemotpanel').find('.popover-content:first').load('/static/html/emot.html');
	}
//评论表情插入框
function commentEmotPanel(_obj){
	closePanel();
	var _x=$(_obj).offset().left;
	var _y=$(_obj).offset().top;
	var _tar=$(_obj).parents('.comment-rec:first').find('.comment-text:first');
	$('.emotpanel').css({left:_x+'px',top:_y+19+'px'}).show(function(){$('.main_blog,.other_main_blog').bind('click',function(){closePanel()})});	
	$('.emotpanel').data('info',{tar:_tar})
	$('.emotpanel').find('.popover-content:first').load('/static/html/emot.html');
	}
//评论回复表情插入框
function replyCommentEmotPanel (_obj){
	closePanel();
	var _x=$(_obj).offset().left;
	var _y=$(_obj).offset().top;
	var _tar=$(_obj).parents('.reply-comment-rec:first').find('.reply-comment-text:first');
	$('.emotpanel').css({left:_x+'px',top:_y+19+'px'}).show(function(){$('.main_blog,.other_main_blog').bind('click',function(){closePanel()})});	
	$('.emotpanel').data('info',{tar:_tar})
	$('.emotpanel').find('.popover-content:first').load('/static/html/emot.html');
	}
//隐藏转发表情对话框
function closeZhuanPanel(){
	$('.zhuanemotpanel').hide();
	$('#zhuanShare,#Letter').find('.modal-header,.modal-body,.modal-footer').unbind('click');
	}

//插入表情
function insertEmot(_obj,_emot){
	_tar=$(_obj).parents('.popover:first').data('info').tar;
	insertAtCursor(_tar[0], _emot);
	}
	
//关注用户
function Follow(_obj,_uid,_action){
	if(!_uid)
	_uid=$(_obj).parents('.userpanel').data('info').uid;
	$.ajax({
		url: "/followprocess/",
		type: "POST",
		data: { uid:_uid,action:_action},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData.data=="Y"){
				if(_action=='add'){
					showtip('success','添加关注成功！');
					$(_obj).parent().html('<i class="icon-ok icon-white"></i>已关注 <a class="delfollow" onclick="Follow(this,\''+_uid+'\',\'del\')" href="javascript:void(0);">取消</a>');
					}
				if(_action=='add2'){
					showtip('success','添加关注成功！');
					$(_obj).parents('.message').slideUp('fast',function(){
						$(this).remove();
						len=$('.user-list .message').length;
						if(len<1){
							refreshUser(5);
							}
						});
					}
				if(_action=='del'){
					showtip('success','取消关注成功！');
					$(_obj).parent().html('<i class="icon-plus icon-white"></i><a class="addfollow" onclick="Follow(this,\''+_uid+'\',\'add\')" href="javascript:void(0);">关注</a>');
					}
				if(_action=='del2'){
					showtip('success','取消关注成功！');
					$(_obj).parents('li').remove();
					}
				if(_action=='beg'){
					showtip('success','关注请求发送成功！');
					}
				}
			else {
				showtip('error',resultData.error);
				}
		});
	}

//移除粉丝
function removeFans(_obj,_uid){
	$.ajax({
		url: "/followprocess/",
		type: "POST",
		data: { uid:_uid,action:'removefans'},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData.data=="Y"){
			$(_obj).parents('.message').slideUp('fast',function(){$(this).remove()});
			showtip('success','移除粉丝成功！');		
			}
		});
	}

//搜索tag分享
function getTag(key){
	$('.search-query').val(key);
	getSearch({'type':'tag','page':1,'displayed':0});
	}
	
//搜索关键词分享
function getContent(key){
	$('.search-query').val(key);
	getSearch({'type':'content','page':1,'displayed':0});
	}

//检测更新函数
function checkUpdateShare(){	
	$.ajax({
	url: "/checkupdate/",
	type: "POST",
	data: {time:showListTime},
	dataType: 'json',
	timeout: 10000		
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			listUpdateData=resultData;	
			$('.update-shares').find('em').text(resultData.resultcount).end().show();		
			}
		});
}

//更新新发表分享列表
function updateShare(){
	var len=listUpdateData.items.length;
	for(var i=0;i<len;i++){
		var $content=shareList(listUpdateData,i,false);
		$content.css({display:'none'});
		$('.W_content').prepend($content);
		$('.W_content .media:first').slideDown('fast');
		}
	for(var j=0;j<len;j++){
		_obj=$('.W_content > .media').eq(j).find('.media-body .popover-content');
		if(_obj.length>0)
			fetchshare(listData.items[len-1-j].transmit,_obj);
		}
	$('.update-shares').hide();
	showListTime=getLastTime(); //更新最后一次获取数据库时间
	initShowPhoto();
	}


//设置用户头像
function setGravatar(gravatar,sex,size){
	var _gravatar='';
	if(gravatar==''){
		if(sex==1)
		_gravatar='/static/media/images/male_50.png';
		else
		_gravatar='/static/media/images/male_50.png';
	}
	else 
	_gravatar='/static/media/images/male_50.png';	
	//_gravatar='static//media/upload/face/'+size+'/'+gravatar;
	return _gravatar;
}

//输出用户头像
function getGravatar(_obj,_str,_sex,_size){
	$(_obj).parent().html('<img src="'+setGravatar(_str,_sex,_size)+'" />')
}

	
//设置用户等级
function setUserGrade(JF){
	var gradeClass='';
	var gradeName='';
	var grade=0;
	for(var i=0;i<6;i++){
		if(JF<GradeArray[i]){
			gradeClass='grade'+i;
			grade=i;
			break;
			}
		}
	switch(grade){
		case 0:
			gradeName='普通会员';
			break;
		case 1:
			gradeName='银鸟会员';	
			break;
		case 2:
			gradeName='金鸟会员';
			break;
		case 3:
			gradeName='凤凰会员';
			break;
		case 4:
			gradeName='火凤凰会员';
			break;
		case 5:
			gradeName='金凤凰会员';
			break;
		}
	return '<em class="W_icon pull-left '+gradeClass+'" title="'+gradeName+'"></em>';
	}

//输出用户等级标识
function setGrade(_obj,JF){
	_tar=$(_obj).prev();
	_str=setUserGrade(JF);
	$(_obj).remove();
	_tar.after(_str);
	}
	
//输出用户达人标识
function setDaren(_obj,JF){
	_tar=$(_obj).parent();
	var grade=0;
	for(var i=0;i<6;i++){
		if(JF<GradeArray[i]){
			grade=i;
			break;
			}
		}
	_str='<img src="/media/images/phoenix'+(i+1)+'.png" />';
	$(_obj).remove();
	_tar.prepend(_str);
	}

//提交留言
function addMessage(_uid,_from,_to){
	content=document.getElementById(_from).value;
	tar=document.getElementById(_to);
	if(!trim(content,1)){
		showtip('error','别那么懒，还是先写点什么吧！');
		return;
	}
	var pub_content=getCookie('pub_content');
	var pub_count=parseInt(getCookie('pub_count'));
	var pub_time=getCookie('pub_time');
	if(unescape(pub_content)!=null && unescape(pub_content)==content){
		showtip('error','请不要发表重复内容的留言！');
		return;
		}

	$.ajax({
	url: "/messageprocess/",
	type: "POST",
	data: {uid:_uid, content:content, action:'add'},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			template=$(initMessageTemplate(resultData,_to)).css('display','none');
			$(tar).prepend(template);
			$(tar).find('.message:first').slideDown('fast');
			document.getElementById(_from).value='';
			setCookie('pub_content',content,'h24');
				if(pub_time==null){
					setCookie('pub_count',1,'h24');
					setCookie('pub_time','Y','s60');
				} else 
					setCookie('pub_count',pub_count+1,'h24');
			}
			else
			showtip('error',resultData.error);
		});
	}

//删除留言
function delMessage(_obj,_id,_uid){
	$.ajax({
	url: "/messageprocess/",
	type: "POST",
	data: {id:_id, uid:_uid, action:'del'},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			$(_obj).parents('.message:first').slideUp('fast',function(){$(this).remove()});
			showtip('success','成功删除留言。');
			}
			else
			showtip('error',resultData.error);
		});
	}
//回复主留言
function replyMessage(_obj){
	$('#message_input').val('@'+_obj+' ');
	$("html").animate({'scrollTop': $("#tab").offset().top+'px'}, 600,function(){$('#message_input').focus();});
	}

//回复辅留言
function replyFuMessage(_obj){
	$('#message_fu_input').val('@'+_obj+':').focus();
	}

//初始化留言模板
function initMessageTemplate(jsonData,_obj){
	var template='<div class="message line-bottom">'
	+'<a data-uid="{0}" class="userinfolink pull-left" href="/{1}/"><img src="/static/media/images/grey.gif" onLoad="getGravatar(this,\'{2}\',{3},{4})" /></a>'
	+'<div class="message-body">'
	+'<p class="message-heading clearfix muted font12"><span class="pull-left">{5}</span><span class="pull-right"><i class="del_btn hide"><a onclick="delMessage(this,{6},{0})" href="javascript:void(0);">删除</a> | </i><a  onclick="reply{9}Message(\'{7}\')" href="javascript:void(0);">回复</a></span></p>'
	+'<a href="/{1}/" target="_blank"> {7}:</a>'
	+'{8} </div></div>'
	template=template.format(
	jsonData.record.uid,
	jsonData.record.username,
	jsonData.record.gravatar,
	jsonData.record.sex,
	seleSize(_obj),
	jsonData.record.date,
	jsonData.record.id,
	jsonData.record.nickname,
	paraShare(jsonData.record.content),
	selereplyfunc(_obj)
	);
	return template;
	}

function seleSize(_obj){if(_obj=='messages') size=50; else size=30; return size;}
function selereplyfunc(_obj){if(_obj=='messages') func=''; else func='Fu'; return func;}

//html输出带表情文字
function outputTextFace(_obj,content){
	tar=$(_obj).parent();
	content=replaceEmot(content);
	tar.html(content);
	}
//html输出带表情文字并解析@、#链接
function outputTextAll(_obj,content){
	tar=$(_obj).parent();
	content=paraShare(content);
	tar.html(content);
	}

//根据用户关注关系，输出关注按钮
function outputFollowBtn(_obj,uid,relation){
	tar=$(_obj).parent();
	var template='';
	if(relation==1)
	template='<i class="icon-ok icon-white"></i>已关注 <a class="delfollow" onclick="Follow(this,'+uid+',\'del\')" href="javascript:void(0);">取消</a>';
	else if(relation==3)
	template='<i class="icon-retweet icon-white"></i>相互关注 <a class="delfollow" onclick="Follow(this,'+uid+',\'del\')" href="javascript:void(0);">取消</a>';
	else
	template='<i class="icon-plus icon-white"></i><a class="addfollow" onclick="Follow(this,'+uid+',\'add\')" href="javascript:void(0);">关注</a>';
	tar.html(template);
	}

//输出用户最新的一条分享
function outputLatestShare(_obj,username,string){
	if (string){
		tar=$(_obj).parent();
		data=string.split('|||');
		content=data[0];
		date=data[1]
		template='<a href="/'+username+'/" target="_blank">'+paraShare(content)+'</a><span style="padding-left:10px;" class="muted">'+date+'</span>'
		tar.html(template);
	}
	}
	
//照片喜欢、取消喜欢操作
function photoLike(_obj,_id,uid){
	if(uid==0){
		showtip('error','添加喜欢失败，你还未登录喜社区！');
		return;
		}
	tar=$(_obj).find('.like');
	if(tar.length<1)
	_action='add';
	else
	_action='del';
	$.ajax({
	url: "/photolike/",
	type: "POST",
	data: {id:_id, action:_action},
	dataType: 'json',
	timeout: 10000		
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			if(_action=='add'){
				$(_obj).find('.heart').addClass('like');
				$(_obj).parents('.grid').find('.likenum').text(parseInt($(_obj).data('count'))+1);
				$(_obj).data('count',parseInt($(_obj).data('count'))+1)
				showtip('success','成功添加喜欢。');
				}
			else {
				$(_obj).find('.heart').removeClass('like');
				$(_obj).parents('.grid').find('.likenum').text(parseInt($(_obj).data('count'))-1);
				$(_obj).data('count',parseInt($(_obj).data('count'))-1)
				showtip('success','成功取消喜欢。');
				}
			} else {
				showtip('error',resultData.error);
				}
		});
	}

//提交照片评论
function addPhotoComment(_id,_from,_to){
	content=document.getElementById(_from).value;
	tar=document.getElementById(_to);
	if(!trim(content,1)){
		showtip('error','别那么懒，还是先写点什么吧！');
		return;
	}
	var pub_content=getCookie('pub_content');
	var pub_count=parseInt(getCookie('pub_count'));
	var pub_time=getCookie('pub_time');
	if(unescape(pub_content)!=null && unescape(pub_content)==content){
		showtip('error','请不要发表重复内容的留言！');
		return;
		}

	$.ajax({
	url: "/photocomment/",
	type: "POST",
	data: {album:_id, content:content, action:'add'},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			template=$(initPhotoCommentTemplate(resultData)).css('display','none');
			$(tar).prepend(template);
			$(tar).find('.message:first').slideDown('fast');
			document.getElementById(_from).value='';
			setCookie('pub_content',content,'h24');
				if(pub_time==null){
					setCookie('pub_count',1,'h24');
					setCookie('pub_time','Y','s60');
				} else 
					setCookie('pub_count',pub_count+1,'h24');
			}
			else
			showtip('error',resultData.error);
		});
	}

//删除留言
function delPhotoComment(_obj,_id,_album){
	$.ajax({
	url: "/photocomment/",
	type: "POST",
	data: {id:_id, album:_album, action:'del'},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			$(_obj).parents('.message:first').slideUp('fast',function(){$(this).remove()});
			showtip('success','成功删除留言。');
			}
			else
			showtip('error',resultData.error);
		});
	}
//回复主留言
function replyPhotoComment(_obj){
	$('#comment_input').val('@'+_obj+':');
	$("html").animate({'scrollTop': $(".album-comments").offset().top+'px'}, 600,function(){$('#comment_input').focus();});
	}
	
//初始化照片评论模板
function initPhotoCommentTemplate(jsonData){
	var template='<div class="message line-bottom">'
	+'<a data-uid="{0}" class="userinfolink pull-left" href="/{1}/"><img src="/media/images/grey.gif" onLoad="getGravatar(this,\'{2}\',{3},50)" /></a>'
	+'<div class="message-body">'
	+'<p class="message-heading clearfix muted font12"><span class="pull-left">{4}</span><span class="pull-right"><i class="del_btn hide"><a onclick="delPhotoComment(this,{5},{6})" href="javascript:void(0);">删除</a> | </i><a  onclick="replyPhotoComment(\'{7}\')" href="javascript:void(0);">回复</a></span></p>'
	+'<a href="/{1}/" target="_blank"> {7}:</a>'
	+'{8} </div></div>'
	template=template.format(
	jsonData.record.uid,
	jsonData.record.username,
	jsonData.record.gravatar,
	jsonData.record.sex,
	jsonData.record.date,
	jsonData.record.id,
	jsonData.record.album,
	jsonData.record.nickname,
	paraShare(jsonData.record.content)
	);
	return template;
	}

//提交签到
function addSign(_from,_to){
	var content=document.getElementById(_from).value;
	var tar=document.getElementById(_to);
	var _mood=$('.sign_panel').data('id');
	if(!trim(content,1)){
		showtip('error','别那么懒，还是先写点什么吧！');
		return;
	}
	var pub_content=getCookie('pub_content');
	var pub_count=parseInt(getCookie('pub_count'));
	var pub_time=getCookie('pub_time');
	if(unescape(pub_content)!=null && unescape(pub_content)==content){
		showtip('error','请不要发表重复内容的留言！');
		return;
		}
	if(pub_time!=null && pub_count!=null && pub_count>=5){
		showtip('error','你发留言的速度过快，请休息会再试！');
		return;
		}
	$.ajax({
	url: "/signprocess/",
	type: "POST",
	data: {mood:_mood, content:content, action:'add'},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			template=$(initSignTemplate(resultData));
			$(tar).prepend(template);
			if(resultData.xibi)			
			showtip('success','签到成功，喜币 +'+resultData.xibi_num);
			else
			showtip('success','签到成功');
			$('.ck-count-num').text(resultData.record.signdays);
			$('.QD-sign-count').text(resultData.record.signcount);
			$('.QD-xibi-count').text(resultData.record.XB);
			$('#signlistbtn').click();
			document.getElementById(_from).value='';
			setCookie('pub_content',content,'h24');
				if(pub_time==null){
					setCookie('pub_count',1,'h24');
					setCookie('pub_time','Y','s60');
				} else 
					setCookie('pub_count',pub_count+1,'h24');
			}
			else
			showtip('error',resultData.error);
		});
	}

//删除签到
function delSign(_obj,_id){
	$.ajax({
	url: "/signprocess/",
	type: "POST",
	data: {id:_id, action:'del'},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			$(_obj).parents('li:first').slideUp('fast',function(){$(this).remove()});
			showtip('success','成功删除签到。');
			}
			else
			showtip('error',resultData.error);
		});
	}

//初始化签到显示模板
function initSignTemplate(jsonData){
	var template='<li class="clearfix line-bottom">'
	+'<div class="pull-left moodimg"><img src="/media/images/mood/{0}" alt="{1}" title="{1}"></div>'
	+'<div class="pull-left moodtext"><span style=" display:block" class="clearfix"><span class="font12 muted pull-left">{2}</span><span class="pull-right font12"><a onclick="delSign(this,{3})" href="javascript:void(0);">删除</a></span></span><p>签到: <span>{4}</span></p><p class="quote-l"><span class="quote-r">{5}</span></p></div>'
	+'</li>';
	template=template.format(
	jsonData.record.file,
	jsonData.record.name,
	jsonData.record.date,
	jsonData.record.id,
	paraShare(jsonData.record.content),
	jsonData.record.description
	);
	return template;
	}

//隐藏签到面板
function hideSignPanel(){
	$('.sign_panel').animate({'top':310+'px'});
	}
//显示签到面板
function showSignPanel(_obj){
	$('.sign_panel').find('.stamp_img img').prop('src',$(_obj).data('img'));
	$('.sign_panel').find('.sign_panel_title').text($(_obj).data('name'));
	$('.sign_panel').find('.sign_panel_description').text($(_obj).data('info'));
	$('.sign_panel').data('id',$(_obj).data('id'));
	$('.sign_panel').animate({'top':'15px'});
	}

	
//获取主机名
function getHost(url)
{
var host = "null";
if(typeof url == "undefined"|| null == url)
{
    url = window.location.href;
}
   var regex = /.*\:\/\/([^\/]*).*/;
var match = url.match(regex);
if(typeof match != "undefined" && null != match)
{
    host = match[1];
}
return host;
}

//分享信息初始化
function initShare(title,desc,url,pic){	
	jiathis_config.title = title;	
	jiathis_config.url=url;		
	jiathis_config.summary=desc;
	jiathis_config.pic=pic;	 
	}
//显示分享面板
function showSharePanel(_obj){
	$("#shareBtn").css({"left":$(_obj).offset().left+23+"px","top":$(_obj).offset().top-7+"px"});
	$("#shareBtn").show();
	}

//随机获取非好友用户
function refreshUser(_number){
	$.ajax({
	url: "/getrandomuser/",
	type: "POST",
	data: {number:_number},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.items.length==0)
		return;
		$('.user-list').empty();
		for(var data in resultData.items){
			content=$(initRefreshUserTemplate(resultData.items[data],data)).css('display','none');			
			$('.user-list').append(content);
			$('.user-list').find('.message').fadeIn();
			}
		});
	}
	
//初始化非好友用户列表
function initRefreshUserTemplate(jsonData,n){
	var template='<div class="message line-bottom">'
	+'<a data-uid="{0}" class="userinfolink pull-left" href="/{1}/"><img src="{2}" alt="{3}" width="30" height="30"></a>'
	+'<div class="message-body">'
	+'<p class="message-heading clearfix"><span class="pull-left name ellipsis"><a data-uid="{0}" class="userinfolink normal" href="/{1}/">{3}</a></span>{4}<span class="pull-right"><a class="btn btn-mini font12" onclick="Follow(this,\'{0}\',\'add2\')" href="javascript:void(0);">关注</a></span></p>'
	+'<p class="muted ellipsis">{5}</p>'
	+'</div></div>';
	template=template.format(
	jsonData.uid,
	jsonData.username,
	setGravatar(jsonData.gravatar,jsonData.sex,30),
	jsonData.nickname,
	setUserGrade(jsonData.userjf),
	replaceEmot(jsonData.xinqing)
	);
	return template;
	}


//删除单条消息
function delMsg(_obj,_id){
	$.ajax({
	url: "/delmsg/",
	type: "POST",
	data: {id:_id},
	dataType: 'html',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData=="Y"){
			$(_obj).parents('li:first').slideUp('fast',function(){$(this).remove()});
			showtip('success','成功删除消息。');
			}
			else
			showtip('error','删除失败，无权限操作。');
		});
	}
//删除本页消息记录
function delAllMsg(){
	if(confirm('删除消息将不可恢复，确定要删除?'))
	$('#delAllForm').submit();
	else
	return;
	}

//发送私信
function sendLetter(_obj,_to){
	var nickname=$('#letter-nickname').val();
	var content=$('#letter-text').val();
	if(!trim(nickname,1)){
		showtip('error','请输入用户昵称');
		return;
	}
	if(!trim(content,1)){
		showtip('error','别那么懒，还是先写点什么吧！');
		return;
	}
	var pub_content=getCookie('pub_content');
	var pub_count=parseInt(getCookie('pub_count'));
	var pub_time=getCookie('pub_time');
	if(unescape(pub_content)!=null && unescape(pub_content)==content){
		showtip('error','请不要发送重复内容的私信！');
		return;
		}
	if(pub_time!=null && pub_count!=null && pub_count>=5){
		showtip('error','你发私信的速度过快，请休息会再试！');
		return;
		}
	$.ajax({
	url: "/letterprocess/",
	type: "POST",
	data: {nickname:nickname, content:content, action:'add'},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			$('#Letter').modal('hide');
			_tar=$(_to);
			if (_tar.length>0){
			template=$(initLetterTemplate(resultData));
			template.css('display','none');
			$(_tar).prepend(template);
			_tar.find('.message:first').slideDown('fast');
			}
			showtip('success','私信发送成功！');			
			setCookie('pub_content',content,'h24');
				if(pub_time==null){
					setCookie('pub_count',1,'h24');
					setCookie('pub_time','Y','s60');
				} else 
					setCookie('pub_count',pub_count+1,'h24');
			}
			else
			showtip('error',resultData.error);
		});	
	}

//删除单条私信
function delLetter(_obj,_id){
	$.ajax({
	url: "/letterprocess/",
	type: "POST",
	data: {id:_id, action:'del'},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			$(_obj).parents('.message:first').slideUp('fast',function(){$(this).remove()});
			showtip('success','成功删除该条对话。');
			}
			else
			showtip('error',resultData.error);
		});
	}

//删除私信对话
function delLetterBox(_obj,_uid){
	$(_obj).parents('li:first').unbind('click');
	if(confirm('删除对话内容将不可恢复，确定要删除?')){
		$.ajax({
		url: "/letterprocess/",
		type: "POST",
		data: {uid:_uid, action:'del'},
		dataType: 'json',
		timeout: 10000
		}).done(function(resultData) {
			if(resultData.data=="Y"){
				$(_obj).parents('li:first').slideUp('fast',function(){$(this).remove()});
				showtip('success','成功删除私信对话。');
				}
				else
				showtip('error',resultData.error);
			});
		} else {
			$(_obj).parents('li:first').bind('click',function(){goLetterBox(this)});
			}
	}

//删除本页所有私信
function delAllLetter(){
	if(confirm('删除私信列表将不可恢复，确定要删除?'))
	$('#delAllForm').submit();
	else
	return;
	}

//删除本页所有私信对话
function delAllLetterBox(){
	if(confirm('删除对话内容将不可恢复，确定要删除?'))
	$('#delAllForm').submit();
	else
	return;
	}

//美化照片
function photograph(_obj,file){
	letDivCenter($('.mhpanel'))
	$('.mhpanel').show();
	xiuxiu.embedSWF("photographRec",1,"100%","520px");
       /*第1个参数是加载编辑器div容器，第2个参数是编辑器类型，第3个参数是div容器宽，第4个参数是div容器高*/
	xiuxiu.setUploadURL("http://"+getHost(document.URL)+"/meihua_photo/");//修改为您自己的上传接收图片程序
	xiuxiu.setUploadType(2);
	xiuxiu.setUploadDataFieldName ('Filedata','photographRec');
	xiuxiu.onInit = function ()
	{
		xiuxiu.loadPhoto('http://'+getHost(document.URL)+file+'?random='+Math.random()*10000);
	}	
	xiuxiu.onBeforeUpload = function (data, id)
	{
	  var size = data. size;
	  if(size > 5 * 1024 * 1024)
	  { 
		showtip('error','上传图片最大不能超过5M！'); 
		return false; 
	  }
	  return true; 
	}
	xiuxiu.onDebug = function (data)
	{
		alert("错误响应" + data);
	}
	xiuxiu.onUploadResponse = function (data)
	{
		photo_file= eval('(' + data + ')').save_name;
		file='/media/upload/images/thumb/'+photo_file;
		$(_obj).parents('.thumbnail,.photothumb').find('img').prop('src',file+'?random='+Math.random()*10000);
		$('.mhpanel').hide();
		$('.mhpanel').html('<div class="popover-content" id="photographRec"></div>');
		showtip('success','美化图片上传成功。'); 
	};
	xiuxiu.onClose = function (id)
{
	$('.mhpanel').hide();
	$('.mhpanel').html('<div class="popover-content" id="photographRec"></div>');
}
}

//上传及美化照片
function photo_upload_meihua(_obj){
	var add=$(_obj).data('add');
	letDivCenter($('.mhpanel'))
	$('.mhpanel').show();
	xiuxiu.embedSWF("photographRec",1,"100%","520px");
       /*第1个参数是加载编辑器div容器，第2个参数是编辑器类型，第3个参数是div容器宽，第4个参数是div容器高*/
	if(add=='1')
	xiuxiu.setUploadURL("http://"+getHost(document.URL)+"/meihua_photo/");//修改为您自己的上传接收图片程序
	else
	xiuxiu.setUploadURL("http://"+getHost(document.URL)+"/upload_photo/");//修改为您自己的上传接收图片程序
	xiuxiu.setUploadType(2);
	xiuxiu.setUploadDataFieldName ('Filedata','photographRec');
	xiuxiu.onInit = function ()
	{
		if(add=='1'){
		file=$(_obj).find('img').prop('src');
		xiuxiu.loadPhoto(file+'?random='+Math.random()*10000);
		}
	}	
	xiuxiu.onBeforeUpload = function (data, id)
	{
	  var size = data. size;
	  if(size > 5 * 1024 * 1024)
	  { 
		showtip('error','上传图片最大不能超过5M！'); 
		return false; 
	  }
	  return true; 
	}
	xiuxiu.onDebug = function (data)
	{
		alert("错误响应" + data);
	}
	xiuxiu.onUploadResponse = function (data)
	{
		photo_file= eval('(' + data + ')').save_name;
		file='/media/upload/images/thumb/'+photo_file;
		$(_obj).find('img').prop('src',file+'?random='+Math.random()*10000);
		$(_obj).data('add','1');
		$(_obj).parents('.message').data('file',photo_file);
		$('.mhpanel').hide();
		$('.mhpanel').html('<div class="popover-content" id="photographRec"></div>');
		showtip('success','美化照片上传成功。'); 
	};
	xiuxiu.onClose = function (id)
{
	$('.mhpanel').hide();
	$('.mhpanel').html('<div class="popover-content" id="photographRec"></div>');
}
}


//复制到黏贴板
function copyToClipBoard(_obj,content) {
	if(document.all){
	clipBoardContent = $(_obj).val();
	window.clipboardData.setData("Text", clipBoardContent+"\n"+content);
	return true;
	}else{
	$(_obj).select();
	return false;
	}
} 

//登出用户
function loginOut(){
	$('#loginOutForm').submit();
	}

//搜索全局
function headerSearch(type){
	key=$('.header-search-query').val();
	if(!trim(key,2)){
		showtip('error','请至少输入2位查找的关键词！');
		return;
	}
	if(type=='user')
	url='/find/?nickname='+key;
	else
	url='/home/?type='+type+'&key='+key;
	document.location.href=url;
	}

//评选用户搜索
function searchAppraise(type,keystring){
	if(!trim(keystring,2)){
		showtip('error','请至少输入2位查找的关键词！');
		return;
		}
	var url='/appraise/works/';
	var _target=changeURLPar(url,'id',request('id',1));
	_target=changeURLPar(_target,'searchtype',type);
	_target=changeURLPar(_target,'searchkey',keystring);
	document.location.href=_target;
	}

//评选用户排列
function participantSort(type){
	var url='/appraise/works/';
	var page=request('page',1);
	var searchkey=request('searchkey','');
	var searchtype=request('searchtype','');
	var _target=changeURLPar(url,'id',request('id',1));
	_target=changeURLPar(_target,'page',page);
	_target=changeURLPar(_target,'sort',type);
	_target=changeURLPar(_target,'searchtype',searchtype);
	_target=changeURLPar(_target,'searchkey',searchkey);
	document.location.href=_target;
	}

//显示评选投票面板
function showVotePanel(_obj){
	var _id=$(_obj).parents('.paticipant-item').data('id');
	$('#update_img_vertify').click();
	$('#votePanel').data('id',_id).modal('show');
	}

//检测评选活动是否可参与
function checkAppraise(_isResult,_id){
	if(_isResult){
		showtip('info','抱歉！此投票评选活动已经结束，感谢您的关注。');
		return;
		}
	document.location.href='/appraise/join/?id='+_id;
	}

//评选投票
function appraiseVote(_id,isPrize){
	var _pid=$('#votePanel').data('id');
	var vertifycode=$('#vertifycode').val();
	var votename=$('#votename').val();
	var voteidcard=$('#voteidcard').val();
	var votemobile=$('#votemobile').val();
	if(isPrize){
		if(!trim(votename,1)){
			$('#votename').focus();
			showtip('error','请输入您的真实姓名！');
			return;
			}
		if(!isCardNo(voteidcard)){
			$('#voteidcard').focus();
			showtip('error','请输入您有效的身份证号！');
			return;
			}
		if(!isTelphone(votemobile) && !ismobile(votemobile)){
			$('#votemobile').focus();
			showtip('error','请输入有效的电话或手机号,带区号请用" - "分开');
			return;
			}
		}
	if(!trim(vertifycode,4)){
	$('#vertifycode').focus();
	showtip('error','请输入4位验证码！');
	return;
	}
	$.ajax({
	url: "/appraise/",
	type: "POST",
	data: {id:_id, pid:_pid, vertifycode:vertifycode, votetype:isPrize, votename:votename, voteidcard:voteidcard, votemobile:votemobile, action:'vote'},
	dataType: 'json',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData.data=="Y"){
			$('#votePanel').modal('hide');
			$('#vertifycode').val('')
			showtip('success',resultData.error);
			}
			else
			showtip('info',resultData.error);
		});
	}
	
//显示模板设置面板
function showTemplatePanel(){
	$('#TemplatePanel').show();
	}

//设置模板样式
function setTemplate(_path,_obj){
	_tar=$('#skinCss');
	if(_tar.length<1)
		$('head').append('<link id="skinCss" href="/static/skins/'+_path+'/style.css" rel="stylesheet" type="text/css">');
	else
	_tar.prop('href','/static/skins/'+_path+'/style.css');
	$('.template-list a').removeClass('current');
	$(_obj).addClass('current');
	$('#template').val($(_obj).parent().data('template'));
	}
	
//设置个人主页封面
function setCover(_path,_obj){
	_tar=$('.other_top');
	_tar.css({'background-image':'url(/static/covers/'+_path+')'});
	$('.cover-list a').removeClass('current');
	$(_obj).addClass('current');
	$('#cover').val($(_obj).parent().data('cover'));
	}

//保存模板
function saveTemplate(){
	template_form=$('#templateForm');
	template=$('#template').val();
	cover=$('#cover').val();
	if(template=='' && cover==''){
		$('#TemplatePanel').hide();
		return;
		}
	templateForm.submit();
	}

//检测flash知否支持	
function chkFlash() {
    var isIE = (navigator.appVersion.indexOf("MSIE") >= 0);
    var hasFlash = true;
    if(isIE) {
       try{
          var objFlash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
       } catch(e) {
          hasFlash = false;
       }
    } else {
       if(!navigator.plugins["Shockwave Flash"]) {
          hasFlash = false;
       }
    }
    return hasFlash;
}

//初始化分页组件
function initPagination(currentPage,totalPage){
	var template='<ul>';
	if(currentPage==1)
	template+='<li class="disabled" title="上一页"><span>&laquo;</span></li>';
	else
	template+='<li  title="上一页"><a onclick="prevPage()" href="javascript:void(0);">&laquo;</a></li>';
	if(totalPage<=7){
		for(var i=1;i<=totalPage;i++){
			template+='<li class="page'+i+'"><a onclick="goPage('+i+')" href="javascript:void(0);">'+i+'</a></li>';
			}
		}
	else if(currentPage<=4) {
		for(var i=1;i<=6;i++){
			template+='<li class="page'+i+'"><a onclick="goPage('+i+')" href="javascript:void(0);">'+i+'</a></li>';
			}
		template+='<li><span>...</span></li>';
		template+='<li><a onclick="goPage('+totalPage+')" href="javascript:void(0);">'+totalPage+'</a></li>';
		}
	else if(currentPage<totalPage-2){
		template+='<li><a onclick="goPage(1)" href="javascript:void(0);">1</a></li>';
		template+='<li><span>...</span></li>';
		for(var i=currentPage-2;i<=currentPage+2;i++){
			template+='<li class="page'+i+'"><a onclick="goPage('+i+')" href="javascript:void(0);">'+i+'</a></li>';
			}
		template+='<li><span>...</span></li>';
		template+='<li><a onclick="goPage('+totalPage+')" href="javascript:void(0);">'+totalPage+'</a></li>';
		}
	else {
		template+='<li><a onclick="goPage(1)" href="javascript:void(0);">1</a></li>';
		template+='<li><span>...</span></li>';
		for(var i=currentPage-2;i<=totalPage;i++){
			template+='<li class="page'+i+'"><a onclick="goPage('+i+')" href="javascript:void(0);">'+i+'</a></li>';
			}
		}
	if(currentPage>=totalPage)
	template+='<li class="disabled"  title="下一页"><span>&raquo;</span></li>';
	else
	template+='<li title="下一页"><a onclick="nextPage()" href="javascript:void(0);">&raquo;</a></li>';
	template+='</ul>'
	
	$template=$(template);
	$template.find('.page'+currentPage).addClass('active');
	return $template;
	}

//滚动到页面顶部
function scrolltoTop(){
	$('body,html').animate({scrollTop:0},'slow');
	}

//检测文件是否合法
function previewImage(_obj,_subform){
	var file_str = $(_obj).val().toLowerCase();
	jpg = file_str.indexOf(".jpg"),
	jpeg = file_str.indexOf(".jpeg"),
	png = file_str.indexOf(".png");
	if(jpg>=0 || jpeg>=0 || png>=0) //检测用户选中的文件是否是jpg、jpeg、png中的一种
	{
		//文件类型正确
		$('#'+_subform).submit();
	}
	else
	{
		//文件类型错误
		showtip('error','文件类型选择错误，请选择jpg、jpeg、png格式的文件。');
		return;
	} 
}

//检测是否绑定微博账号
function tipBindAccount(_from){
	if(_from=='weibo'){
	bindURi='https://api.weibo.com/oauth2/authorize?client_id=3947945761&redirect_uri=http://hi.bxn.com/sinalogin/&response_type=code&state=authorize';
	tiptext='新浪微博账号';
	} else {
	bindURi='https://open.t.qq.com/cgi-bin/oauth2/authorize?client_id=801407614&response_type=code&redirect_uri=http://hi.bxn.com/qqlogin/&state=authorize&forcelogin=false';
	tiptext='腾讯微博账号';
	}
	if(confirm("你尚未绑定"+tiptext+"，无法使用微博同步功能，\n是否立刻去绑定？")){
		document.location.href=bindURi;
	}
	}
//同步设置及其access_token过期检测
function checkBindState(_obj,_from){
	if(_from=='weibo'){
	var bindURi='https://api.weibo.com/oauth2/authorize?client_id=3947945761&redirect_uri=http://hi.bxn.com/sinalogin/&response_type=code&state=authorize';
	var tiptext='新浪微博账号';
	} else {
	var bindURi='https://open.t.qq.com/cgi-bin/oauth2/authorize?client_id=801407614&response_type=code&redirect_uri=http://hi.bxn.com/qqlogin/&state=authorize&forcelogin=false';
	var tiptext='腾讯微博账号';
	}
	var isActive=false;
	if($(_obj).find('.active').length>0)
	isActive=true;
	$.ajax({
	url: "/checkbindstate/",
	type: "POST",
	data: {active:isActive, from:_from},
	dataType: 'html',
	timeout: 10000
	}).done(function(resultData) {
		if(resultData=="Y"){
			if(isActive)
				$(_obj).find('span').removeClass('active');
			else
				$(_obj).find('span').addClass('active');
			}
			else {
				if(confirm("你的"+tiptext+"同步状态已过期，无法使用微博同步功能，\n是否立刻更新认证？")){
					document.location.href=bindURi;
				}
			}
			
		});
	}

//向前翻页
function prevPage(){
	var page=currentpage-1;
	var url=document.URL.split('#');
	if(url.length>1)
	target=changeURLPar(url[0],'page',page)+'#'+url[1];
	else
	target=changeURLPar(url[0],'page',page)
	document.location.href=target;
	}
//向后翻页
function nextPage(){
	var page=currentpage+1;
	var url=document.URL.split('#');
	if(url.length>1)
	target=changeURLPar(url[0],'page',page)+'#'+url[1];
	else
	target=changeURLPar(url[0],'page',page)
	document.location.href=target;
	}
//转向指定页
function goPage(page){
	var url=document.URL.split('#');
	if(url.length>1)
	target=changeURLPar(url[0],'page',page)+'#'+url[1];
	else
	target=changeURLPar(url[0],'page',page)
	document.location.href=target;
	}
	
//替换表情
function replaceEmot(content){
    text=content.replace(/\[微笑\]/g, "<img src=\"/media/images/emot/微笑.gif\" title=\"微笑\" border=\"0\" alt=\"\">")
   .replace(/\[撇嘴\]/g, "<img src=\"/media/images/emot/撇嘴.gif\" title=\"撇嘴\" border=\"0\" alt=\"\">")
   .replace(/\[色\]/g, "<img src=\"/media/images/emot/色.gif\" title=\"色\" border=\"0\" alt=\"\">")
   .replace(/\[发呆\]/g, "<img src=\"/media/images/emot/发呆.gif\" title=\"发呆\" border=\"0\" alt=\"\">")
   .replace(/\[得意\]/g, "<img src=\"/media/images/emot/得意.gif\" title=\"得意\" border=\"0\" alt=\"\">")

   .replace(/\[流泪\]/g, "<img src=\"/media/images/emot/流泪.gif\" title=\"流泪\" border=\"0\" alt=\"\">")
   .replace(/\[害羞\]/g, "<img src=\"/media/images/emot/害羞.gif\" title=\"害羞\" border=\"0\" alt=\"\">")
   .replace(/\[闭嘴\]/g, "<img src=\"/media/images/emot/闭嘴.gif\" title=\"闭嘴\" border=\"0\" alt=\"\">")
   .replace(/\[睡\]/g, "<img src=\"/media/images/emot/睡.gif\" title=\"睡\" border=\"0\" alt=\"\">")
   .replace(/\[大哭\]/g, "<img src=\"/media/images/emot/大哭.gif\" title=\"大哭\" border=\"0\" alt=\"\">")

   .replace(/\[尴尬\]/g, "<img src=\"/media/images/emot/尴尬.gif\" title=\"尴尬\" border=\"0\" alt=\"\">")
   .replace(/\[调皮\]/g, "<img src=\"/media/images/emot/调皮.gif\" title=\"调皮\" border=\"0\" alt=\"\">")
   .replace(/\[呲牙\]/g, "<img src=\"/media/images/emot/呲牙.gif\" title=\"呲牙\" border=\"0\" alt=\"\">")
   .replace(/\[惊讶\]/g, "<img src=\"/media/images/emot/惊讶.gif\" title=\"惊讶\" border=\"0\" alt=\"\">")
   .replace(/\[难过\]/g, "<img src=\"/media/images/emot/难过.gif\" title=\"难过\" border=\"0\" alt=\"\">")

   .replace(/\[酷\]/g, "<img src=\"/media/images/emot/酷.gif\" title=\"酷\" border=\"0\" alt=\"\">")
   .replace(/\[冷汗\]/g, "<img src=\"/media/images/emot/冷汗.gif\" title=\"冷汗\" border=\"0\" alt=\"\">")
   .replace(/\[抓狂\]/g, "<img src=\"/media/images/emot/抓狂.gif\" title=\"抓狂\" border=\"0\" alt=\"\">")
   .replace(/\[吐\]/g, "<img src=\"/media/images/emot/吐.gif\" title=\"吐\" border=\"0\" alt=\"\">")
   .replace(/\[偷笑\]/g, "<img src=\"/media/images/emot/偷笑.gif\" title=\"偷笑\" border=\"0\" alt=\"\">")

   .replace(/\[可爱\]/g, "<img src=\"/media/images/emot/可爱.gif\" title=\"可爱\" border=\"0\" alt=\"\">")
   .replace(/\[白眼\]/g, "<img src=\"/media/images/emot/白眼.gif\" title=\"白眼\" border=\"0\" alt=\"\">")
   .replace(/\[傲慢\]/g, "<img src=\"/media/images/emot/傲慢.gif\" title=\"傲慢\" border=\"0\" alt=\"\">")
   .replace(/\[饥饿\]/g, "<img src=\"/media/images/emot/饥饿.gif\" title=\"饥饿\" border=\"0\" alt=\"\">")
   .replace(/\[困\]/g, "<img src=\"/media/images/emot/困.gif\" title=\"困\" border=\"0\" alt=\"\">")

   .replace(/\[惊恐\]/g, "<img src=\"/media/images/emot/惊恐.gif\" title=\"惊恐\" border=\"0\" alt=\"\">")
   .replace(/\[流汗\]/g, "<img src=\"/media/images/emot/流汗.gif\" title=\"流汗\" border=\"0\" alt=\"\">")
   .replace(/\[憨笑\]/g, "<img src=\"/media/images/emot/憨笑.gif\" title=\"憨笑\" border=\"0\" alt=\"\">")
   .replace(/\[大兵\]/g, "<img src=\"/media/images/emot/大兵.gif\" title=\"大兵\" border=\"0\" alt=\"\">")
   .replace(/\[奋斗\]/g, "<img src=\"/media/images/emot/奋斗.gif\" title=\"奋斗\" border=\"0\" alt=\"\">")

   .replace(/\[咒骂\]/g, "<img src=\"/media/images/emot/咒骂.gif\" title=\"咒骂\" border=\"0\" alt=\"\">")
   .replace(/\[疑问\]/g, "<img src=\"/media/images/emot/疑问.gif\" title=\"疑问\" border=\"0\" alt=\"\">")
   .replace(/\[嘘\]/g, "<img src=\"/media/images/emot/嘘.gif\" title=\"嘘\" border=\"0\" alt=\"\">")
   .replace(/\[晕\]/g, "<img src=\"/media/images/emot/晕.gif\" title=\"晕\" border=\"0\" alt=\"\">")
   .replace(/\[折磨\]/g, "<img src=\"/media/images/emot/折磨.gif\" title=\"折磨\" border=\"0\" alt=\"\">")

   .replace(/\[衰\]/g, "<img src=\"/media/images/emot/衰.gif\" title=\"衰\" border=\"0\" alt=\"\">")
   .replace(/\[骷髅\]/g, "<img src=\"/media/images/emot/骷髅.gif\" title=\"骷髅\" border=\"0\" alt=\"\">")
   .replace(/\[再见\]/g, "<img src=\"/media/images/emot/再见.gif\" title=\"再见\" border=\"0\" alt=\"\">")
   .replace(/\[擦汗\]/g, "<img src=\"/media/images/emot/擦汗.gif\" title=\"擦汗\" border=\"0\" alt=\"\">")
   .replace(/\[抠鼻\]/g, "<img src=\"/media/images/emot/抠鼻.gif\" title=\"抠鼻\" border=\"0\" alt=\"\">")

   .replace(/\[鼓掌\]/g, "<img src=\"/media/images/emot/鼓掌.gif\" title=\"鼓掌\" border=\"0\" alt=\"\">")
   .replace(/\[糗大了\]/g, "<img src=\"/media/images/emot/糗大了.gif\" title=\"糗大了\" border=\"0\" alt=\"\">")
   .replace(/\[坏笑\]/g, "<img src=\"/media/images/emot/坏笑.gif\" title=\"坏笑\" border=\"0\" alt=\"\">")
   .replace(/\[左哼哼\]/g, "<img src=\"/media/images/emot/左哼哼.gif\" title=\"左哼哼\" border=\"0\" alt=\"\">")
   .replace(/\[右哼哼\]/g, "<img src=\"/media/images/emot/右哼哼.gif\" title=\"\" border=\"0\" alt=\"\">")

   .replace(/\[哈欠\]/g, "<img src=\"/media/images/emot/哈欠.gif\" title=\"哈欠\" border=\"0\" alt=\"\">")
   .replace(/\[鄙视\]/g, "<img src=\"/media/images/emot/鄙视.gif\" title=\"鄙视\" border=\"0\" alt=\"\">")
   .replace(/\[委屈\]/g, "<img src=\"/media/images/emot/委屈.gif\" title=\"委屈\" border=\"0\" alt=\"\">")
   .replace(/\[快哭了\]/g, "<img src=\"/media/images/emot/快哭了.gif\" title=\"快哭了\" border=\"0\" alt=\"\">")
   .replace(/\[阴险\]/g, "<img src=\"/media/images/emot/阴险.gif\" title=\"阴险\" border=\"0\" alt=\"\">")

   .replace(/\[亲亲\]/g, "<img src=\"/media/images/emot/亲亲.gif\" title=\"亲亲\" border=\"0\" alt=\"\">")
   .replace(/\[吓\]/g, "<img src=\"/media/images/emot/吓.gif\" title=\"吓\" border=\"0\" alt=\"\">")
   .replace(/\[可怜\]/g, "<img src=\"/media/images/emot/可怜.gif\" title=\"可怜\" border=\"0\" alt=\"\">")
   .replace(/\[菜刀\]/g, "<img src=\"/media/images/emot/菜刀.gif\" title=\"菜刀\" border=\"0\" alt=\"\">")
   .replace(/\[西瓜\]/g, "<img src=\"/media/images/emot/西瓜.gif\" title=\"西瓜\" border=\"0\" alt=\"\">")

   .replace(/\[啤酒\]/g, "<img src=\"/media/images/emot/啤酒.gif\" title=\"啤酒\" border=\"0\" alt=\"\">")
   .replace(/\[篮球\]/g, "<img src=\"/media/images/emot/篮球.gif\" title=\"篮球\" border=\"0\" alt=\"\">")
   .replace(/\[乒乓\]/g, "<img src=\"/media/images/emot/乒乓.gif\" title=\"乒乓\" border=\"0\" alt=\"\">")
   .replace(/\[咖啡\]/g, "<img src=\"/media/images/emot/咖啡.gif\" title=\"咖啡\" border=\"0\" alt=\"\">")
   .replace(/\[饭\]/g, "<img src=\"/media/images/emot/饭.gif\" title=\"饭\" border=\"0\" alt=\"\">")

   .replace(/\[猪头\]/g, "<img src=\"/media/images/emot/猪头.gif\" title=\"猪头\" border=\"0\" alt=\"\">")
   .replace(/\[玫瑰\]/g, "<img src=\"/media/images/emot/玫瑰.gif\" title=\"玫瑰\" border=\"0\" alt=\"\">")
   .replace(/\[凋谢\]/g, "<img src=\"/media/images/emot/凋谢.gif\" title=\"凋谢\" border=\"0\" alt=\"\">")
   .replace(/\[示爱\]/g, "<img src=\"/media/images/emot/示爱.gif\" title=\"示爱\" border=\"0\" alt=\"\">")
   .replace(/\[爱心\]/g, "<img src=\"/media/images/emot/爱心.gif\" title=\"爱心\" border=\"0\" alt=\"\">")

   .replace(/\[心碎\]/g, "<img src=\"/media/images/emot/心碎.gif\" title=\"心碎\" border=\"0\" alt=\"\">")
   .replace(/\[蛋糕\]/g, "<img src=\"/media/images/emot/蛋糕.gif\" title=\"蛋糕\" border=\"0\" alt=\"\">")
   .replace(/\[闪电\]/g, "<img src=\"/media/images/emot/闪电.gif\" title=\"闪电\" border=\"0\" alt=\"\">")
   .replace(/\[炸弹\]/g, "<img src=\"/media/images/emot/炸弹.gif\" title=\"炸弹\" border=\"0\" alt=\"\">")
   .replace(/\[刀\]/g, "<img src=\"/media/images/emot/刀.gif\" title=\"刀\" border=\"0\" alt=\"\">")

   .replace(/\[足球\]/g, "<img src=\"/media/images/emot/足球.gif\" title=\"足球\" border=\"0\" alt=\"\">")
   .replace(/\[瓢虫\]/g, "<img src=\"/media/images/emot/瓢虫.gif\" title=\"瓢虫\" border=\"0\" alt=\"\">")
   .replace(/\[便便\]/g, "<img src=\"/media/images/emot/便便.gif\" title=\"便便\" border=\"0\" alt=\"\">")
   .replace(/\[月亮\]/g, "<img src=\"/media/images/emot/月亮.gif\" title=\"月亮\" border=\"0\" alt=\"\">")
   .replace(/\[太阳\]/g, "<img src=\"/media/images/emot/太阳.gif\" title=\"太阳\" border=\"0\" alt=\"\">")

   .replace(/\[礼物\]/g, "<img src=\"/media/images/emot/礼物.gif\" title=\"礼物\" border=\"0\" alt=\"\">")
   .replace(/\[拥抱\]/g, "<img src=\"/media/images/emot/拥抱.gif\" title=\"拥抱\" border=\"0\" alt=\"\">")
   .replace(/\[强\]/g, "<img src=\"/media/images/emot/强.gif\" title=\"强\" border=\"0\" alt=\"\">")
   .replace(/\[弱\]/g, "<img src=\"/media/images/emot/弱.gif\" title=\"弱\" border=\"0\" alt=\"\">")
   .replace(/\[握手\]/g, "<img src=\"/media/images/emot/握手.gif\" title=\"握手\" border=\"0\" alt=\"\">")

   .replace(/\[胜利\]/g, "<img src=\"/media/images/emot/胜利.gif\" title=\"胜利\" border=\"0\" alt=\"\">")
   .replace(/\[抱拳\]/g, "<img src=\"/media/images/emot/抱拳.gif\" title=\"抱拳\" border=\"0\" alt=\"\">")
   .replace(/\[勾引\]/g, "<img src=\"/media/images/emot/勾引.gif\" title=\"勾引\" border=\"0\" alt=\"\">")
   .replace(/\[拳头\]/g, "<img src=\"/media/images/emot/拳头.gif\" title=\"拳头\" border=\"0\" alt=\"\">")
   .replace(/\[差劲\]/g, "<img src=\"/media/images/emot/差劲.gif\" title=\"差劲\" border=\"0\" alt=\"\">")

   .replace(/\[爱你\]/g, "<img src=\"/media/images/emot/爱你.gif\" title=\"爱你\" border=\"0\" alt=\"\">")
   .replace(/\[NO\]/g, "<img src=\"/media/images/emot/NO.gif\" title=\"NO\" border=\"0\" alt=\"\">")
   .replace(/\[OK\]/g, "<img src=\"/media/images/emot/OK.gif\" title=\"OK\" border=\"0\" alt=\"\">")
   .replace(/\[敲打\]/g, "<img src=\"/media/images/emot/敲打.gif\" title=\"敲打\" border=\"0\" alt=\"\">")
   return text;
	}