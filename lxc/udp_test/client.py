#!/usr/bin/env python
import socket
addr=('172.26.253.3',10000)
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
while 1:
 data="hahaha"
 s.sendto(data,addr)
s.close()