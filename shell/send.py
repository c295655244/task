import sys
import struct
from scapy.all import *

data = struct.pack('=BHI', 0x12, 20, 1000)
pkt = IP(src='172.29.153.174', dst='172.26.253.3')/UDP(sport=12345,dport=5555)/data
send(pkt, inter=1, count=5)