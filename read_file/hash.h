#include <stdio.h>
#include <string.h>
#include "stdlib.h"
#include "time.h"
#include "mysql/mysql.h"
#include "ip_address.h"
#ifndef xxxx
#define xxxx
struct domain_table{
	char country[20];
	char province[40];
	char domain[100];
	char ip[500];
	int  priority;
	int times;
};
extern struct domain_table  domains[100000];
extern int hash[100000000];
extern int domain_num;
extern int  priority[100000];
extern int  cache_full_times;
extern unsigned int BKDRHash(char *str);
extern int init_data();
extern int create_hash(int i);
extern int clear_hash(int i);
extern char *find_file(char *domain,char *source_ip);
extern char *find_cache(char *domain, char *source_ip);
extern int init_replace();
extern int replace(char *ip,char *domain,char *province,char*country);
#endif
