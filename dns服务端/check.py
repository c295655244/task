#!/usr/bin/env python
import sys,socket


while 1:
	content = raw_input("input:")
	result=socket.getaddrinfo(content,None)
	print result[0][4]