#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "ip_address.h"

struct ip_address  ip_add[140000];

unsigned int ip2long(char *ip_str)
{

	char temp[50];
	char *p1,*p2,*p3,*p4;
	unsigned int ip_long ;
	strcpy(temp,ip_str);
	p1 = strtok(temp, ".");  
	p2 = strtok(NULL, "."); 
	p3 = strtok(NULL, "."); 
	p4 = strtok(NULL, "."); 
	if((p1==NULL)||(p2==NULL)||(p3==NULL)||(p4==NULL))
		return 4026531839;
	else
	{
		//printf("%s   %s    %s     %s\n",p1,p2,p3,p4);
		ip_long = (atoi(p1) << 24) | (atoi(p2) << 16) | (atoi(p3) << 8) | atoi(p4);
    		//printf("%u\n", ip_long);
    		return ip_long;
	}
}


int read_addr_file()
{
	
	char filename[] = "ip.csv"; //文件名
	char a_line[255];
	 FILE *fp; 
	 int i=0,j=0;
	 if((fp = fopen(filename,"r")) == NULL) //判断文件是否存在及可读
	 { 
	     // printf("error!"); 
	     return -1; 
	 } 
	 while (!feof(fp)) 
	 { 
	     fgets(a_line,1024,fp);  //读取一行

	     
	     ip_add[i].ip_start=atoi(strtok(a_line, ","));
	     ip_add[i].ip_end=atoi(strtok(NULL, ","));
	     strcpy( ip_add[i].country,strtok(NULL, ","));
	     strcpy( ip_add[i].province,strtok(NULL, ","));
	    if(strcmp(ip_add[i].country,"中国")!=0)
	     	ip_add[i].province[0]='\0';

	     i++;
	     if(i>135153)break;
	     //printf("%d\n",i );
	    // printf("%s",a_line);
	    
	 } 
	 fclose(fp);                     //关闭文件
	 return 1;
}

char *find_addr(char *iplong)
{
	unsigned int ip_long=ip2long(iplong);
	char *temp;
	char tt[100];
	int left = 0, right = 135153, mid = 0;
	mid = ( left + right ) / 2;

	while( left < right && (ip_add[mid].ip_start >= ip_long|| ip_add[mid].ip_end <= ip_long) )
	{
		//printf("end:%u     ip:%u\n",ip_add[mid].ip_end,ip_long);
		if( ip_add[mid].ip_end < ip_long )
			left = mid + 1;
		else if( ip_add[mid].ip_start > ip_long )
			right = mid - 1;
		else break;
			mid = ( left + right ) / 2;
			//printf("%d   %d\n",left,right);
	}
	if( ip_add[mid].ip_start <= ip_long|| ip_add[mid].ip_end >= ip_long )
	{
		
		strcpy(tt,ip_add[mid].country);
		if (strcmp(ip_add[mid].country,"中国")==0)
				//mid++;
			strcat(tt, ip_add[mid].province);
		//printf("%u  %u  %s   %s\n",ip_add[mid].ip_start, ip_add[mid].ip_end,ip_add[mid].country,ip_add[mid].province);
		temp=tt;
		return temp;
		//printf("Not found! \n");
	}

return NULL;
}
/*
int main()
{
	read_addr_file();
	char ip_str[50];
	unsigned int ip_long ;
	//sstrcpy(ip_str,"999.999.999.999");
	while(1)
	{
		printf("Please input the ip:\n");
		scanf("%s",ip_str);
		printf("%s\n", find_addr(ip_str));
	}
}
*/