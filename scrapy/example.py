#!/usr/bin/env python
# encoding:utf-8

import MySQLdb
from pyspider.libs.base_handler import *
from urlparse import urlparse
import re
from tld import get_tld

conn = MySQLdb.Connection(host="172.26.253.3", user="root", passwd="platform", db="dns_domain", charset="utf8")
cursor = conn.cursor()

class Handler(BaseHandler):
    
    headers= {
        "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding":"gzip, deflate, sdch",
        "Accept-Language":"zh-CN,zh;q=0.8",
        "Cache-Control":"max-age=0",
        "Connection":"keep-alive",
        "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36",
        }
    
    crawl_config = {
        "headers":headers,
        #"timeout":100,
        }
    urls=[]

    @every(minutes=24 * 60)
    def on_start(self):
        self.crawl('http://www.hao123.com/', callback=self.index_page)

    @config(age=10 * 24 * 60 * 60)
    def index_page(self, response):
        
        for each in response.doc('a[href^="http"]').items():
            self.crawl(each.attr.href, callback=self.sec_page)

    @config(priority=2)
    def sec_page(self, response):
        #print response.doc("html")
        urls=[]
        scheme = re.compile("https?\:\/\/",re.IGNORECASE)
        
        for each in response.doc('a[href^="http"]').items():
            domain=""
            url = each.attr.href
            if scheme.match(url) is None:
                url = "http://"+url
            
            try:
                #res=get_tld(url,as_object=True)
                #domain = res.tld
                res= urlparse(url)
                domain=res.hostname  
            except:
                parsed = urlparse(url)
                domain = parsed.netloc
            domain=str(domain)
            sql="select domain from domain_information where domain=%s"
            n=cursor.execute(sql,domain)
            sql="select domain from domain_information2 where domain=%s"
            n2=cursor.execute(sql,domain)
            if n or n2:
                print domain
                continue
            else:
                sql="INSERT INTO domain_information2 (domain) VALUES(%s)"
                cursor.execute(sql,domain)
                conn.commit()
                self.crawl(each.attr.href,callback=self.third_page)

    def third_page(self, response):
        #print response.doc("html")
        urls=[]
        scheme = re.compile("https?\:\/\/",re.IGNORECASE)
        
        for each in response.doc('a[href^="http"]').items():
            domain=""
            url = each.attr.href
            if scheme.match(url) is None:
                url = "http://"+url
            
            try:
                #res=get_tld(url,as_object=True)
                #domain = res.tld
                res= urlparse(url)
                domain=res.hostname 
            except:
                parsed = urlparse(url)
                domain = parsed.netloc
            sql="select domain from domain_information where domain=%s"
            n=cursor.execute(sql,domain)
            sql="select domain from domain_information2 where domain=%s"
            n2=cursor.execute(sql,domain)
            
            if n or n2:
                print doamin
                continue
            else:
                sql="INSERT INTO domain_information2 (domain) VALUES(%s)"
                cursor.execute(sql,domain)
                conn.commit()
    
    def __del__(self):
        conn.close()
                