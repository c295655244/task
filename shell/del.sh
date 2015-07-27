#!/bin/bash


for((i=0;i<500;i++))
do
	sudo lxc-stop -n ubuntu$i
	echo "容器ubuntu${i}已关闭中`````"
	开启中
done
