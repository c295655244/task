# -*- coding: utf-8 -*-
import sys, socket
import time
t1=time.time()
for domain in open('./domains.txt'):
	domain=domain.strip()
	try:
		result = socket.getaddrinfo(domain, None, 0, socket.SOCK_STREAM)
		counter = 0
		for item in result:
		    print "%-2d: %s" % (counter, item[4])
		    counter += 1
	except:
		print "error!"
t2=time.time()
print t1-t2