使用文档

Title:     基于twisted框架实现的小型dns服务器

Author:    chenchen&其他开源作者

Language:  python 2.7

Support OS:lunix/unix

一.功能简介
1.该程序为基于异步网络引擎框架twisted的高效dns服务器
2.在root下开启后可作为dns解析服务器使用
3.该版本为测试版本，功能待完善，只提供少量域名供解析



二.使用方法
1.将文件 dnsproxy.py ，config.py，放入同一文件夹内。
2.打开终端，键入twistd -n -y dnsproxy.py 即可运行
3.将测试电脑dns地址改为该电脑ip，访问网页即可看到效果。
（目前只可查询baidu.com，若要添加，可根据说明添加）
4.若增加所测试的域名，需打开config.py，将域名以及对应iP存入host中，即可使用。



三.环境搭建
1.twisted安装

sudo apt-get install python-twisted

2.测试
安装完成后进入python，测试Twisted是否安装成功
>   python
>>> import twisted
>>>

四.存在问题
1.目前正在twisted框架学习中，有些问题仍待解决。
2.容易产生超时报错，原因不明。

