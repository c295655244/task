# encoding: utf-8
__author__ = 'zhanghe'

"""
天天基金网 - 模拟登录演练
请求地址：https://trade.1234567.com.cn/do.aspx/CheckedCS
请求方式：post
请求协议：ajax
参数格式：{"CS":"MCUyQzAlMkMxMzgwMDAwMDAwMCUyQzEyMzQ1NiUyQzAlMkMlMkM="}
参数产生：data:JSON.stringify({CS:JsEncrypt.encode(encodeURIComponent(opts.TabID+","+at+","+$.trim(name)+","+escape($.trim(tbpwd.val()))+","+$("#hidenum").val()+","+tbcode.val()+","+direct))}),
获取表单数据加密方法：https://trade.1234567.com.cn/js/jsencrpt.js

上面可以看出，6个逗号，应该是7个参数
为了查看参数具体的组成，需要解密来验证一下（这里是对称加密，没有什么复杂度）
解密方法已经写在这里：
/template/index.html
启动web服务
$ source pyenv/bin/activate
$ python web.py
访问http://localhost:8000/
得到解密后的参数构成如下：
0,0,13800000000,123456,0,,
模拟登录只需要构造成这个结构就可以了

整个模拟登录过程已完善
登录入口：
http://localhost:8000/
响应页面：
http://localhost:8000/login

说明：本次测试仅供学习
"""

import requests
import json


# 登录页的url
url ='http://tool.chinaz.com/AjaxSeo.aspx?t=dns&server=Tllr7HLQodUtFVazK7Ys3w==&id=2642948&callback=jQuery17106398814946441661_1435800566175'

# 配置User-Agent
# header = {
#     'Content-Type': 'application/json; charset=UTF-8',  # 因为是ajax请求，格式为json，这个必须指定
#     'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36'}

header = {
'Accept':  'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
'Accept-Encoding': 'gzip, deflate',
'Accept-Language' :'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
'Cache-Control' :  'no-cache',
'Connection'  :'keep-alive',
'Content-Length' : '54',
'Content-Type'  :  'application/json; charset=UTF-8',
'Host' :   'tool.chinaz.com',
'Pragma'  :'no-cache',
'Referer': 'http://tool.chinaz.com/dns/',
'User-Agent'  :'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:28.0) Gecko/20100101 Firefox/28.0',
'X-Requested-With' :   'XMLHttpRequest'}

# 这里测试构造的数据 手机号码：13800000000,密码：123456
payload = {'host':'www.baidu.com','type':1,'total':71,'process':36,'right':10}
#payload = {'host':'www.baidu.com','type':1}
# 保持会话
s = requests.session()


def login():
    """
    登录
    :return:
    """
    response = s.post(url, data=json.dumps(payload), headers=header)
    return response.content


if __name__ == "__main__":
    result = login()
    print result
