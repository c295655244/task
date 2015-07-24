# -*- encoding: utf-8 -*-

"""
基于 Twisted 框架的 DNS Proxy 服务器。

作者：平芜泫（airyai@gmail.com）。
时间：2011/8/8。
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from twisted.names import dns, server, client, cache
from twisted.application import service, internet

import config

class DomainMapper:
	"""
	域名匹配类。
	
	输入一组域名的配置。凡是 example.tld 均为精确
	匹配，而 .example.tld 匹配 example.tld 以及
	其所有的子域名。
	
	当查询匹配规则的时候，返回这个规则的原始域。如果
	不匹配，则返回 None。
	"""
	
	def __init__(self, domains):
		# 记录参数
		self._tree = {}
		self._hash = {}
		self._domains = domains
		
		# 计算域名匹配树。
		for d in domains:
			d = d.lower()
			if d == '':
				continue
			
			if d.startswith("."):
				# 匹配 .example.tld
				dd = d[1:]
				if dd == '':
					continue
				# 将 example.tld 加入 hash 表。
				self._hash[dd] = d
				# 填写 tree[tld][example] 的查找树。
				tree = self._tree
				dparts = dd.split('.')
				dparts.reverse()
				for k in dparts:
					if k == '':
						continue
					if k in tree:
						tree = tree[k]
					else:
						tree[k] = {}
						tree = tree[k]
				# 写入匹配信息
				tree['@'] = d
				
			else:
				# 只写入 example.tld
				self._hash[d] = d
				
	def lookup(self, domain):
		domain = domain.lower()
		
		# 查找 hash 表。
		if domain in self._hash:
			return self._hash[domain]
			
		# 查找树。
		dparts = domain.split('.')
		dparts.reverse()
		tree = self._tree
		for k in dparts:
			if k == '':
				continue
			if k in tree:
				tree = tree[k]
			else:
				if "@" in tree:
					return tree["@"]
				else:
					return None
		if "@" in tree:
			return tree["@"]
		else:
			return None

class CustomResolver(client.Resolver):
	"""
	根据 config 对象的配置解析 Host。
	"""
	
	def __init__(self, config):
		# 记录参数
		self.config = config
		
		# 初始化基类
		server = self.config.servers[self.config.default_server]
		client.Resolver.__init__(self, servers=[server["host"], server["port"]])
		
		# 计算 Domain Mappers
		self.host_mappers = DomainMapper(self.config.hosts)
		self.lookup_mappers = {}
		for g in self.config.lookups:
			self.lookup_mappers[g[0]] = DomainMapper(g[1])
		
		
	def lookupAddress(self, name, timeout=None):
		# 查找 HOST 表
		kname = self.host_mappers.lookup(name)
		if kname is not None:
			result = self.config.hosts[kname]
			def packResult(value):
				return [
					(dns.RRHeader(name, dns.A, dns.IN, self.config.hosts_ttl, dns.Record_A(value, self.config.hosts_ttl)),),
					(),
					(),
				]
			# result.addCallback(packResult)
			return packResult(result)
			
		# 选定上游 DNS 服务器
		server = self.config.servers[self.config.default_server]
		for g in self.config.lookups:
			dm = self.lookup_mappers[g[0]]
			kname = dm.lookup(name)
			if kname is not None:
				server = self.config.servers[g[0]]
		
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
