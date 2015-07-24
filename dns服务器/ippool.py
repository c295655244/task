# -*- coding: utf-8 -*-
import sys, os
import time
import bisect
from os.path import isfile
import socket
import struct
import yaml, re
reload(sys)
sys.setdefaultencoding('utf8')


def ip2long(ip):
	"convert decimal dotted quad string to long integer"    
	hexn = ''.join(["%02X" % long(i) for i in ip.split('.')])    
	return long(hexn, 16)

def long2ip(n):    
	"convert long int to dotted quad string"    
	d = 256 * 256 * 256    
	q = []
	while d > 0:       
		m,n = divmod(n,d)        
		q.append(str(m))        
		d = d/256    
	return '.'.join(q)


class IPPool:
	def __init__(self, ipfile):
		if not isfile(ipfile):
			# 故意返回数据，另程序退出
			return 1
		self.ipfile = ipfile
		#初始化iplist，用来进行2分查找
		self.iplist = []
		#初始化iphash，用来检索详细信息
		self.iphash = {}
		#初始化存储a.yaml配置
		self.record = {}		
		# 存储各个域名的地域对于ip信息
		self.locmapip = {}	
		#load ip data
		self.LoadIP()
	
		print 'Init IP pool finished !'

	def LoadIP(self):
		f = open(self.ipfile, 'r')
		#logger.warning("before load: %s" % ( time.time() ) )
		for eachline in f:
			ipstart, ipend, country, province, city, sp = eachline.strip().split(',')
			ipstart = long(ipstart)
			ipend = long(ipend)			

			#如果ip地址为0,忽略
			if 0 == ipstart:
				continue
			self.iplist.append(ipstart)
			if ipstart in self.iphash:
				#print "maybe has same ipstart"
				pass
			else:
				#ipstart, ipend, country, province, city, sp, domain ip hash
				self.iphash[ipstart] = [ipstart, ipend, country, province, city, sp, {}]
				# 最好合并后再计算
				self.JoinIP(ipstart)				
		f.close()
		#logger.warning("after load: %s" % ( time.time() ) )
		self.iplist.sort()
		#logger.warning("after sort: %s" % ( time.time() ) )

	def JoinIP(self, ip):
		for fqdnk, fqdnv in self.locmapip.items():
			l1 = []
			l2 = []
			l3 = []
			weight = 0
			#logger.warning("l1 : %s, %s" %(self.iphash[ip][2], fqdnv.keys()))
			if "" in fqdnv and "" != self.iphash[ip][2]:
				l1.append(fqdnv[""])
			if self.iphash[ip][2] in fqdnv:
				l1.append(fqdnv[self.iphash[ip][2]])
			for k in l1:
				#logger.warning("l2 : %s, %s" %(self.iphash[ip][3], k.keys()))
				if "" in k and "" != self.iphash[ip][3]:
					l2.append(k[""])
				if self.iphash[ip][3] in k:
					l2.append(k[self.iphash[ip][3]])
			for k in l2:
				#logger.warning("l3 : %s, %s" %(self.iphash[ip][4], k.keys()))
				if "" in k and "" != self.iphash[ip][4]:
					l3.append(k[""])
				if self.iphash[ip][4] in k:
					l3.append(k[self.iphash[ip][4]])
			for k in l3:
				#logger.warning("l4 : %s, %s" %(self.iphash[ip][5], k.keys()))
				if "" in k and k[""][1] > weight:
					self.iphash[ip][6][fqdnk] = k[""]
					weight = k[""][1]
				if self.iphash[ip][5] in k and k[self.iphash[ip][5]][1] > weight:
					self.iphash[ip][6][fqdnk] = k[self.iphash[ip][5]]
					weight = k[self.iphash[ip][5]][1]
			if fqdnk not in self.iphash[ip][6]:
				self.iphash[ip][6][fqdnk] = [self.record[fqdnk]['default'], 0]

	def ListIP(self):
		for key in self.iphash:
			print "ipstart: %s  ipend: %s  country: %s  province: %s  city: %s  sp: %s" % (key, self.iphash[key][1], self.iphash[key][2], self.iphash[key][3], self.iphash[key][4], self.iphash[key][5])
			for i in self.iphash[key][6]:
				print "[domain:%s   ip: %s]" % (i, self.iphash[key][6][i][0])

	def SearchLocation(self, ip):
		ipnum = ip2long(ip)
		ip_point = bisect.bisect_right(self.iplist, ipnum)
		i = self.iplist[ip_point - 1]
		if ip_point == self.iplist.__len__():
			j = self.iplist[ip_point - 1]
		else:
			j = self.iplist[ip_point]

		return i, j, ipnum

	def FindIP(self, ip):
		i, j, ipnum = self.SearchLocation(ip)
		if i in self.iphash:
			ipstart		= self.iphash[i][0]
			ipend		= self.iphash[i][1]
			country		= self.iphash[i][2]
			province	= self.iphash[i][3]
			city		= self.iphash[i][4]
			sp			= self.iphash[i][5]
			print city,province,country

if __name__ == '__main__':
	ipcheck = IPPool('ip.csv')
	ipcheck.FindIP("202.102.144.8",)

