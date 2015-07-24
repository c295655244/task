# -*- coding: utf-8 -*-
from scrapy.spider import Spider
import scrapy
from scrapy.selector import Selector
from scrapy.contrib.spiders import SitemapSpider
import re
from urlparse import urlparse
import MySQLdb

conn = MySQLdb.Connection(host= "172.26.253.3",user="root",passwd="platform",db="dns_domain",charset="utf8")
cursor=conn.cursor()

class pachongSpider(Spider):
    name = "domain"#定义名称
    allowed_pamains = ["baidu.com/"]
    start_urls = [#定义抓取网页的起始点
        "http://site.baidu.com/"
    ]
    url_repeat="www.hao123.com"
    def parse(self, response):#定义抓取方法
         for url in response.xpath('//a/@href').extract():
            res=urlparse(url)
            domain=res.hostname
            if domain:
                if self.url_repeat != domain:
                    self.url_repeat=domain
                    sql="select domain from domain_information where domain=%s"
                    n=cursor.execute(sql,domain)
                    sql="select domain from domain_information2 where domain=%s"
                    n2=cursor.execute(sql,domain)
                    if n or n2:
                        pass
                    else:
                        print domain+"----------------------------------------write!"
                        sql="INSERT INTO domain_information2 (domain) VALUES(%s)"
                        cursor.execute(sql,domain)
                        conn.commit()
                    print domain
                    yield scrapy.Request(url, callback=self.parse)
        #for each in response.doc('a[herf^="http"]').items():
            #print each