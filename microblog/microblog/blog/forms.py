#coding=utf-8
from django.shortcuts import render,render_to_response
import re
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django import forms
from microblog.blog.models import *


#定义表单模型
class UserForm(forms.Form):
    username = forms.CharField(label='用户名：',max_length=100)
    password = forms.CharField(label='密码：',widget=forms.PasswordInput())

class RegistrationForm(forms.Form):
    CHOICES = (
        ("男", '男'),
        ("女", '女'),
    )
    userlogin = forms.CharField(label='登陆名', max_length=20)
    sex = forms.ChoiceField(label='性别',choices=CHOICES) 
    password1 = forms.CharField(label='密码', widget=forms.PasswordInput())
    password2 = forms.CharField(label='确认密码', widget=forms.PasswordInput())
    username = forms.CharField(label='昵称', max_length=20)
    email = forms.EmailField(label='电子邮箱', required=False)
    def clean_username(self):
        username = self.cleaned_data['username']
        if not re.search(u'^[\u4e00-\u9fa5 _ a-zA-Z0-9]+$', username):
            raise forms.ValidationError(username)
        try:
            t_user_info.objects.get(user_name=username)
        except ObjectDoesNotExist:
            return username
        raise forms.ValidationError('此用户名已存在！')
    
    # def clean_email(self):
    #     email = self.cleaned_data['email']
    #     try:
    #         t_user_info.objects.get(user_mail=email)
    #     except ObjectDoesNotExist:
    #         return email
    #     raise forms.ValidationError('此电子邮箱已存在！')
    def clean_password2(self):
        if 'password1' in self.cleaned_data:
            password1 = self.cleaned_data['password1']
            password2 = self.cleaned_data['password2']
            if password1 == password2:
                return password2
            raise forms.ValidationError('两次输入的密码不相同！')
