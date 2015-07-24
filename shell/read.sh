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
			echo "正在创建容器，请等待......."
			sudo lxc-clone -o ubuntu -n ubuntu${element} &&
			lxcname="ubuntu${element}"
			echo "容器ubuntu${element}已创建"  
		else
			#单引号会屏蔽$的取值功能
			sudo sed -i "s/^lxc.network.ipv4.*$/lxc.network.ipv4=${element}/g" /var/lib/lxc/${lxcname}/config
			echo "IP为:${element}"		
		fi
		let i=i+1
	done
done < lxc.txt  
sudo lxc-ls --fancy