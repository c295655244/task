// JavaScript Document
$(function (){
	$('#tagpop_bg').css({'background-color':'#000','opacity':0.5});
	$('#addedTagWrap').mousedown(function(event){event.preventDefault();$('#tagInput').focus();});
	$('#tagInput').focus(function(){$('#tagLayerWrapper').show()});
	$('#tagInput').bind('blur keydown',function(event){
		if(event.keyCode==13 || event.type=='blur'){
			var strList=trimBlank($(this).val()).split(',');
			for(var i=0;i<strList.length;i++){
				addTag(strList[i]);
			 }
		 	$(this).val('');
		 }
	});

	$('#addedTagWrap').mouseleave(function(){$('#tagLayerWrapper').hide()});
	$('#tagLayerWrapper').mouseenter(function(){$(this).show()});
	$('#tagLayerWrapper').mouseleave(function(){$(this).hide()});
	$('.album_list > li').mouseenter(function(){$(this).find('.album-date').hide(); $(this).find('.album-function').show();});
	$('.album_list > li').mouseleave(function(){$(this).find('.album-function').hide(); $(this).find('.album-date').show();});
	$('#albumName').bind('blur focus keydown keypress keyup',function(){
		if(trim($(this).val(),31))
		$(this).val($(this).val().substr(0 ,30));
		else
		$(this).parent().find('.number').text($(this).val().length);
	});
	$('#albumDescription').bind('blur focus keydown keypress keyup',function(){
		if(trim($(this).val(),201))
		$(this).val($(this).val().substr(0 ,200));
		else
		$(this).parent().find('.number').text($(this).val().length);
	});
	
//jquery 定义结尾标记	
})

//初始化新增记录表单
function initBlogForm(_action,_id,_title,_content,_tags){
	var Form=document.addBlogForm;
	Form.action.value=_action;
	Form.id.value=_id;
	Form.title.value=_title;
	tinyMCE.getInstanceById('blogContent').getBody().innerHTML=_content
	$('#addedTagWrap').find('.inner-tag-wrapper').remove();
	var strList=_tags.split(',');
	for(var i=0;i<strList.length;i++){
		addTag(strList[i]);
	 }
	$('#myModal').modal({
    	backdrop: 'static',
		keyboard:false
    })
	
}

//添加标签
function addTag(_str){
	if(trim(_str,1) && !checkTag(_str)){
		if(trim(_str,2) && !trim(_str,11)){
			var temp='<div class="inner-tag-wrapper btn btn-info btn-small"><span class="inner-tag-name">'+trimBlank(_str)+'</span> <a href="#tag" class="cloase_btn" title="删除"  onclick="$(this).parent().remove();">×</a></div>';
			$('#tagInput').before(temp);
		}else {
			showtip('error','标签应在2~10个字符');
		}
	}
}
//添加热门标签
function addHotTag(_obj){
	var str=$(_obj).text();
	addTag(str);
	}
//检查重复标签
function checkTag(str){
	var tagList=[];
	$('#addedTagWrap').find('.inner-tag-name').each(function(i){tagList.push($(this).text())});
	var result=false;
	if(tagList.length>=10){
		result=true;
		return result;
	}
	for(var i in tagList){
		if(str==tagList[i]){
			result=true;
			break;
		}
	}
	return result;
}

//解析博客标签
function paraTags(_tar,tagstring){
	var result='';
	if(tagstring!=''){
		var taglist=tagstring.split(',');
		for(var i in taglist){
			result+='<a class="tag" href="/tag/'+taglist[i]+'/">#'+taglist[i]+'</a>';
		}
	}
	$(_tar).parent().html(result);
}

//解析博客标签--手机版
function paraMobileTags(_tar,tagstring){
	var result='';
	if(tagstring!=''){
		var taglist=tagstring.split(',');
		for(var i in taglist){
			result+='<a class="tag" href="/mobile/tag/'+taglist[i]+'/">#'+taglist[i]+'</a>';
		}
	}
	$(_tar).parent().html(result);
}
//检查博客发布表单
function checkBlogForm(){
	tinyMCE.triggerSave();
	var Form=document.addBlogForm;
	var title=Form.title.value;
	var content=tinyMCE.getInstanceById('blogContent').getBody().innerHTML
	Form.blogContent.value=content;
	var tagList=[];
	$('#addedTagWrap').find('.inner-tag-name').each(function(i){tagList.push($(this).text())});
	Form.tags.value=tagList.join(',');
	if(!trim(title,1)){
		showtip('error','请输入记录标题');
		return false;
	}
	if(!trim(content,1)){
		showtip('error','请输入记录内容');
		return false;
	}
	return true;
	}

//初始化编辑器
function initBlogEditor(){
	tinyMCE.init({
	"theme_advanced_toolbar_location": "top", 
	"theme_advanced_toolbar_align": "left", 
	"elements": "blogContent", 
	"theme_advanced_buttons2": "cut,copy,paste,pastetext,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,|,insertdate,inserttime,preview,|,forecolor,backcolor",
	"language": "zh", 
	"theme_advanced_buttons1": "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect,fullscreen,code",
	"theme_advanced_resizing": true, 
	"theme_advanced_buttons3": "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl",
	"theme_advanced_statusbar_location": "bottom", 
	"theme": "advanced", 
	"strict_loading_mode": 1, 
	"directionality": "ltr", 
	"plugins": "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave", 
	'relative_urls' : false,
	"width": 700, 
	"height": 400, 
	"mode": "exact"});
	}


//获取博客内容
function editblog(id){
	$.ajax({
		url: "/myblog/",
		type: "POST",
		data: {id:id, action:'get'},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			initBlogForm('edit',id,resultData.title,resultData.content,resultData.tags)
		});
	}

//获取博客内容
function jingblog(_obj){
	_tar=$(_obj).parents('.message:first');
	id=_tar.data('id');
	$.ajax({
		url: "/myblog/",
		type: "POST",
		data: {id:id, action:'jing'},
		dataType: 'html',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData=='Y'){
				if($(_obj).text()=='取消精'){
					$(_obj).text('精');
					showtip('success','取消精选成功！');
				} else {
					$(_obj).text('取消精');
					showtip('success','加精选成功！');
				}
			} else
				showtip('error','加精选失败，没有权限！');	
		});
	}

//删除博客内容
function delblog(_obj){
	_tar=$(_obj).parents('.message:first');
	id=_tar.data('id');
	$.ajax({
		url: "/myblog/",
		type: "POST",
		data: {id:id, action:'del'},
		dataType: 'html',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData=='Y'){
				showtip('success','记录删除成功！');
				_tar.slideUp(function(){$(this.remove())});
			}else{
				showtip('error','删除失败，没有权限！');	
			}
		});
	}

//博客评论回复框
function blogcommentrec(id){
	var template='<div class="reply-comment-rec" style="background-color:transparent;"><hr style="margin-bottom:10px;"/>';
	template+='<textarea rows="1" class="reply-comment-text input-block-level"  title="评价内容" placeholder="请输入评价内容"></textarea>';
	template+='<div class="row-fluid">';
	template+='<div class="span1"><a class="W_icon icon_emot" title="插入表情" onclick="replyCommentEmotPanel(this)" href="javascript:void(0);">表情</a></div>';
	template+='<div class="pull-right"><button type="button" class="btn btn-small" onclick="saveBlogComment(this)">发 布</button></div>';
	template+='</div>';
	template+='</div>';
	$template=$(template);
	$template.data('id',id);
	return 	$template;
	}

//博客回复框
function blogComment(_obj){
	_tar=$(_obj).parents('.popover-content:first');
	if(_tar.find('.reply-comment-rec').length>0){
	_tar.find('.reply-comment-rec').remove();
	}
	else {
	var blog_id=_tar.data('id');	
	_tar.append(blogcommentrec(blog_id)).show();
	_tar.find(".reply-comment-text").focus().autoTextarea({
			maxHeight:1000 //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
			});
	}
	}

//手机博客回复框
function mobileBlogComment(_obj){
	_tar=$(_obj).parents('.popover-content:first');
	if(_tar.find('.reply-comment-rec').length>0){
	_tar.find('.reply-comment-rec').remove();
	}
	else {
	var blog_id=_tar.data('id');	
	_tar.append(blogcommentrec(blog_id)).show();
	}
	}

//保存博客评论
function saveBlogComment(_obj){
	var _tar=$(_obj).parents('.reply-comment-rec:first');
	var _text=_tar.find('.reply-comment-text').val();
	var _blogid=_tar.data('id');
	if(!trim(_text,1)){
		showtip('info','亲，先写点什么再发表评论吧！');
		return;
	}
	var pub_content=getCookie('pub_content');
	var pub_count=parseInt(getCookie('pub_count'));
	var pub_time=getCookie('pub_time');
	if(unescape(pub_content)!=null && unescape(pub_content)==_text){
		showtip('error','请不要发表重复内容的评论！');
		return;
		}
	if(pub_time!=null && pub_count!=null && pub_count>=5){
		showtip('error','你发评论的速度过快，请休息会再试！');
		return;
		}
	$.ajax({
		url: "/blogcomment/",
		type: "POST",
		data: { content:_text, id:_blogid, action:'add'},
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData.data=="Y"){
			showtip('success','成功发布你的评论！');
			$tarCommentList=_tar.find('.comment-list');
			if($tarCommentList.length<1){
				$tarNumber=$(_obj).parents('.popover-content').find('.blog_comment_number');
				_tar.remove();
			} else {
				$('#message_input').val('');
				$tarNumber=$('.blog_comment_number');
				template=$(initBlogCommentTemplate(resultData.item)).css('display','none');
				$('.comment-list').prepend(template).find('.message:first').slideDown('fast');
				}
			$tarNumber.text(parseInt($tarNumber.text())+1)
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


//初始化博客评论模板
function initBlogCommentTemplate(jsonData){
	var template='<div class="message line-bottom clearfix">'
	+'<a data-uid="{0}" class="userinfolink pull-left" style="width:30px;" href="/{1}/"><img src="/media/images/grey.gif" onLoad="getGravatar(this,\'{2}\',{3},{4})" /></a>'
	+'<div class="message-body">'
	+'<p><a href="/{1}/" target="_blank">{5}</a>: {6}</p>'
	+'<p class="message-heading clearfix muted font12"><span class="pull-left">{7}</span><span class="pull-right"><i class="del_btn hide"><a onclick="delBlogComment(this,{8})" href="javascript:void(0);">删除</a> | </i><a onclick="replyBlogComment(\'{5}\')" href="javascript:void(0);">回复</a></span></p>'
	+'</div></div>'
	template=template.format(
	jsonData.uid,
	jsonData.username,
	jsonData.gravatar,
	jsonData.sex,
	30,
	jsonData.nickname,
	paraShare(jsonData.content),
	jsonData.date,
	jsonData.id
	);
	return template;
	}

function replyBlogComment(_nickname){
	$('#message_input').val('@'+_nickname+' ');
	$("html").animate({'scrollTop': $("#tab").offset().top+'px'}, 600,function(){$('#message_input').focus();});
	}
function delBlogComment(_obj,_id){
	$.ajax({
		url: "/blogcomment/",
		type: "POST",
		data: {id:_id, action:'del'},
		dataType: 'html',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData=="Y"){
				showtip('success','评论删除成功！');
				$(_obj).parents('.message:first').slideUp('fast',function(){$(this).remove()});
			} else {
				showtip('error','删除失败，没有权限！');
			}
		})
}