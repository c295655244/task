# -*- coding: utf-8 -*-

import dns.resolver


my_resolver = dns.resolver.Resolver()
# 这里换成你指定的某一个域名服务器的ip
my_resolver.nameservers = ['8.8.8.8']
my_resolver.nameservers = ['202.102.128.68']
# 需要查询的域名
answer = my_resolver.query('www.qq.com')
print answer.response