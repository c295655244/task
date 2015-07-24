# -*- encoding: utf-8 -*-

"""
基于 Twisted 框架的 DNS  服务器。
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from twisted.names import dns, server, client, cache
from twisted.application import service, internet

import config


class CustomResolver(client.Resolver):
	"""
	根据 config 对象的配置解析 Host。
	"""
	def __init__(self, config):
		# 记录参数
		self.config = config
		
		# 初始化基类
		server = self.config.servers[self.config.default_server]
		#self.config.default_server="google"
		client.Resolver.__init__(self, servers=[server["host"], server["port"]])
		#指定谷歌为默认dns服务器
		
	def lookupAddress(self, name, timeout=None, addr = None, edns = None):
		# 查找 HOST 表
		print addr
		result =self.config.hosts.get(name, "None")
		'''
		此处可编写查找方法
		输出变量result为ip值
		类型为字符串
		'''
		#构造并发包
		if result  is not "None":
			def packResult(value):
				return [
					(dns.RRHeader(name, dns.A, dns.IN, self.config.hosts_ttl, dns.Record_A(value, self.config.hosts_ttl)),),
					(),
					(),
				]
			# result.addCallback(packResult)
			return packResult(result)

		server = self.config.servers[self.config.default_server]
		
		# 根据服务器建立 dns.Query，并执行查询
		q = dns.Query(name, dns.A, dns.IN)
		r = client.Resolver(servers=[(server["host"], server["port"])])
		d = None
		if server["tcp"]:
			if timeout is None:
				timeout = 10
			d = r.queryTCP([q], timeout)
		else:
			d = r.queryUDP([q], timeout)
		d.addCallback(r.filterAnswers)
		return d
	

# 创建 Twisted 程序框架。
application = service.Application('dnsserver', 1, 1)

# 建立 Resolver
resolver = CustomResolver(config)

# 初始化协议
f = server.DNSServerFactory(caches=[cache.CacheResolver()], clients=[resolver])
p = dns.DNSDatagramProtocol(f)
f.noisy = p.noisy = False

# 同时注册 TCP 和 UDP 端口。
ret = service.MultiService()
PORT=53

for (klass, arg) in [(internet.TCPServer, f), (internet.UDPServer, p)]:
	s = klass(PORT, arg)
	s.setServiceParent(ret)

# 使用 Twisted 运行程序。
ret.setServiceParent(service.IServiceCollection(application))

# 空参数提示。
if __name__ == '__main__':
	import sys
	print "Usage: twistd -y %s" % sys.argv[0]