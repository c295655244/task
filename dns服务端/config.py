# -*- encoding: utf-8 -*-

# DNS Proxy 配置文件
# 必须符合标准 Python 语法！

# HOST 表。
hosts = {
	"example.com": "127.0.0.1",
	"baidu.com":"115.239.211.112",

}
hosts_ttl = 3600			# HOSTS 表的过期时间，默认为 1 个小时。

# 服务器设定
# 推荐使用 Google DNS (8.8.8.8) 作为墙外服务器。
servers = {
	
	"Google": {
		"host": "8.8.8.8",
		"port": 53,
		"tcp": True,		# 为了防止 GFW 的 DNS 污染，请打开 TCP 选项。
	},
	
	"ISP": {
		"host": "202.96.209.133",
		"port": 53,
		"tcp": False,
	},

}
default_server = "Google"

# 域名 DNS 查询策略
# 根据不同的域名，使用特殊的 DNS 服务器。
# 注意：
#    如果想要指定 example.com 及其子域
# 请使用 .example.com。
lookups = (
	("ISP", (
		".cn",

		".qidian.com",
		".baidu.com",
		".163.com",
		".sohu.com",
		".sina.com",
	)),
)

# DNS 广告 IP 探测
# 对特定的 DNS 服务器进行 Spam 检测。
# 注意：尚未实现。
spam = {}