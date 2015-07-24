#!/bin/bash


for((i=0;i<200;i++))
do
	sudo lxc-destroy -n ubuntu$i
done
