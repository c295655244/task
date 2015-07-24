#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "time.h"
#include "hash.h"
#include "ip_address.h"


#define  max_domain 100000

struct domain_table domains[max_domain];
int  cache_full_times=0;
int hash[100000000]={0};
int domain_num=0;

int  priority[max_domain]={0};
// BKDR Hash Function
unsigned int BKDRHash(char *str)
{
    unsigned int seed = 131; // 31 131 1313 13131 131313 etc..
    unsigned int hash = 0;

    while (*str)
    {
        hash = hash * seed + (*str++);
    }
    return (hash & 0x7FFFFFFF)%10000000;
}

int create_hash(int i)//为单条记录创建哈希值
{
	int f=0;
	f=BKDRHash(domains[i].domain)%10000000;
	hash[f]=i;
}
int clear_hash(int i)//替换前清空该哈希值
{
	int f=0;
	f=BKDRHash(domains[i].domain)%10000000;
	hash[f]=0;
}

char *find_file(char *domain,char *source_ip)//缓存未命中，则查询文件系统
{
	//此处为查询文件系统接口



/////////////////////////////测试缓存替换代码///////////////////////////////////////
	int i=0;
	char ip[50],province[50],country[50];
	printf("请输入域名:");
	scanf("%s",ip);
	printf("请输入国家:");
	scanf("%s",province);
	printf("请输入省份:");
	scanf("%s",country);
	i=replace(ip, domain, province,country);
	//printf("%s   %s\n", country,province);
//////////////////////////////////////////////////////////////////////////////////

	return domains[i].ip;
}


char *find_cache(char *domain, char *source_ip)//查询缓存
{
	char temp[100],temp2[100];
	strcpy(temp,domain);

	find_addr(source_ip);

	//printf("%s\n",source_ip );
	//printf("%s\n", find_addr(source_ip));

	int s=0;
	s=BKDRHash(temp)%10000000;
	if(BKDRHash(domains[hash[s]].domain) %10000000 != s)//缓存未命中，则查询文件系统
	{	
		return find_file(domain,source_ip);
	}

	return domains[hash[s]].ip;
}


//从数据库中读取初始化数据
/*
void read_mysql()
{
	int i=0,f=0,max_len=0;
	char haystack[500];
	const char* buf;
	const char *host = "172.26.253.3";
	const char *user = "root";
	const char *pass = "platform";
	const char *db   = "dns_domain";
	MYSQL mysql;     //mysqlÁ¬½Ó
	MYSQL_RES *res; //Õâ¸ö½á¹¹´ú±í·µ»ØÐÐµÄÒ»¸ö²éÑ¯½á¹û¼¯
	MYSQL_ROW row; //Ò»¸öÐÐÊý¾ÝµÄÀàÐÍ°²È«(type-safe)µÄ±íÊ¾
	const char *query;   //²éÑ¯Óï¾ä
	int t,r;
	mysql_init(&mysql);

	if (!mysql_real_connect(&mysql,host, user, pass, db, 0, NULL, 0))
	{

		printf( "Error connecting to database: %s",mysql_error(&mysql));

	} else
		printf("Connected...");
	query = "SET CHARACTER SET utf8"; //ÉèÖÃ±àÂë
	t=mysql_real_query(&mysql,query,(unsigned int)strlen(query));
	if(t)
	{
		printf("±àÂëÉèÖÃÊ§°Ü");
	}
	query = " select * from dns ";
	t=mysql_real_query(&mysql,query,(unsigned int)strlen(query));
	if(t)
	{
		printf("Ö´ÐÐ²éÑ¯Ê±³öÏÖÒì³£: %s",mysql_error(&mysql));
	}else
		printf("[%s] ¹¹½¨³É¹¦",query);
	res=mysql_store_result(&mysql);
	while(row=mysql_fetch_row(res))
	{
		if(strlen(row[1])>max_len)
		max_len=strlen(row[1]);
	
		strcpy(domains[i].domain,row[0]);
		
		f=BKDRHash(row[0])%10000000;
		hash[f]=i;
		strcpy(haystack,row[1]);
		buf = strtok( haystack, ";");
		if( buf != NULL )
		{
			//printf( "%s\n ", buf);
			strcpy(domains[i].ip,buf);
		}
		i++;
	}
	printf("%d\n",i);
	mysql_free_result(res);
	mysql_close(&mysql);
}
*/


int init_replace()//替换信息初始化
{
	int i=0;
	for(i=0;i<domain_num;i++)
	{
		priority[i]=i;
		domains[i].priority=i;
		domains[i].times=0;
	}
	return 1;
}

int replace(char *ip,char *domain,char *province,char*country)//进行替换
{
	if(cache_full_times>10000000)//若缓存已满的情况持续时间过长，则重新初始化缓存
		init_data();

	srand((unsigned) time(NULL));
	int i;
	if(domain_num<max_domain)
	{
		clear_hash(domain_num);
		strcpy(domains[domain_num].ip,ip);
		strcpy(domains[domain_num].domain,domain);
		strcpy(domains[domain_num].province,province);
		strcpy(domains[domain_num].country,country);
		domains[domain_num].times=1;
		create_hash(domain_num);
		domain_num++;
		//printf("here!\n");
		return domain_num-1;
	}
	else
	{
		for(i=0;i<domain_num;i++)
		{
			if(domains[i].times<=2)
			{	
				clear_hash(i);
				strcpy(domains[i].ip,ip);
				strcpy(domains[i].domain,domain);
				strcpy(domains[i].province,province);
				strcpy(domains[i].country,country);
				domains[i].times=1;
				create_hash(i);
				return i;
			}
		}
		//若都命中频率都很高，则随机替换
		i=rand() %domain_num;
		clear_hash(i);
		strcpy(domains[i].ip,ip);
		strcpy(domains[i].domain,domain);
		strcpy(domains[i].province,province);
		strcpy(domains[i].country,country);
		domains[i].times=1;
		create_hash(i);
		cache_full_times++;
		return i;
	}
}


int  init_data()//初始化全部数据
{

//////////////////////////////////////读取初始化文件/////////////////////////////////////////////////////
domain_num=0;
char filename[] = "20150520172.txt"; //文件名
     FILE *fp; 
     char a_line[10240];             //每行最大读取的字符数
     char A[10240];
     char domain[10240];
     char temp[1024];
    bool sign=false;
    const char* buf;
          int j=0;
          int i;
          int len;
          int count=0;
          int f=0;
     if((fp = fopen(filename,"r")) == NULL) //判断文件是否存在及可读
     { 
         // printf("error!"); 
         return -1; 
     } 
     while (!feof(fp)) 
     { 
         fgets(a_line,10240,fp);  //读取一行
         strcpy(domain, "");
         strcpy(A, "");
            j=0;
            sign=false;
            for (i = 0; i < strlen(a_line); ++i)
            {
                    if(a_line[i]==' ')
                         {
                            j++;
                           sign=false;
                         }
                    if(j>3 && j<5)
                         { 
                            //strcat(domain, &a_line[i]);
                            len=strlen(domain);
                            domain[len]=a_line[i];
                            domain[len+1]='\0';

                         } 
                    if(a_line[i]=='a')
                        { 
                           if(a_line[i+1]==' ')
                         {
                           i=i+2;
                           sign=true;
                         }
                        }
                    if(sign)
                         {
                            len=strlen(A);
                            A[len]=a_line[i];
                            A[len+1]='\0';
                            //strcat(A, &a_line[i]);
                           if(a_line[i+1]==' ')
                          {
                           //strcat(A, ";");
                            len=strlen(A);
                            A[len]=';';
                            A[len+1]='\0';
                         }
                          }
                }       
                for(i=0; i < strlen(domain); i++)
                {
                domain[i] = domain[i + 1];
                }
             //printf("%s\n",domain); 

 ////////////////////////////////////创建哈希表///////////////////////////////////////
	strcpy(domains[count].domain,domain);
	create_hash(count);
	strcpy(temp,A);
	buf = strtok( temp, ";");
	if( buf != NULL )
	{
		//printf( "%s\n ", buf);
		strcpy(domains[count].ip,buf);
	}


	// printf("%s\n", domains[count].domain); //输出
	// printf("%s\n", domains[count].ip); //输出
	count++;
	domain_num++;
     } 
     fclose(fp);                     //关闭文件


 ////////////////////////////////初始化地址信息以及替换信息///////////////////////////////////////////
     init_replace();//
     read_addr_file();
     return 1;
}

/*
int main()
{
	init_data();

	char domain[50];
	char source_ip[50];
	strcpy(source_ip,"222.175.198.5");
	//strcpy(domain,"www.hehehe.com");
	char *a_record;
	while(1)
	{
		printf("Please input the domian:\n");
		scanf("%s",domain);

		a_record=find_cache(domain,source_ip);
		printf("%s\n",a_record);

	}
	return 0;
}
*/