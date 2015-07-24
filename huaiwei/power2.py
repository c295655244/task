#coding=utf-8
import random
def pointPower(point,color):
    num=len(point);
    if num==2:
        power=do2(point,color)
    elif num==5:
        power=do5(point,color,1)
    elif num>=6:
        power=do67(point,color)
    return power


def do2(point,color):
    map=[
         [1,1,2,2,3,5,5,5,5,5,5,5,5],
         [2,1,2,3,4,7,7,7,7,7,7,7,7],
         [3,4,1,3,4,5,7,9,9,9,9,9,9],
         [4,5,5,1,3,4,6,6,9,9,9,9,9],
         [6,6,6,5,2,4,5,7,9,9,9,9,9],
         [8,8,8,7,7,3,4,5,8,9,9,9,9],
         [9,9,9,8,8,7,4,5,6,8,9,9,9],
         [9,9,9,9,9,9,8,5,5,6,8,9,9],
         [9,9,9,9,9,9,9,8,5,6,7,9,9],
         [9,9,9,9,9,9,9,9,8,6,6,7,9],
         [9,9,9,9,9,9,9,9,9,8,7,7,8],
         [9,9,9,9,9,9,9,9,9,9,9,7,8],
         [9,9,9,9,9,9,9,9,9,9,9,9,7]
         ]
    if color[0]==color[1]:
       score=map[14-max(point)][14-min(point)] 
    else :
       score=map[14-min(point)][14-max(point)]
    score=(10.0-score)/10
    return score;

def posible(point,color):
    #判断牌型
    num=5;
    n=0;
    posib=0;
    #判断同花
    colorFlag=0;
    ccolor=color+[];
    ccolor.sort;
    while n<num-2:
        if ccolor[n]==ccolor[n+1] and ccolor[n+1]==ccolor[n+2]: 
            colorFlag=colorFlag+1;
        n=n+1;
    if colorFlag==1: #3
        posib=posib+(0.25*0.25)*(1302540+1098240+123552+54912+10200+5108/2)/2538360;
    elif colorFlag==2:#4
        posib=posib+(0.25+0.25)*(1302540+1098240+123552+54912+10200+5108/2)/2538360;
    n=0;
    #判断顺子123(4)
    continueFlag=0;
    cpoint=point+[];
    cpoint.sort();
    while n<num-2:
        if cpoint[n]==cpoint[n+1]-1  and cpoint[n+1]==cpoint[n+2]-1:
             continueFlag=continueFlag+1;
        n=n+1;
    if continueFlag==1:
        posib=posib+(float)(4.0/47*4.0/46*2*3)*(float)(1302540+1098240+123552+54912+10200/2)/2538360;
    elif  continueFlag==2: 
        posib=posib+(float)(8.0/47+8.0/46)*(1302540+1098240+123552+54912+10200/2)/2538360;
    #判断顺子1_34,12_4,
    #判断顺子1_3_5,
    #45_78
    n=0;
    continueFlag2=0;
    while n<num-2:
        if cpoint[n]==cpoint[n+1]-1  :
             continueFlag2=continueFlag2+1;
        n=n+1;
    if continueFlag!=2 and continueFlag2==2:
        posib=posib+(4.0/47+4.0/46)*(1302540+1098240+123552+54912+10200/2)/2538360;
    n=0;
    #判断对子
    pairNum=0;
    pair=[0,0,0,0,0];
    twoPair=0;
    threeSame=0;
    fullHouse=0;
    fourSame=0;
    while n<num-1:
        if cpoint[n]==cpoint[n+1]:
            pair[n]=pair[n]+1;
            pair[n+1]=pair[n+1]+1;
            pairNum=pairNum+1;
        n=n+1;
    if pairNum>=2:
        #两队:
        if max(pair)==1:
            twoPair=1;
        #三条
        elif max(pair)==2 and pair.count(2)==1 :
            threeSame=1;
            #俘虏
            if pairNum ==3:
                fullHouse=1;
    if threeSame==1:#3tiao->4tiao
        posib=posib+(1.0/47+1.0/46)*(1302540+1098240+123552+54912+10200+5108+3477+624/2)/2538360;
    if twoPair==1:
        posib=posib+(4.0/47*1.0/46)*(1302540+1098240+123552+54912+10200+5108+3477+624/2)/2538360+\
        (4.0/47+4.0/46)*(1302540+1098240+123552+54912+10200+5108+3477/2)/2538360;
    if pairNum==1:
        posib=posib+(2.0/47*1.0/46)*(1302540+1098240+123552+54912+10200+5108+3477+624/2)/2538360+\
        (2.0/47+2.0/46)*(1302540+1098240+123552+54912/2)/2538360;
    return posib
    

def do67(point,color):
    maxtype=0
    palace=0
    if len(point)==6:
        for i in range(0,len(point)-1):       
            pcolor=[]+color
            ppoint=[]+point
            del ppoint[i]
            del pcolor[i]
            thisPower=do5(ppoint,pcolor,2);
            if thisPower>maxtype :
                 palpce=i
                 maxtype=thisPower
    elif len(point)==7:
        for i in range(0,len(point)-1):       
             for j in range(0,len(point)-1):                
                pcolor=[]+color
                ppoint=[]+point
                del ppoint[i]
                del pcolor[i]
                del ppoint[j]
                del pcolor[j]
                thisPower=do5(ppoint,pcolor,2);
                if thisPower>maxtype :
                     palpce=i
                     maxtype=thisPower
    return maxtype


def do5(point,color,flag):#五张牌
    total=2598960;
    clolrAndPoint=40;
    fourSame=624;
    fullHouse=3744;
    sameColor=5180;
    continuePoint=10200;
    threeSame=54912;
    twoPair=123552;
    onePair=1098240;
    high=1302540;
    p=types(point,color);
    if p<200:
        Power=(float)(total-((1-(float)((p%100)-3)/9))*clolrAndPoint)/total;
    elif p<300:
        Power=(float)(total-clolrAndPoint-((1-(float)((p%100)-1)/13))*fourSame)/total;    
    elif p<400:
        Power=(float)(total-clolrAndPoint-fourSame-((1-(float)((p%100)-1)/13))*fullHouse)/total; 
    elif p<500:
        Power=(float)(total-clolrAndPoint-fourSame-fullHouse-(float)((1-(float)((p%100)-1)/13))*sameColor)/total; 
    elif p<600:
        Power=(float)(total-clolrAndPoint-fourSame-fullHouse-sameColor-((1-(float)((p%100)-1)/13))*continuePoint)/total; 
    elif p<700:
        Power=(float)(total-clolrAndPoint-fourSame-fullHouse-sameColor-continuePoint-((1-(float)((p%100)-1)/13))*threeSame)/total; 
    elif p<800:
        Power=(float)(total-clolrAndPoint-fourSame-fullHouse-sameColor-continuePoint-threeSame-((1-((p%100)-1.01)/13.13))*twoPair)/total; 
    elif p<900:
        Power=(float)(total-clolrAndPoint-fourSame-fullHouse-sameColor-continuePoint-threeSame-twoPair-((1-((p%100)-1.01)/13.13))*onePair)/total; 
    else:
        Power=(float)((float)(p/10-606)/707)*high/total;
    if(flag==1):
        po=posible(point,color);
    else:
        po=0
    f=Power+po*(float)(1-Power);'''
    ######-----------------------------------------------------------------------------------------------------------------------------------------------------
    print p;
    print Power
    print po
    #######--------------------------------------------------------------------------------------------------------------------------------------------------
    '''
    return f;

def types(point,color):
    #判断牌型
    num=5;
    n=0;
    #判断同花
    colorFlag=0;
    ccolor=[]+color;
    ccolor.sort;
    while n<num-1:      
        if ccolor[n]!=ccolor[n+1]:
            colorFlag=1;
            break;
        n=n+1;
    n=0;
    #判断顺子
    continueFlag=0;
    cpoint=[]+point;
    cpoint.sort();
    while n<num-1:
        if cpoint[n]!=cpoint[n+1]-1:
            continueFlag=1;
            break;
        n=n+1;
    n=0;
    #判断同花顺
    if colorFlag==0 and continueFlag==0:
         return 100+cpoint[2];   
    #判断对子
    pairNum=0;
    pair=[0,0,0,0,0];
    twoPair=0;
    threeSame=0;
    fullHouse=0;
    fourSame=0;
    while n<num-1:
        if cpoint[n]==cpoint[n+1]:
            pair[n]=pair[n]+1;
            pair[n+1]=pair[n+1]+1;
            pairNum=pairNum+1;
        n=n+1;
    if pairNum>=2:
        #两队:
        if max(pair)==1:
            twoPair=1;
        #三条
        elif max(pair)==2 and pair.count(2)==1 :
            threeSame=1;
            #俘虏
            if pairNum ==3:
                fullHouse=1;
        #四条
        elif pairNum==4 and pair.count(2)==2 :
            fourSame=1;   
    #返回
    if fourSame==1:
        return 200+cpoint[2];
    if fullHouse==1:
        return 300+cpoint[2];
    if colorFlag==0:
        return 400+cpoint[4];
    if continueFlag==0:
        return 500+cpoint[2];
    if threeSame==1:
        return 600+cpoint[2];
    if twoPair==1:
        return 700+cpoint[3]+0.01*point[1];
    if pairNum==1:
        if pair.index(1)!=3:
            return 800+cpoint[pair.index(1)]+0.01*cpoint[4];
        else :
            return 800+cpoint[pair.index(1)]+0.01*cpoint[2];
    else:
            return (cpoint[4]*100+cpoint[3])*10;





two=0

three=0

four=0

five=0 

six=0

seven=0

eight=0

night= 0
sums=0

for i in range(10000):
    a=random.uniform(2, 14)
    b=random.uniform(2, 14)
    c=random.uniform(2, 14)
    d=random.uniform(2, 14)
    e=random.uniform(2, 14)
    p=[int(a),int(b)]
    c=["r","g"]
    pp=pointPower(p,c);
    print pp
    if pp>0.2 and pp<=0.3:    
        two=two+1
    elif pp>0.3 and pp<=0.4:    
        three=three+1 
    elif pp>0.4 and pp<=0.5:    
        four=four+1 
    elif pp>0.5 and pp<=0.6:    
        five=five+1 
    elif pp>0.6 and pp<=0.7:    
        six=six+1 
    elif pp>0.7 and pp<=0.8:    
        seven=seven+1 
    elif pp>0.8 and pp<=0.9:    
        eight=eight+1 
    elif pp>0.9 and pp<=1:    
        night=night+1 

    sums=sums+pp


print '2   ',two
print '3   ',three
print '4   ',four
print '5   ',five
print '6   ',six
print '7   ',seven
print '8   ',eight
print '9   ',night
print "final:"  ,pp
print "ave:" ,sums/10000