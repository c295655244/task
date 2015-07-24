 #coding=utf-8

"""microblog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""

from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic.list import  ListView
from microblog.blog  import models
from django.views.generic import TemplateView
from django.contrib.auth.views import *
from blog.views import *

admin.autodiscover()


urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', home),
    url(r'^home/$', home),
    url(r'^login/$', user_login),
    url(r'^logout/$', logout,{'next_page':'/login/'}),
    url(r'^accounts/login/$', user_login),
    url(r'^register/$', register),
    url(r'^saveshare/$', saveshare),
    url(r'^delshare/$', delshare),     
    url(r'^fetchshares/$', fetchshares),     
    url(r'^dingshare/$', dingshare),
    url(r'^usercardinfo/$', usercardinfo),
    url(r'^followprocess/$', followprocess),
    url(r'^fetchcomments/$', fetchcomments),
    url(r'^savecomment/$', savecomment),
    url(r'^delcomment/$', delcomment),
    url(r'^fetchshare/$', fetchshare),
    url(r'^searchshare/$', searchshare),
    url(r'^comment/$', comment),
    url(r'^letterprocess/$', letterprocess),
    url(r'^messageprocess/$', messageprocess),
    url(r'^fetchshares_comment/$', fetchshares_comment), 
    url(r'^zan/$', zan), 
    url(r'^fetchshares_zan/$', fetchshares_zan), 
    url(r'^letter/$', letter), 
    url(r'^fetchshares_letter/$', fetchshares_letter),
    url(r'^save_letter_reply/$', save_letter_reply),
    url(r'^del_letter/$', del_letter),
    url(r'^message/$', message), 
    url(r'^fetchshares_message/$', fetchshares_message), 
    url(r'^save_message_reply/$', save_message_reply), 
    url(r'^del_message/$', del_message), 
    url(r'^set/$', change),


    url(r'^(.+)/information/$', mine_information),
    url(r'^(.+)/change/$', change),
    url(r'^(.+)/message/$', mine_message),
    url(r'^(.+)/$', mine),

]

