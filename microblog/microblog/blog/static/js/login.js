$(function () {
//登录账号脚本
$('#id_username').attr('placeholder','用户名/邮箱');
if (typeof(valid_times) == "undefined") { 
valid_times=0;
}
$('.normal-login').click(function(){
	$('#id_ismobile').get(0).checked = false;
	$('#id_username').parents('.control-group:first').find('label').text('账号：');
	$('#id_username').attr('placeholder','用户名/邮箱');
	$(this).parent().addClass('active').next().removeClass('active');
	});
	
$('.mobile-login').click(function(){
	$('#id_ismobile').get(0).checked = true;
	$('#id_username').parents('.control-group:first').find('label').text('手机号：');
	$('#id_username').attr('placeholder','手机号码');
	$(this).parent().addClass('active').prev().removeClass('active');
	});
	
$('#submit').click(function(){
	var username=$('#id_username').val();
	var password=$('#id_password').val();
	if($('#id_ismobile').get(0).checked){
		if(!ismobile(username)){
			showtip('error','请输入有效的手机号'); 
			return false;
			}
		}
	else{
		if(!trim(username,4)){
			showtip('error','请输入用户名/邮箱'); 
			return false;
			}
		}
	if(!trim(password,1)){
		showtip('error','请输入密码'); 
		return false;
		}
	if(getCookie('valid_login')!='true' && parseInt(valid_times)<5){	
		return true; 
		}
	else if (getCookie('valid_login')!='true'){
		setCookie("valid_login","true","s120");
		return true; 
	} else {
		showtip('error','5次登录错误，请休息2分钟后尝试！'); 
		return false; 
		}
	});

//找回密码第一步确认账号脚本
$('input[name="method"]').click(function(){
	if($(this).val()=='email')
	labelText='邮件';
	else 
	labelText='手机号';
	$('#keystring').parents('.control-group:first').find('.control-label').text(labelText);
	});

$('#keystring , #code').focus(function(){
	$(this).parent().find('.tiptext').hide();
	});
$('#keystring , #code').blur(function(){
	$(this).parent().find('.tiptext').show();
	});

$('#update_img_vertify').click(function(){
	$('#img_vertify img').attr('src','/imgcode/?'+Math.random()*100000);
	});

$('#keystring').bind('blur',function(){
	result=false;
	var type=$('#getpass_form :input:radio:checked').val();
	
	if(type=='email'){
		if(isemail($(this).val())){
			
			itemOK.keystring=true;
			} else{
			result=true;
			itemOK.keystring=false;	
			}
		if(result)
		$(this).parent().find('.tiptext').text('请输入正确的邮箱地址。').removeClass('info-right').addClass('alert alert-error');
		else 
		$(this).parent().find('.tiptext').text('').removeClass('alert alert-error').addClass('info-right')
	} else {
	if(ismobile($(this).val())){
		itemOK.keystring=true;
		} else {
			result=true;
			itemOK.keystring=false;	
			}
	if(result)
	$(this).parent().find('.tiptext').text('手机号码格式不正确。').removeClass('info-right').addClass('alert alert-error');
	else 
	$(this).parent().find('.tiptext').text('').removeClass('alert alert-error').addClass('info-right')
	}
	});
	
$('#code').bind('blur',function(){
	result=false;
	if (trim($(this).val(),4)){	
		itemOK.code=true;
		} else result=true;
	if(result)
	$(this).parent().find('.tiptext').text('输入数字、字母组合的4位验证码。').removeClass('info-right').addClass('alert alert-error');
	else 
	$(this).parent().find('.tiptext').text('').removeClass('alert alert-error').addClass('info-right')
	});

$('#getpass_submit').click(function(){
	$('#keystring , #code').blur();
	var noerror=true;
	for(var i in itemOK){
		if(!itemOK[i]){
			noerror=false;
			}
		}
	return noerror;
	});

//找回密码第二步安全认证脚本
$('#getpass_config').click(function(){
$.ajax({
	url: "/getpassmessage/",
	type: "POST",
	data: { type: data.type, keystring: data.keystring },
	dataType: 'html',
	timeout: 10000		
	}).done(function(resultData) {
		if(resultData=='true'){		
		sendSucess=true;
		}
		if(data.type=='email'){
			if(sendSucess){
			email_host=data.keystring.split('@')[1];
			$('.sendtip').html('邮件发送成功，<a href="http://mail.'+email_host+'" target="_blank">进入邮箱</a>');
			} else $('.sendtip').html('邮件发送失败，稍后请重试');
		}
		else if(sendSucess)
			$('.sendtip').html('短信发送成功，请注意查收');
		else $('.sendtip').html('短信发送失败，稍后请重试');
		if(sendSucess){
			$('#getpass_config').attr("disabled","disabled");
			seconds=59;
			countDown();
			}
		})
	});
	
//找回密码第三步重置密码脚本	
$('#id_new_password1 , #id_new_password2').focus(function(){
	$(this).parent().find('.helptext').show();
	$(this).parent().find('.tiptext').hide();
	});
	
$('#id_new_password1 , #id_new_password2').blur(function(){
	$(this).parent().find('.helptext').hide();
	$(this).parent().find('.tiptext').show();
	});

$('#id_new_password1').bind('blur',function(){
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
	
$('#id_new_password2').bind('blur',function(){
	result=false;
	if (trim($(this).val(),6)){
		if($(this).val()==$('#id_new_password1').val()){
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
	
$('#setpass_submit').click(function(){
	$('#id_new_password1 , #id_new_password2').blur();
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

var seconds=59;
var speed=1000;
var sendSucess=false;
function countDown(){
	var span=$('#getpass_config');
	var txt =(seconds < 10) ? "0" + seconds : seconds;
	span.val('重新发送('+txt+')');
	seconds--;
	var timeId = setTimeout('countDown()',speed);
	if(seconds == 0){
			clearTimeout(timeId);
			span.val('重新发送');
			span.removeAttr("disabled");
	};
}


