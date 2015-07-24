#!/bin/bash

while read myline  
do  
	#echo "LINE:"$myline 
	name=${myline//,/ }    #这里是将var中的,替换为空格  
	#echo $name
	i=0
	for element in $name   
	do  
		if [ $i == 0 ]

		then
			echo "正在删除容器，请等待......."
			sudo lxc-destroy  -n ubuntu${element}
			lxcname="ubuntu${element}"
			echo "容器ubuntu${element}已删除"  
		else
			echo "IP为:${element}"		
		fi
		let i=i+1
	done
done < lxc.txt  
sudo lxc-ls --fancy