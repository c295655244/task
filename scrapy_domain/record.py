#!/usr/bin/env python
#-*- coding:utf8 -*-
import MySQLdb
import DNS #http://pydns.sourceforge.net/
from gevent import spawn, joinall,socket,sleep
from gevent.coros import BoundedSemaphore
from datetime import datetime
import random







def getreq(domain, qtype):
    '根据域名和查询类型得到dns请求的字节流'
    m = DNS.Lib.Mpacker()
    m.addHeader(id=random.randint(0,65535),
        qr=0,
        opcode=0,
        aa=0,
        tc=0,
        rd=1,
        ra=0,
        z=0,
        rcode=0,
        qdcount=1,
        ancount=0,
        nscount=0,
        arcount=0)
    m.addQuestion(domain, qtype, DNS.Class.IN)
    return m.getbuf()

def monitorone(domain): 
    try:
        global cursor
        global conn
        lock.acquire()
        client = socket.socket(
                family=socket.AF_INET, 
                type=socket.SOCK_DGRAM,
                proto=socket.IPPROTO_UDP)
        client.settimeout(TIMEOUT)
        req = getreq(domain, DNS.Type.A) #封包
        client.sendto(req, SERVER) #发包
        (rsp, (ip, port)) = client.recvfrom(512) #收包
        u = DNS.Lib.Munpacker(rsp) #解包
        rsp = DNS.Lib.DnsResult(u, {})
        for ans in rsp.answers:
            print type(ans['data'])
            print domain+"------"+ans['data']+"----------------------------------------write!"
    finally:
        lock.release()





if __name__ == '__main__':
    conn = MySQLdb.Connection(host= "172.26.253.3",user="root",passwd="platform",db="dns_domain",charset="utf8")
    cursor=conn.cursor()
    DNS.ParseResolvConf()
    SERVER = (DNS.defaults['server'][0],53)
    SERVER = ('8.8.8.8',53) #临时使用google的dns
    TIMEOUT = 10 
    lock = BoundedSemaphore(50) #并发数限制，防止同时pending的请求太多

    #加载域名列表并解析
    list = [spawn(monitorone, domain.strip()) 
        for domain in open('./domains.txt')]
    joinall(list)
