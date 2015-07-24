$(function () {
//register.html
$('#id_sex_0').click();
$('#id_username').parent().find('.helptext').show();
$('#id_mobile , #id_code').css({'width':'90px'});
$('#get_code').click(function(){
//jquery 定义开始标记	
	if(getcode_btn_state){
		if(!ismobile($('#id_mobile').val())){
			showtip('error','请输入一个正确的手机号码。'); 
			$('#id_mobile').select();
		} else {
			checkDuplicate($('#id_mobile').val(),'mobile','mobile',true);
			}
	}
})

$('#id_username , #id_password1 , #id_password2 , #id_nickname , #id_email , #id_mobile , #id_code , #init_nickname , #init_username , #init_password , #init_password_config').focus(function(){
	$(this).parent().find('.helptext').show();
	$(this).parent().find('.tiptext').hide();
	});
	
$('#id_username , #id_password1 , #id_password2 , #id_nickname , #id_email , #id_mobile , #id_code , #init_nickname , #init_username , #init_password , #init_password_config').blur(function(){
	$(this).parent().find('.helptext').hide();
	$(this).parent().find('.tiptext').show();
	});
	
$('#id_username').bind('blur',function(){
	result=false;
	if (trim($(this).val(),4)){
		if(isEorD($(this).val())){
			checkDuplicate($(this).val(),'username','username',false);
			} else result=true;
		} else {
			result=true;
			itemOK.username=false;
			}
	if(result)
	$(this).parent().find('.tiptext').text('可输入4-30位，包含英文和数字').removeClass('info-right').addClass('alert alert-error');
	else 
	$(this).parent().find('.tiptext').text('').removeClass('alert alert-error');
	});

$('#id_password1').bind('blur',function(){
	result=false;
	if (trim($(this).val(),6)){
		itemOK.password1=true;
		} else {
			result=true;
			itemOK.password1=false;
			}
	if(result)
	$(this).parent().find('.tiptext').text('密码由6-16位（字符、数字、符号）组成，区分大小写').removeClass('info-right').addClass('alert alert-error')
	else 
	$(this).parent().find('.tiptext').text('').removeClass('alert alert-error').addClass('info-right')
	});

$('#id_password2').bind('blur',function(){
	result=false;
	if (trim($(this).val(),6)){
		if($(this).val()==$('#id_password1').val()){
			itemOK.password2=true;
			} else result=true;
		} else {
			result=true;
			itemOK.password2=false;
			}
	if(result)
	$(this).parent().find('.tiptext').text('两次输入的用户密码不相同，请仔细核对。').removeClass('info-right').addClass('alert alert-error')
	else 
	$(this).parent().find('.tiptext').text('').removeClass('alert alert-error').addClass('info-right')
	});

$('#id_nickname').bind('blur',function(){
	result=false;
	if (trim($(this).val(),2)){
		if(isCEDorF($(this).val())){
			checkDuplicate($(this).val(),'nickname','nickname',false);
			} else result=true;
		} else {
			result=true;
			itemOK.nickname=false;
			}
	if(result)
	$(this).parent().find('.tiptext').text('可输入2-30位，包含中英文、数字和符号（_.@+-）').removeClass('info-right').addClass('alert alert-error')
	else 
	$(this).parent().find('.tiptext').text('').removeClass('alert alert-error')
	});
	
$('#id_email').bind('blur',function(){
	result=false;
	if (trim($(this).val(),3)){
		if(isemail($(this).val())){
			checkDuplicate($(this).val(),'email','email',false);
			} else result=true;
		} else {
			result=true;
			itemOK.email=false;
			}
	if(result)
	$(this).parent().find('.tiptext').text('请输入正确的邮箱地址。').removeClass('info-right').addClass('alert alert-error')
	else 
	$(this).parent().find('.tiptext').text('').removeClass('alert alert-error')
	});

$('#id_mobile').bind('blur',function(){
	result=false;
	if (trim($(this).val(),11)){
		if(ismobile($(this).val())){
			checkDuplicate($(this).val(),'mobile','mobile',false);
			} else result=true;
		} else {
			result=true;
			itemOK.mobile=false;
			}
	if(result)
	$(this).parent().find('.tiptext').text('手机号码格式不正确。').removeClass('info-right').addClass('alert alert-error')
	else 
	$(this).parent().find('.tiptext').text('').removeClass('alert alert-error')
	});

$('#id_code').bind('blur',function(){
	result=false;
	if (trim($(this).val(),6)){	
		itemOK.code=true;
		} else {
			result=true;
			itemOK.code=false;
			}
	if(result)
	$(this).parent().find('.tiptext').text('输入数字、字母组合的6位手机短信验证码。').removeClass('info-right').addClass('alert alert-error')
	else 
	$(this).parent().find('.tiptext').text('').removeClass('alert alert-error').addClass('info-right')
	});

$('#register_submit').click(function(){
	$('#id_username , #id_password1 , #id_password2 , #id_nickname , #id_email , #id_mobile , #id_code').blur();
	var noerror=true;
	for(var i in itemOK){
		if(!itemOK[i]){
			noerror=false;
			}
		}
	return noerror;
	});
	
//jquery 定义结尾标记	
})

//验证数据是否可以注册
function checkDuplicate(arg1,arg2,_tar,mobile){
var container=$('#id_'+_tar).parent().find('.tiptext');
$.ajax({
	url: "/api/checkuser/",
	type: "POST",
	data: { data: arg1, action: arg2 },
	dataType: 'html',
	timeout: 10000		
	}).done(function(resultData) {
		if(resultData=='Y'){
			if(_tar=='username')
			itemOK.username=true;
			if(_tar=='nickname')
			itemOK.nickname=true;
			if(_tar=='email')
			itemOK.email=true;
			if(_tar=='mobile')
			itemOK.mobile=true;
			if(mobile){
				$.ajax({
				url: "/getcode/",
				type:'POST',
				data: {mobil:$('#id_mobile').val(), action:'register'},
				dataType: 'json',
				timeout: 10000		
				}).done(function(resultData) {
					if(resultData.count<6){
					getcode_btn_state=false;
					seconds=59;
					countDown();
					} else {
						showtip('error','同一手机号24小时内最多获取5次验证码');
						}
				})
			}			
			container.removeClass('alert alert-error').addClass('info-right')
		} else {
			container.removeClass('info-right').addClass('alert alert-error')
			if(_tar=='username'){
			container.text('此用户名已被注册，请输入其它名称。');
			itemOK.username=false;
			}
			if(_tar=='nickname'){
			container.text('此昵称已被注册，请输入其它昵称。');
			itemOK.nickname=false;
			}
			if(_tar=='email'){
			container.text('此邮箱已被注册，请输入其它邮箱。');
			itemOK.email=false;
			}
			if(_tar=='mobile'){
			container.text('此手机号码已被注册，请输入其它手机号码。');
			itemOK.mobile=false;
			}
			}		
		});
}

var seconds=59;
var speed=1000;
var itemOK={'username':false,'password1':false,'password2':false,'nickname':false,'email':false,'mobile':false,'code':false};
var getcode_btn_state=true;
function countDown(){
	var span=$('#get_code')
	var txt =(seconds < 10) ? "0" + seconds : seconds;
	span.text('('+txt+'秒后)重新获取验证码');
	seconds--;
	var timeId = setTimeout('countDown()',speed);
	if(seconds == 0){
			clearTimeout(timeId);
			span.text('免费获取验证码');
			getcode_btn_state=true;
	};
}

function BindId(){
	_tar=document.bindForm;
	_username=_tar.id_username.value;
	_password=_tar.id_password.value;
	_isgravatar=_tar.isgravatar.checked;
	_from=_tar.from.value;
	queryData=$.extend({}, {username:_username, password:_password, isgravatar:_isgravatar, from:_from},userdata);
	if(!trim(_username,4) || !trim(_password,6)){
		showtip('error','请输入有效的用户名和密码。');
		return;
		}
	$.ajax({
		url: "/bindaccount/",
		type:'POST',
		data: queryData,
		dataType: 'html',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData=='Y')
				document.location.href='/home/';
			else {
				_tar.id_username.value='';
				_tar.id_password.value='';
				_tar.id_username.focus();
				showtip('error','你输入的用户或密码错误，请重新输入。');
			}
		})
	}

function newAndBindAccount(){
	_tar=document.newuserForm;
	_username=_tar.init_username.value;
	_nickname=_tar.init_nickname.value;
	_password=_tar.init_password.value;
	_passwordConfig=_tar.init_password_config.value;
	_from=_tar.from.value;
	queryData=$.extend({}, {username:_username, password:_password, nickname:_nickname, from:_from},userdata);
	if(!trim(_nickname,2)){
		showtip('error','请输入用户昵称。');
		_tar.init_nickname.focus();
		return;
		}
	if(!trim(_username,4) || !trim(_password,6)){
		showtip('error','请输入有效的用户名和密码。');
		_tar.init_username.focus();
		return;
		}
	if(_password!=_passwordConfig){
		showtip('error','两次输入的密码不一致，请重新输入。');
		_tar.init_password.value=_tar.init_password_config.value='';
		_tar.init_password.focus();
		return;
		}
	$.ajax({
		url: "/new_bind_account/",
		type:'POST',
		data: queryData,
		dataType: 'json',
		timeout: 10000		
		}).done(function(resultData) {
			if(resultData.data=='Y')
				document.location.href='/set/index/';
			else {
				showtip('error',resultData.error);
			}
		})
	}