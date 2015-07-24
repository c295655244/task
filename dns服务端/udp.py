# -*- coding: cp936 -*-
import socket
from struct import *
from time import ctime,sleep
from os import system
system('title udp sniffer')
system('color 05')
# the public network interface
HOST = socket.gethostbyname(socket.gethostname())
# create a raw socket and bind it to the public interface
s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_UDP)
s.bind((HOST, 0))
# Include IP headers
s.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)
# receive all packages
#s.ioctl(socket.SIO_RCVALL, socket.RCVALL_ON)
# receive a package
while 1==1:
    packet = s.recvfrom(53)
    packet = packet[0]
    ip_header = packet[0:20]
    iph = unpack('!BBHHHBBH4s4s',ip_header)
    version = iph[0] >> 4 #Version
    ihl = iph[0] * 0xF    #IHL
    iph_length = ihl * 4  #Total Length
    ttl = iph[5]
    protocol = iph[6]
    s_addr = socket.inet_ntoa(iph[8])
    d_addr = socket.inet_ntoa(iph[9])
    if protocol == 17:
        udp_header = packet[20:28]
        udph = unpack('!HHHH' , udp_header)
        source_port = udph[0]
        dest_port = udph[1]
        length = udph[2]
        checksum = udph[3]
        data = packet[28:len(packet)]

        print ctime()
        print 'Version : ' + str(version) + ' IHL : ' + str(ihl) + ' Total Length: '+str(iph_length) + ' TTL : ' +str(ttl) + ' Protocol : ' + str(protocol) + ' Source Address : ' + str(s_addr) + ' Destination Address : ' + str(d_addr)
        print 'Source Port : ' + str(source_port) + ' Dest Port : ' + str(dest_port) + ' Length : ' + str(length) + ' Checksum : ' + str(checksum)
        print 'Data : ' + data
# disabled promiscuous mode
s.ioctl(socket.SIO_RCVALL, socket.RCVALL_OFF)