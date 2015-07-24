#include <stdio.h>
#include <string.h>
#include "stdlib.h"
#include "mysql/mysql.h"
#ifndef xxx
#define xxx
struct  ip_address
{
	unsigned int ip_start;
	unsigned int ip_end;
	char country[50];
	char province[50];
};
extern struct ip_address  ip_add[140000];
extern unsigned int ip2long(char *ip_str);
extern int read_addr_file();
extern char *find_addr(char *iplong);
#endif