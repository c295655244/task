#!/usr/bin/env python
import socket
address=('172.29.153.174',10000)
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
s.bind(address)
while 1:
 data,addr=s.recvfrom(2048)
 if not data:
  break
 print "got data from",addr
s.close()
