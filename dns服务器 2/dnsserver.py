# -*- coding: utf-8 -*-
import sys, os
import random
import re
import time
import inspect
sys.path.append('../lib')
from twisted.names import dns, server, client, cache, common, resolve
from twisted.python import failure
from twisted.internet import defer
import config
typeToMethod = {
    dns.A:     'lookupAddress',
    dns.AAAA:  'lookupIPV6Address',
    dns.A6:    'lookupAddress6',
    dns.NS:    'lookupNameservers',
    dns.CNAME: 'lookupCanonicalName',
    dns.SOA:   'lookupAuthority',
    dns.MB:    'lookupMailBox',
    dns.MG:    'lookupMailGroup',
    dns.MR:    'lookupMailRename',
    dns.NULL:  'lookupNull',
    dns.WKS:   'lookupWellKnownServices',
    dns.PTR:   'lookupPointer',
    dns.HINFO: 'lookupHostInfo',
    dns.MINFO: 'lookupMailboxInfo',
    dns.MX:    'lookupMailExchange',
    dns.TXT:   'lookupText',
    dns.SPF:   'lookupSenderPolicy',

    dns.RP:    'lookupResponsibility',
    dns.AFSDB: 'lookupAFSDatabase',
    dns.SRV:   'lookupService',
    dns.NAPTR: 'lookupNamingAuthorityPointer',
    dns.AXFR:         'lookupZone',
    dns.ALL_RECORDS:  'lookupAllRecords',
}

smartType = ('lookupAddress', 'lookupAuthority')

class FailureHandler:
    def __init__(self, resolver, query, timeout, addr = None, edns = None):
        self.resolver = resolver
        self.query = query
        self.timeout = timeout
        self.addr = addr
        self.edns = edns

    def __call__(self, failure):
        # AuthoritativeDomainErrors should halt resolution attempts
        failure.trap(dns.DomainError, defer.TimeoutError, NotImplementedError)
        return self.resolver(self.query, self.timeout, self.addr, self.edns)


class MapResolver(client.Resolver):
    def __init__(self, config):
        self.config = config
        
        # 初始化基类
        server = self.config.servers[self.config.default_server]
        #self.config.default_server="google"
        client.Resolver.__init__(self, servers=[server["host"], server["port"]])
    def lookupAddress(self, name, timeout = None, addr = None, edns = None):
        print addr
        if name in self.Amapping:
            ttl = self.Amapping[name]['ttl']
            def packResult( value ):
                ret = []
                add = []
                for x in value:
                    ret.append(dns.RRHeader(name, dns.A, dns.IN, ttl, dns.Record_A(x, ttl), True))
                if edns is not None:
                    if edns.rdlength > 8:
                        add.append(dns.RRHeader('', dns.EDNS, 4096, edns.ttl, edns.payload, True))
                    else: 
                        add.append(dns.RRHeader('', dns.EDNS, 4096, 0, dns.Record_EDNS(None, 0), True))
                return [ret, (), add]
            result = self.Finder.FindIP(str(addr[0]), name)
            #返回的IP数组乱序
            print result
            random.shuffle(result)
            return packResult(result)
        else:
            return self._lookup(name, dns.IN, dns.A, timeout)

