#!/bin/bash
#创建容器脚本
for((i=0;i<500;i++))
do
				echo "正在创建容器，请等待......."
				sudo lxc-clone -o ubuntu -n ubuntu${i} &&
				echo "容器ubuntu${i}已创建"  
done
