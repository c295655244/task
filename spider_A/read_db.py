# -*- coding: UTF-8 -*-
import MySQLdb as mdb
import sys
import socket
import ippool
#连接mysql，获取连接的对象
ipcheck = ippool.IPPool('ip.csv')

con = mdb.connect('172.26.253.3', 'root', 'platform', 'dns_domain');
with con:
    #仍然是，第一步要获取连接的cursor对象，用于执行查询
    cur = con.cursor()
    #类似于其他语言的query函数，execute是python中的执行查询函数
    cur.execute("SELECT * FROM dns")
    #使用fetchall函数，将结果集（多维元组）存入rows里面
    rows = cur.fetchall()
    #依次遍历结果集，发现每个元素，就是表中的一条记录，用一个元组来显示
    for row in rows:
        domain=row[0]
        result = socket.getaddrinfo(domain, None, 0, socket.SOCK_STREAM)
        ipcheck.FindIP(result[0][4][0])
        print domain+ "---------"+result[0][4][0]