#www.google.cn => 03www06google02cn00
#bytetodomain
#03www06google02cn00 => www.google.cn
import sys
import structdef domaintobyte(domain):    #print 'old dimain', domain    domaintobyte = ''    dsplit = domain.split('.')    for cs in dsplit:
        formatstr = 'B%ds' % len(cs)
        newsplit = struct.pack(formatstr, len(cs), cs)
        domaintobyte += newsplit    domaintobyte += '\0'
    #print 'new domain', domaintobyte
    #print repr(domaintobyte) 
    return domaintobytedef bytetodomain(str):
    
    domain = ''
    i = 0
    length = struct.unpack('!B', str[0:1])[0]
    
    while length != 0 :
        i += 1
        domain += str[i:i+length]
        i += length
        length = struct.unpack('!B', str[i:i+1])[0]
        if length != 0 :
 domain += '.'
    
    return domain
#Python