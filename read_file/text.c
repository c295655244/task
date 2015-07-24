#include <stdio.h>
#include <string.h>
#include "stdlib.h"
#include "time.h"
#include "hash.h"
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