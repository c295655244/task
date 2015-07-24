函数说明:


unsigned int BKDRHash(char *str);
//哈希函数,返回整型

int create_hash(int i)
//为单条记录创建哈希值


int clear_hash(int i)
//替换前清空该哈希值


char *find_file(char *domain,char *source_ip)
//缓存未命中，则查询文件系统


char *find_cache(char *domain, char *source_ip)
//查询缓存


int init_replace()
//替换信息初始化


int replace(char *ip,char *domain,char *province,char*country)
//进行替换


int  init_data()
//初始化全部数据


运行顺序:
先运行init_data()函数,再运行find_cache函数查询, 参数为域名和源ip,返回值为字符串指针.
