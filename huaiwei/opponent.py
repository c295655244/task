# -*- encoding: utf-8 -*-



#可选决策列表
'''
阈值设置思想：

1.将可以做出的决策分为三段，列表中两个值标志分界点，实际决策中可选择的决策一般不会大于3个，
甚至只有两个，那便只取第二个数作为分界点。在决策中，让牌与弃牌可视为一种选择，有让牌则先让牌。

2.具体值由己方牌力程序测试+主观推断得出，需根据实际情况动态更改。

3.该程序需要完整对手信息才可运行，而对手信息因为信息量过多难以构建，因此暂时无法运行。

'''
decisions1=
[
[0.1,0.15],
[0.1,0.175],
[0.15,0.2],
[0.15,0.25],
[0.15,0.3],
[0.2,0.5],
]

decisions2=
[
[0.5,0.7],
[0.6,0.75],
[0.6,0.8],
[0.7,0.9],
[0.8,0.95],
[0.8,0.99]
]







#function:  对手牌力预测函数
#input:       所有玩家行动信息 
#output:     0-1的对手牌力值
def opponent_build(opponents):
	max_card=0
	alive_num=8#统计场中存活人数
	for opp in opponents:
		'''
		check	让牌
		call	跟注
		raise	加注
		all_in	全押
		fold	弃牌
		'''
		call=opp['call']#跟注
		check=opp['check']#让牌
		raises=opp['raise']#加注
		all_in=opp['all_in']#全押
		fold=opp['fold']#弃牌
		action_num=fold+check+raises+all_in+fold#计算总行为数
		init_card_power=0.5+(check/action_num)/8+(raises/action_num)/4+(all_in/action_num)/4-(fold/action_num)/8
		#计算初始牌力
		call_jetton=opp['call_jetton']#已投注筹码
		now_jetton=opp['now_jetton']#当前未投注筹码
		all_jetton=call_jetton+now_jetton#总筹码
		actions=opp['behave'][-1]#取列表最后一次行为记录

		if actions['action'][0]=="fold":#弃牌
			now_card_power=0#将该选手牌力置0
			alive_num=alive_num-1#存活人数减少1
		else:
			now_card_power=init_card_power+(call_jetton/all_jetton)/8#根据当前已投入筹码计算对手牌力
		if max_card<now_card_power:
			max_card=now_card_power

	max_card=max_card + (alive_num/8)/8#存活人数越多，对手潜在威胁越高
	return max_card




#function:  选择阈值函数
#input:     对手牌力情况，决策列表，可见牌数 
#output:    决策阈值列表
def threshold(opponent_power,decisions,card_num):
	if card_num==2:#若只有手牌可见
		if opponent_power<0.4:
			return decisions1[0]
		elif opponent_power<0.5:
			return decisions1[1]
		elif opponent_power<0.6:
			return decisions1[2]
		elif opponent_power<0.7:
			return decisions1[3]
		elif opponent_power<0.8:
			return decisions1[4]
		else:
			return decisions1[5]
	else:#若有公共牌可见
		if opponent_power<0.5:
			return decisions2[0]
		elif opponent_power<0.6:
			return decisions2[1]
		elif opponent_power<0.7:
			return decisions2[2]
		elif opponent_power<0.8:
			return decisions2[3]
		elif opponent_power<0.9:
			return decisions2[4]
		else:
			return decisions2[5]












		



