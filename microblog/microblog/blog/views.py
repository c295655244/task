 #coding=utf-8
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.template import RequestContext
from microblog.blog.models import *
from django.forms import *
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, InvalidPage, EmptyPage
from microblog.blog.models import *
from microblog.blog.forms import *
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
import simplejson
import datetime,time
import traceback
# Create your views here.


@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def index(request):#显示主页
    
    return render_to_response('index.html')





@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def mine(request,username):#显示个人界面    
    follow_user=[]
    fans_user=[]
    same_user=[]
    present_user=t_user_info.objects.get(user_login=username)
    user=t_user_info.objects.get(user_login=request.user.username)

    follow_id=t_user_relation.objects.filter(user_id=present_user.user_id)  
    for follow in follow_id:
        follow_user.append(t_user_info.objects.get(user_id=follow.follow_id))



    for follow in follow_id:
        try:
            t_user_relation.objects.get(user_id=user.user_id,follow_id=follow.follow_id)      
            same_user.append(t_user_info.objects.get(user_id=follow.follow_id))
        except:
            #print traceback.format_exc()      
            continue



    fans_id=t_user_relation.objects.filter(follow_id=present_user.user_id)
    for fans in fans_id:
        fans_user.append(t_user_info.objects.get(user_id=fans.user_id))


    return render_to_response('mine.html',{'present_user':present_user,'same_user':same_user,'user':user,'follow_user':follow_user,'fans_user':fans_user})
    


@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def change(request,username):#显示个人界面    
    follow_user=[]
    fans_user=[]
    same_user=[]
    present_user=t_user_info.objects.get(user_login=username)
    user=t_user_info.objects.get(user_login=request.user.username)

    follow_id=t_user_relation.objects.filter(user_id=present_user.user_id)  
    for follow in follow_id:
        follow_user.append(t_user_info.objects.get(user_id=follow.follow_id))



    for follow in follow_id:
        try:
            t_user_relation.objects.get(user_id=user.user_id,follow_id=follow.follow_id)      

            same_user.append(t_user_info.objects.get(user_id=follow.follow_id))
        except:
            print traceback.format_exc()      
            continue



    fans_id=t_user_relation.objects.filter(follow_id=present_user.user_id)
    for fans in fans_id:
        fans_user.append(t_user_info.objects.get(user_id=fans.user_id))


    return render_to_response('mine-information-change.html',{'present_user':present_user,'same_user':same_user,'user':user,'follow_user':follow_user,'fans_user':fans_user})
    



@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def mine_information(request,username):
    follow_user=[]
    fans_user=[]
    same_user=[]



   
    try:
        present_user=t_user_info.objects.get(user_login=username)
        user=t_user_info.objects.get(user_login=request.user.username)
        print  traceback.format_exc() 
        follow_id=t_user_relation.objects.filter(user_id=present_user.user_id)
        for follow in follow_id:
            follow_user.append(t_user_info.objects.get(user_id=follow.follow_id))

        for follow in follow_id:
            try:
                t_user_relation.objects.get(user_id=user.user_id,follow_id=follow.follow_id)      
                same_user.append(t_user_info.objects.get(user_id=follow.follow_id))
            except:
                print traceback.format_exc()      
                continue




        fans_id=t_user_relation.objects.filter(follow_id=present_user.user_id)
        for fans in fans_id:
            fans_user.append(t_user_info.objects.get(user_id=fans.user_id))
    except:
        print  traceback.format_exc() 
    return render_to_response('mine-information.html',{'present_user':present_user,'same_user':same_user,'user':user,'follow_user':follow_user,'fans_user':fans_user})



@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def mine_message(request,username):
    follow_user=[]
    fans_user=[]
    same_user=[]
    try:
        present_user=t_user_info.objects.get(user_login=username)
        user=t_user_info.objects.get(user_login=request.user.username)
        print  traceback.format_exc() 
        follow_id=t_user_relation.objects.filter(user_id=present_user.user_id)
        for follow in follow_id:
            follow_user.append(t_user_info.objects.get(user_id=follow.follow_id))


        for follow in follow_id:
            try:
                t_user_relation.objects.get(user_id=user.user_id,follow_id=follow.follow_id)      
                same_user.append(t_user_info.objects.get(user_id=follow.follow_id))
            except:
                print traceback.format_exc()      
                continue



        fans_id=t_user_relation.objects.filter(follow_id=present_user.user_id)
        for fans in fans_id:
            fans_user.append(t_user_info.objects.get(user_id=fans.user_id))
    except:
        print  traceback.format_exc() 
    return render_to_response('mine-message.html',{'present_user':present_user,'same_user':same_user,'user':user,'follow_user':follow_user,'fans_user':fans_user})






@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def home(request):#显示主页
    try:
        user=t_user_info.objects.get(user_login=request.user.username)
    except:
        print "home error!"
    user_msg=t_user_info.objects.order_by('-msg_count')[:5]
    user_fans=t_user_info.objects.order_by('-fans_count')[:5]
    user_follow=t_user_info.objects.order_by('-follow_count')[:5]
    msg_zan=t_msg_info.objects.order_by('-zan_count')[:5]

    return render_to_response('home.html',
        {'user':user,
        'user_msg':user_msg,
        'user_fans':user_fans,
        'user_follow':user_follow,
        'msg_zan':msg_zan
        } )







@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def comment(request):#显示评论分页
    try:
        user=t_user_info.objects.get(user_login=request.user.username)
    except:
        print "home error!"
    user_msg=t_user_info.objects.order_by('-msg_count')[:5]
    user_fans=t_user_info.objects.order_by('-fans_count')[:5]
    user_follow=t_user_info.objects.order_by('-follow_count')[:5]
    msg_zan=t_msg_info.objects.order_by('-zan_count')[:5]

    return render_to_response('comment.html',
        {'user':user,
        'user_msg':user_msg,
        'user_fans':user_fans,
        'user_follow':user_follow,
        'msg_zan':msg_zan
        } )

@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def zan(request):#显示赞分页
    try:
        user=t_user_info.objects.get(user_login=request.user.username)
    except:
        print "home error!"
    user_msg=t_user_info.objects.order_by('-msg_count')[:5]
    user_fans=t_user_info.objects.order_by('-fans_count')[:5]
    user_follow=t_user_info.objects.order_by('-follow_count')[:5]
    msg_zan=t_msg_info.objects.order_by('-zan_count')[:5]

    return render_to_response('zan.html',
        {'user':user,
        'user_msg':user_msg,
        'user_fans':user_fans,
        'user_follow':user_follow,
        'msg_zan':msg_zan
        } )


@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def letter(request):#显示私信分页
    try:
        user=t_user_info.objects.get(user_login=request.user.username)
    except:
        print "home error!"
    user_msg=t_user_info.objects.order_by('-msg_count')[:5]
    user_fans=t_user_info.objects.order_by('-fans_count')[:5]
    user_follow=t_user_info.objects.order_by('-follow_count')[:5]
    msg_zan=t_msg_info.objects.order_by('-zan_count')[:5]

    return render_to_response('letter.html',
        {'user':user,
        'user_msg':user_msg,
        'user_fans':user_fans,
        'user_follow':user_follow,
        'msg_zan':msg_zan
        } )


@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def message(request):#显示留言分页
    try:
        user=t_user_info.objects.get(user_login=request.user.username)
    except:
        print "home error!"
    user_msg=t_user_info.objects.order_by('-msg_count')[:5]
    user_fans=t_user_info.objects.order_by('-fans_count')[:5]
    user_follow=t_user_info.objects.order_by('-follow_count')[:5]
    msg_zan=t_msg_info.objects.order_by('-zan_count')[:5]

    return render_to_response('message.html',
        {'user':user,
        'user_msg':user_msg,
        'user_fans':user_fans,
        'user_follow':user_follow,
        'msg_zan':msg_zan
        } )

#获取评论页面函数
def get_comment_page(request):
    if request.method == 'POST':
        user=t_user_info.objects.get(user_login=request.user.username)
        classid = request.POST['classid']
        dict = {}
        data_all=[]
        item={}
        data="Y"
        transmit_num=0
        if classid == "":#显示自己的评论
            try:
                msg_index = t_uer_msg_index.objects.filter(user_id=user.user_id)
                for msg_index_item in msg_index:
                    present_user=t_user_info.objects.get(user_id=msg_index_item.author_id)
                    present_msg=t_msg_info.objects.get(msg_id=msg_index_item.msg_id)
                    if present_msg.type_bool ==1:
                        try:
                            transmit_relation=t_msg_msg_relation.objects.get(reference_id=msg_index_item.author_id,reference_msg_id=msg_index_item.msg_id)
                            transmit_num=transmit_relation.referenced_msg_id
                        except:
                            print  traceback.format_exc()   
                            print "转发信息无法读取，fetchshares函数出错！"  
                    if present_user.user_sex=="女":
                        sex=0
                    else:
                        sex=1
                    zan_id=t_msg_zan.objects.filter(msg_id=present_msg.msg_id,user_id=user.user_id)
                    if zan_id:
                        isding=True
                    else:
                        isding=False
                    item={
                    "username": present_user.user_login,
                    "commentcount": present_msg.comment_count,
                    "pvcount": 0, 
                    "uid": present_user.user_id,
                    "pubdate": str(present_msg.time_t),
                    "class_id": 1, 
                    "isding": isding, 
                    "sex": sex, 
                    "content": present_msg.content+"||||||", 
                    "class_name": "宋健417",
                    "dingcount": present_msg.zan_count,
                    "gravatar": "c295655244.jpg",
                    "transmit": transmit_num, 
                    "sharecount": present_msg.transfer_count, 
                    "nickname": present_user.user_name,
                    "id": present_msg.msg_id,
                     "iscream": False
                    }
                    data_all.append(item)
                    transmit_num=0
            except:
                data='N'
                print traceback.format_exc()         
            dict={
                    "items":data_all,
                    "data": data, 
                    "uid": user.user_id, 
                    "staff": False
            }
            json=simplejson.dumps(dict)
            return HttpResponse(json)

        if classid == "1":#显示别人对自己的评论
            try:
                msg_index = t_uer_msg_index.objects.filter(user_id=user.user_id,author_id=user.user_id)
                for msg_index_item in msg_index:
                    present_user=t_user_info.objects.get(user_id=msg_index_item.author_id)
                    present_msg=t_msg_info.objects.get(msg_id=msg_index_item.msg_id)
                    if present_msg.type_bool ==1:
                        try:
                            transmit_relation=t_msg_msg_relation.objects.get(reference_id=msg_index_item.author_id,reference_msg_id=msg_index_item.msg_id)
                            transmit_num=transmit_relation.referenced_msg_id
                        except:
                            print  traceback.format_exc()   
                            print "转发信息无法读取，fetchshares函数出错！"  
                    if present_user.user_sex=="女":
                        sex=0
                    else:
                        sex=1
                    zan_id=t_msg_zan.objects.filter(msg_id=present_msg.msg_id,user_id=user.user_id)
                    if zan_id:
                        isding=True
                    else:
                        isding=False
                    item={
                    "username": present_user.user_login,
                    "commentcount": present_msg.comment_count,
                    "pvcount": 0, 
                    "uid": present_user.user_id,
                    "pubdate": str(present_msg.time_t),
                    "class_id": 1, 
                    "isding": isding, 
                    "sex": sex, 
                    "content": present_msg.content+"||||||", 
                    "class_name": "宋健417",
                    "dingcount": present_msg.zan_count,
                    "gravatar": "c295655244.jpg",
                    "transmit": transmit_num, 
                    "sharecount": present_msg.transfer_count, 
                    "nickname": present_user.user_name,
                    "id": present_msg.msg_id,
                     "iscream": False
                    }
                    data_all.append(item)
                    transmit_num=0
            except:
                data='N'
                print traceback.format_exc()         
            dict={
                    "items":data_all,
                    "data": data, 
                    "uid": user.user_id, 
                    "staff": False
            }
            json=simplejson.dumps(dict)
            return HttpResponse(json)





#删除微博
def delshare(request):
    dict = {}
    if request.method == 'POST':
        user=t_user_info.objects.get(user_login=request.user.username)
        msg_id =int(request.POST['id'])
        user_id =int(request.POST['uid'])
        '''
        删除消息操作：
        1.删除t_msg_info_A中的元数据msg_a
        2.删除t_uer_msg_index_A中的User_a，msg_a行记录
        3.在t_msg_msg_relation_A表中找到msg_a的源消息，即B的msg_b
        4.删除t_msg_msg_relation_A中user_a，msg_a和user_b，msg_b的转发关系
        5.更新t_msg_info_B中msg_b记录的Transfer_count，减1
        '''

        try:
            msg=t_msg_info.objects.get(msg_id=msg_id,user_id=user_id)
            if msg.type_bool==1:
                source_relation=t_msg_msg_relation.objects.get(reference_id=user_id,reference_msg_id=msg_id)
                try:
                    source_msg=t_msg_info.objects.get(msg_id=source_relation.referenced_msg_id,user_id=source_relation.referenced_id)
                    source_msg.transfer_count=source_msg.transfer_count-1
                    source_msg.save()
                except:
                    print "被转载消息已被删除!"
                source_relation.delete()
            try:
                msg_zan=t_msg_zan.objects.filter(msg_id=msg_id,user_id=user_id)
                msg_zan.delete()
            except:
                print traceback.format_exc()
                print "该微博删除时没有赞"
            try:
                comment=t_comment_info.objects.filter(msg_id=msg.msg_id)
                comment.delete()
            except:
                print traceback.format_exc()      
                print "该微博删除时没有评论"         
            msg_index = t_uer_msg_index.objects.filter(author_id= user_id,msg_id= msg_id)
            for msg_item_index in msg_index:
                msg_item_index.delete()
            msg.delete()
            user.msg_count=user.msg_count-1
            user.save()
        except:
            print traceback.format_exc()
            return HttpResponse("N")
    return HttpResponse("Y")


#获取评论列表
def fetchcomments(request):
    if request.method == 'POST':   
        items=[]
        item={}
        data={}
        user=t_user_info.objects.get(user_login=request.user.username)        
        try:
            msg_id =request.POST['id'] 
            comments=t_comment_info.objects.filter(msg_id=msg_id)

            for comment in comments:
                comment_user=t_user_info.objects.get(user_id=comment.user_id)
                item={
                "username": comment_user.user_login, 
                "content": comment.content, 
                "gravatar": "", 
                "uid": comment.user_id, 
                "pubdate": str(comment.time_t), 
                "comment_id": comment.comment_id, 
                "nickname":comment_user.user_name,
                 "sex": 1
                 }
                items.append(item)
            data={"items": items, "data": "Y", "uid": user.user_id, "staff": False}
            json=simplejson.dumps(data)
            return HttpResponse(json)
        except:
            data={"items": [], "data": "N", "uid": user.user_id, "staff": false}
            print traceback.format_exc()
            json=simplejson.dumps(data)
            return HttpResponse(json)
#添加评论
def savecomment(request):
    if request.method == 'POST': 
        items=[]
        item={}
        data={}
        user=t_user_info.objects.get(user_login=request.user.username)
        
        msg_id =int(request.POST['shareid']) 
        msg=t_msg_info.objects.get(msg_id=msg_id)
        content=request.POST['text']
        try:
            comment=t_comment_info.objects.create(
                user_id=user.user_id,
                content=content,
                msg_id=msg_id,
                time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
            )
            msg.commented_count=msg.commented_count+1
            msg.comment_count=msg.comment_count+1
            msg.save()
            item={
                "username": request.user.username, 
                "content": content, 
                "gravatar": "", 
                "uid": user.user_id, 
                "pubdate": str(comment.time_t), 
                "comment_id": comment.comment_id, 
                "nickname": user.user_name,
                 "sex": 1
             }
            items.append(item)
            data={"items": items, "data": "Y", "uid": user.user_id, "staff": False}
            json=simplejson.dumps(data)
            return HttpResponse(json)
        except:
            data={"items": [], "data": "N", "uid": user.user_id, "staff": False}
            print traceback.format_exc()
            json=simplejson.dumps(data)
            return HttpResponse(json)         

#删除评论
def delcomment(request):
    if request.method == 'POST':
        items=[]
        item={}
        data={}
        user=t_user_info.objects.get(user_login=request.user.username)
        comment_id =int(request.POST['id']) 
        try:
            comment=t_comment_info.objects.get(comment_id=comment_id,user_id=user.user_id)
            msg=t_msg_info.objects.get(msg_id=comment.msg_id)      
            comment.delete()
            msg.comment_count=msg.comment_count-1
            msg.save()
            return HttpResponse("Y")  
        except:
            print traceback.format_exc()            
            return HttpResponse("N")


#发表微博函数
@login_required(login_url='/login/')#使用这个方法是要求用户登录的
def saveshare(request):
    dict = {}
    info = 'Data log save success'
    # try:
    if request.method == 'POST':
        user=t_user_info.objects.get(user_login=request.user.username)
        images =request.POST['image']
        texts =request.POST['text']
        trans  =request.POST['transmit']
        username=user.user_name
        userid=user.user_id
        if trans !="":
            transmits=int(trans)
        else:
            transmits=0
        if user.user_sex=="女":
            sex=0
        else:
            sex=1
        data='Y'
        '''
        添加微博的数据库操作：
        1.在t_msg_info_A中添加这条元消息，type为0
        2.更新t_user_info_A中Msg_count
        3.在t_uer_msg_index_A中插入A发的这条消息的索引（A的编号和消息编号）
        4.在t_user_relation_A中找到所有关注A的人，比如B,C,D,E,F等等，并发在这些用户的t_uer_msg_index中插入A的这条信息索引
        '''

        if transmits==0:
            try:
                message = t_msg_info.objects.create(
                                            user_id= user.user_id,#发消息用户编号（联合主键）
                                            content=texts,#消息内容
                                            type_bool=0,#消息类型（0，原创；1转发）
                                            commented_count= 0,#评论过数量（只增不减，删除评论不影响此值，可以作为评论多页显示的页码）
                                            comment_count= 0,#保留的评论数量
                                            transferred_count= 0,#转发过数量（只增不减，删除转发不影响此值，可以作为转发多页显示的页码）
                                            transfer_count= 0,#保留的转发数量
                                            zan_count=0,
                                            time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())#发布时间
                                         )
                user.msg_count=user.msg_count+1
                user.save()
                msg_index = t_uer_msg_index.objects.create(
                                        user_id = user.user_id,
                                        author_id= user.user_id,
                                        msg_id= message.msg_id,
                                        time_t =time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
                                         )
                try:
                    user_relation=t_user_relation.objects.filter(follow_id=user.user_id)#a关注b
                    for user_follow in user_relation:
                            msg_index = t_uer_msg_index.objects.create(
                                user_id = user_follow.user_id,
                                author_id= user.user_id,
                                msg_id= message.msg_id,
                                time_t =time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
                                 )
                except:
                    print "该用户没有关注者"
                #print   message.user_id,message.content,message.type_bool,message.commented_count,message.comment_count,message.transferred_count,message.transfer_count,message.time_t
            except  :
                data='N'
                print traceback.format_exc()


            dict={"items": 
            [
                {"username": user.user_login,
                "commentcount": 0,
                "pvcount": 0, 
                "uid": userid,
                "pubdate": str(message.time_t),
                "class_id": 1, 
                "isding": False, 
                "sex": sex, 
                "content": texts+"||||||", 
                "class_name": "宋健417",
                "dingcount": 0,
                "gravatar": "c295655244.jpg",
                "transmit": 0, 
                "sharecount": 0, 
                "nickname": username,
                "id": message.msg_id,
                 "iscream": False}], 
                "data": data, 
                "uid": userid, 
                "staff": False}
        else:
            try:
                message = t_msg_info.objects.create(
                                            user_id= user.user_id,#发消息用户编号（联合主键）
                                            content=texts,#消息内容
                                            type_bool=1,#消息类型（0，原创；1转发）
                                            commented_count= 0,#评论过数量（只增不减，删除评论不影响此值，可以作为评论多页显示的页码）
                                            comment_count= 0,#保留的评论数量
                                            transferred_count= 0,#转发过数量（只增不减，删除转发不影响此值，可以作为转发多页显示的页码）
                                            transfer_count= 0,#保留的转发数量
                                            zan_count=0,
                                            time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())#发布时间
                                         )
                user.msg_count=user.msg_count+1
                user.save()
                source_msg=t_msg_info.objects.get(msg_id=transmits)
                source_user=t_user_info.objects.get(user_id=source_msg.user_id)
                source_msg.transferred_count=source_msg.transferred_count+1
                source_msg.transfer_count=source_msg.transfer_count+1
                source_msg.save()
                msg_relation=t_msg_msg_relation.objects.create(
                    reference_id= userid,
                    reference_msg_id= message.msg_id,
                    referenced_id= source_user.user_id,#消息发布者编号
                    referenced_msg_id= transmits,
                    time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())#发布时间
                    )

                msg_index = t_uer_msg_index.objects.create(
                                        user_id = user.user_id,
                                        author_id= user.user_id,
                                        msg_id= message.msg_id,
                                        time_t =time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
                                         )
                try:
                    user_relation=t_user_relation.objects.filter(follow_id=user.user_id)#a关注b
                    print "error!"
                    for user_follow in user_relation:
                            msg_index = t_uer_msg_index.objects.create(
                                user_id = user_follow.user_id,
                                author_id= user.user_id,
                                msg_id= message.msg_id,
                                time_t =time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
                                 )
                except:
                    print traceback.format_exc()
                    print "该用户没有关注者"
                #print   message.user_id,message.content,message.type_bool,message.commented_count,message.comment_count,message.transferred_count,message.transfer_count,message.time_t
            except  :
                data='N'
                print traceback.format_exc()


            dict={"items": 
            [
                {"username": user.user_login,
                "commentcount": 0,
                "pvcount": 0, 
                "uid": user.user_id,
                "pubdate": str(message.time_t),
                "class_id": 1, 
                "isding": False, 
                "sex": sex, 
                "content": texts+"||||||", 
                "class_name": "宋健417",
                "dingcount": 0,
                "gravatar": "c295655244.jpg",
                "transmit": transmits, 
                "sharecount": 0, 
                "nickname": user.user_name,
                "id": message.msg_id,
                 "iscream": False}], 
                "data": data, 
                "uid": userid, 
                "staff": False}
    json=simplejson.dumps(dict)
    return HttpResponse(json)

def fetchshare(request):#加载转载的微博
    if request.method == 'POST':
        user=t_user_info.objects.get(user_login=request.user.username)
        msg_id=int(request.POST['id'])
        dict = {}
        data_all=[]
        item={}
        data="Y"
        try:
            source_msg=t_msg_info.objects.get(msg_id=msg_id)
            source_user=t_user_info.objects.get(user_id=source_msg.user_id)
            try:
                if source_user.user_sex=="女":
                    sex=0
                else:
                    sex=1
                zan_id=t_msg_zan.objects.filter(msg_id=source_msg.msg_id,user_id=user.user_id)
                if zan_id:
                    isding=True
                else:
                    isding=False
                item={
                "username": source_user.user_login,
                "commentcount": source_msg.comment_count,
                "pvcount": 0, 
                "uid": source_user.user_id,
                "pubdate":str(source_msg.time_t),
                "class_id": 1, 
                "isding": isding, 
                "sex": sex, 
                "content": source_msg.content+"||||||", 
                "class_name": "宋健417",
                "dingcount": source_msg.zan_count,
                "gravatar": "c295655244.jpg",
                "transmit": 0, 
                "sharecount": source_msg.transfer_count, 
                "nickname": source_user.user_name,
                "id": source_msg.msg_id,
                 "iscream": False
                }
                data_all.append(item)
            except:
                data='N'
                print traceback.format_exc()
        except: 
            data='N'
            print traceback.format_exc()        
        dict={
                "items":data_all,
                "data": data, 
                "uid": user.user_id, 
                "staff": False
        }
        json=simplejson.dumps(dict)
        return HttpResponse(json)



def searchshare(request):#查找微博
    if request.method == 'POST': 
        dict={}
        items=[]
        item={}
        num=0
        data="Y"
        transmit_num=0
        user=t_user_info.objects.get(user_login=request.user.username) 
        types=request.POST['searchtype']
        content=request.POST['searchkey']
        id=int(request.POST['searchuid'])
        if types=="nickname":
            try:
                present_user=t_user_info.objects.get(user_name=content)
                msg=t_msg_info.objects.filter(user_id=present_user.user_id)
                for msg_item in msg:
                    if msg_item.type_bool ==1:
                        try:
                            transmit_relation=t_msg_msg_relation.objects.get(reference_id=msg_item.user_id,reference_msg_id=msg_item.msg_id)
                            transmit_num=transmit_relation.referenced_msg_id
                        except:
                            print  traceback.format_exc()   
                            print "转发信息无法读取，fetchshares函数出错！" 
                    if present_user.user_sex=="女":
                        sex=0
                    else:
                        sex=1
                    zan_id=t_msg_zan.objects.filter(msg_id=msg_item.msg_id,user_id=present_user.user_id)
                    if zan_id:
                        isding=True
                    else:
                        isding=False
                    item={
                    "username": present_user.user_login,
                    "commentcount": msg_item.comment_count,
                    "pvcount": 0, 
                    "uid": present_user.user_id,
                    "pubdate": str(msg_item.time_t),
                    "class_id": 1, 
                    "isding": isding, 
                    "sex": sex, 
                    "content": msg_item.content+"||||||", 
                    "class_name": "宋健417",
                    "dingcount": msg_item.zan_count,
                    "gravatar": "c295655244.jpg",
                    "transmit": transmit_num, 
                    "sharecount": msg_item.transfer_count, 
                    "nickname": present_user.user_name,
                    "id": msg_item.msg_id,
                     "iscream": False
                    }
                    items.append(item)
                    num=num+1
            except:
                print traceback.format_exc() 
                data='N'
        elif types=="content":
            try:
                if id!=0:
                    msg=t_msg_info.objects.filter(content__contains=content,user_id=id)
                else:
                    msg=t_msg_info.objects.filter(content__contains=content)
                for msg_item in msg:
                    if msg_item.type_bool ==1:
                        try:
                            transmit_relation=t_msg_msg_relation.objects.get(reference_id=msg_item.user_id,reference_msg_id=msg_item.msg_id)
                            transmit_num=transmit_relation.referenced_msg_id
                        except:
                            print  traceback.format_exc()   
                            print "转发信息无法读取，fetchshares函数出错！" 
                    present_user=t_user_info.objects.get(user_id=msg_item.user_id)
                    if present_user.user_sex=="女":
                        sex=0
                    else:
                        sex=1
                    zan_id=t_msg_zan.objects.filter(msg_id=msg_item.msg_id,user_id=present_user.user_id)
                    if zan_id:
                        isding=True
                    else:
                        isding=False
                    item={
                    "username": present_user.user_login,
                    "commentcount": msg_item.comment_count,
                    "pvcount": 0, 
                    "uid": present_user.user_id,
                    "pubdate": str(msg_item.time_t),
                    "class_id": 1, 
                    "isding": isding, 
                    "sex": sex, 
                    "content": msg_item.content+"||||||", 
                    "class_name": "宋健417",
                    "dingcount": msg_item.zan_count,
                    "gravatar": "c295655244.jpg",
                    "transmit": transmit_num, 
                    "sharecount": msg_item.transfer_count, 
                    "nickname": present_user.user_name,
                    "id": msg_item.msg_id,
                     "iscream": False
                    }
                    items.append(item)
                    num=num+1
            except:
                print traceback.format_exc() 
                data='N'


        dict={
        "items":items,
        "resultcount": num, 
        "data": data,
         "uid": user.user_id, 
         "staff": False
        }
        json=simplejson.dumps(dict)
        return HttpResponse(json)







#关注函数
def followprocess(request):

    '''
    关注操作：
    1.a关注b时，添加t_user_relation表，user_id为a,follow_id为b
    2.t_uer_msg_index表添加与a相关的记录
    3.a取消关注b时，删除t_user_relation表
    4.t_uer_msg_index表删除与a相关的记录
    '''

    if request.method == 'POST':  
        data={}
        data={"data": "Y", "error": ""}
        user=t_user_info.objects.get(user_login=request.user.username)
        follow=int(request.POST['uid'])
        action =request.POST['action']
        if action=="add":
            try:
                if user.user_id==follow:
                    data={"data": "N", "error": "您不能关注自己！"}
                else:
                    t_user_relation.objects.get(user_id =user.user_id , follow_id = follow)
                    data={"data": "N", "error": "您已关注该好友，请刷新一下试试！"}
            except:
                relation = t_user_relation.objects.create(
                    user_id = user.user_id,#用户编号
                    follow_id = follow#被关注者编号
                    )
                try:
                    #exists()
                    msg=t_msg_info.objects.filter(user_id=follow)
                    for msg_item in msg:
                            msg_index = t_uer_msg_index.objects.create(
                                user_id = user.user_id,
                                author_id= follow,
                                msg_id= msg_item.msg_id,
                                time_t =time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
                                 )
                    user.follow_count=user.follow_count+1
                    user.save()
                    user_fensi=t_user_info.objects.get(user_id = follow)
                    user_fensi.fans_count=user_fensi.fans_count+1
                    user_fensi.save()
                except:
                    print "添加关注时，被关注人并没有微博"
                    data={"data": "N", "error": "数据库出现错误！"}
                    print traceback.format_exc()



        elif action=="beg":
            try:
                if user.user_id==follow:
                    data={"data": "N", "error": "您不能关注自己！"}
                else:
                    t_user_relation.objects.get(user_id =follow , follow_id = user.user_id)
                    data={"data": "N", "error": "该好友已关注您，快与他聊天吧！"}
            except:
                try:
                    present_user=t_user_info.objects.get(user_id=follow)
                    letter=t_letter.objects.create(
                        user_id=present_user.user_id,
                        letter_user_id=user.user_id,
                        context="关注我吧！大家交个朋友～",
                        time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()),
                        read=0
                        )
                except:
                    print "发送求关注私信失败！"
                    data={"data": "N", "error": "数据库出现错误！"}
                    print traceback.format_exc()



        else:
            try:
                relation = t_user_relation.objects.filter(user_id = user.user_id,follow_id = follow)
                relation.delete()
                msg_index=t_uer_msg_index.objects.filter(author_id=follow)
                msg_index.delete()
                user.follow_count=user.follow_count-1
                user.save()
                user_fensi=t_user_info.objects.get(user_id = follow)
                user_fensi.fans_count=user_fensi.fans_count-1
                user_fensi.save()
            except:
                print "删除关注时，被关注人并没有微博"
                data={"data": "N", "error": "数据库出现错误或您已经取消关注，请刷新重试！"}
                print traceback.format_exc()
        json=simplejson.dumps(data)
        return HttpResponse(json)



#获取初始列表
def fetchshares(request):
    if request.method == 'POST':
        user_logined=user=t_user_info.objects.get(user_login=request.user.username)
        #user_logined代表已经登陆的用户，用于标志数据报是哪个用户请求的
        classid = request.POST['classid']

        id=int(request.POST['uid'])
        if id!=0:
            user=t_user_info.objects.get(user_id=id)#当个人主页需要显示所有查看用户信息时，就要依靠uid
        dict = {}
        data_all=[]
        item={}
        data="Y"
        transmit_num=0
        if classid == "":#显示好友与自己的微博
            try:
                msg_index = t_uer_msg_index.objects.filter(user_id=user.user_id)
                for msg_index_item in msg_index:
                    present_user=t_user_info.objects.get(user_id=msg_index_item.author_id)
                    present_msg=t_msg_info.objects.get(msg_id=msg_index_item.msg_id)
                    if present_msg.type_bool ==1:
                        try:
                            transmit_relation=t_msg_msg_relation.objects.get(reference_id=msg_index_item.author_id,reference_msg_id=msg_index_item.msg_id)
                            transmit_num=transmit_relation.referenced_msg_id
                        except:
                            print  traceback.format_exc()   
                            print "转发信息无法读取，fetchshares函数出错！"  
                    if present_user.user_sex=="女":
                        sex=0
                    else:
                        sex=1
                    zan_id=t_msg_zan.objects.filter(msg_id=present_msg.msg_id,user_id=user.user_id)
                    if zan_id:
                        isding=True
                    else:
                        isding=False
                    item={
                    "username": present_user.user_login,
                    "commentcount": present_msg.comment_count,
                    "pvcount": 0, 
                    "uid": present_user.user_id,
                    "pubdate": str(present_msg.time_t),
                    "class_id": 1, 
                    "isding": isding, 
                    "sex": sex, 
                    "content": present_msg.content+"||||||", 
                    "class_name": "宋健417",
                    "dingcount": present_msg.zan_count,
                    "gravatar": "c295655244.jpg",
                    "transmit": transmit_num, 
                    "sharecount": present_msg.transfer_count, 
                    "nickname": present_user.user_name,
                    "id": present_msg.msg_id,
                     "iscream": False
                    }
                    data_all.append(item)
                    transmit_num=0
            except:
                data='N'
                print traceback.format_exc()         
            dict={
                    "items":data_all,
                    "data": data, 
                    "uid": user_logined.user_id, 
                    "staff": False
            }
            json=simplejson.dumps(dict)
            return HttpResponse(json)

        if classid == "1":#显示自己的微博
            try:
                msg_index = t_uer_msg_index.objects.filter(user_id=user.user_id,author_id=user.user_id)
                print msg_index
                for msg_index_item in msg_index:

                    present_user=t_user_info.objects.get(user_id=msg_index_item.author_id)
                    present_msg=t_msg_info.objects.get(msg_id=msg_index_item.msg_id)
                    #print present_msg.context
                    if present_msg.type_bool ==1:
                        try:
                            transmit_relation=t_msg_msg_relation.objects.get(reference_id=msg_index_item.author_id,reference_msg_id=msg_index_item.msg_id)
                            transmit_num=transmit_relation.referenced_msg_id
                        except:
                            print  traceback.format_exc()   
                            print "转发信息无法读取，fetchshares函数出错！"  
                    if present_user.user_sex=="女":
                        sex=0
                    else:
                        sex=1
                    zan_id=t_msg_zan.objects.filter(msg_id=present_msg.msg_id,user_id=user.user_id)
                    if zan_id:
                        isding=True
                    else:
                        isding=False
                    item={
                    "username": present_user.user_login,
                    "commentcount": present_msg.comment_count,
                    "pvcount": 0, 
                    "uid": present_user.user_id,
                    "pubdate": str(present_msg.time_t),
                    "class_id": 1, 
                    "isding": isding, 
                    "sex": sex, 
                    "content": present_msg.content+"||||||", 
                    "class_name": "宋健417",
                    "dingcount": present_msg.zan_count,
                    "gravatar": "c295655244.jpg",
                    "transmit": transmit_num, 
                    "sharecount": present_msg.transfer_count, 
                    "nickname": present_user.user_name,
                    "id": present_msg.msg_id,
                     "iscream": False
                    }
                    data_all.append(item)
                    transmit_num=0
            except:
                data='N'
                print traceback.format_exc()         
            dict={
                    "items":data_all,
                    "data": data, 
                    "uid": user_logined.user_id, 
                    "staff": False
            }
            json=simplejson.dumps(dict)
            return HttpResponse(json)




        elif classid=="2":#显示全部的微博
            try:
                msg_index = t_msg_info.objects.all()
                for msg_index_item in msg_index:
                    present_user=t_user_info.objects.get(user_id=msg_index_item.user_id)
                    present_msg=msg_index_item
                    if present_msg.type_bool ==1:
                        try:
                            transmit_relation=t_msg_msg_relation.objects.get(reference_id=msg_index_item.user_id,reference_msg_id=msg_index_item.msg_id)
                            transmit_num=transmit_relation.referenced_msg_id
                        except:
                            print  traceback.format_exc()   
                            print "转发信息无法读取，fetchshares函数出错！"                   
                    if present_user.user_sex=="女":
                        sex=0
                    else:
                        sex=1
                    zan_id=t_msg_zan.objects.filter(msg_id=present_msg.msg_id,user_id=user.user_id)
                    if zan_id:
                        isding=True
                    else:
                        isding=False
                    item={
                    "username": present_user.user_login,
                    "commentcount": present_msg.comment_count,
                    "pvcount": 0, 
                    "uid": present_user.user_id,
                    "pubdate": str(present_msg.time_t),
                    "class_id": 1, 
                    "isding": isding, 
                    "sex": sex, 
                    "content": present_msg.content+"||||||", 
                    "class_name": "宋健417",
                    "dingcount": present_msg.zan_count,
                    "gravatar": "c295655244.jpg",
                    "transmit": transmit_num, 
                    "sharecount": present_msg.transfer_count, 
                    "nickname": present_user.user_name,
                    "id": present_msg.msg_id,
                     "iscream": False
                    }
                    data_all.append(item)
                    transmit_num=0
            except:
                data='N'
                print traceback.format_exc()         
            dict={
                    "items":data_all,
                    "data": data, 
                    "uid": user_logined.user_id, 
                    "staff": False
            }
            json=simplejson.dumps(dict)
            return HttpResponse(json)


#点赞
def dingshare(request):


    '''
    操作流程:
    1.获取全部已点赞的信息
    2.若为jia，则将当前用户信息写入t_msg_zan表
    3.更新t_msg_info中的点赞数
    '''


    if request.method == 'POST':
        data={}
        user_data=[]
        i=0
        try:
            user=t_user_info.objects.get(user_login=request.user.username)
            msg_id = request.POST['id']
            method = request.POST['method']
            msg=t_msg_info.objects.get(msg_id=msg_id)
            #if method=="get":#获取用户点赞消息
            zan_id=t_msg_zan.objects.filter(msg_id=msg_id)
            for zan_item in zan_id:
                user_zan=t_user_info.objects.get(user_id=zan_item.user_id)
                item={
                 "username": user_zan.user_login, 
                 "gravatar": "c295655244.jpg", 
                 "nickname": user_zan.user_name, 
                 "sex": 1
                 }
                user_data.append(item)
                i=i+1



            if method == "jia":
                t_msg_zan.objects.create(
                    user_id=user.user_id,
                    msg_id=msg_id,
                    time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()),            
                    )
                item={
                 "username": user.user_login, 
                 "gravatar": "c295655244.jpg", 
                 "nickname": user.user_name, 
                 "sex": 1
                 }
                user_data.append(item)
                i=i+1



            elif method == "cancel":
                item={
                 "username": user.user_login, 
                 "gravatar": "c295655244.jpg", 
                 "nickname": user.user_name, 
                 "sex": 1
                 }
                user_data.remove(item)
                zan_delete=t_msg_zan.objects.filter(user_id=user.user_id,msg_id=msg_id)
                zan_delete.delete()
                i=i-1


            msg.zan_count=i
            msg.save()

            data={"count": i,
             "items":user_data,
             "data": "Y"
             }
        except:
            print traceback.format_exc()
            print "点赞处出错！"
        json=simplejson.dumps(data)
        return HttpResponse(json)







#获取用户名片
def usercardinfo(request):
    if request.method == 'POST':
        login_id=t_user_info.objects.get(user_login=request.user.username)
        persent_user_id = int(request.POST['uid'])    
        user=t_user_info.objects.get(user_id=persent_user_id)
        try:
            t_user_relation.objects.get(user_id=login_id.user_id,follow_id=persent_user_id)
            relation=1
        except:
            relation=0

        data={
            "username": user.user_login,
            "uid": persent_user_id, 
            "area": "哈尔滨工业大学(威海)", 
            "data": "Y", 
            "userjf": 60,
            "share": user.msg_count,
            "xinqing": "这家伙头像什么的都没有，好吧，主要是程序猿有点懒，还没加 =.=",
            "sex": 1,
            "photos": 0,
            "fans": user.fans_count, 
            "gravatar": "",
            "follow": user.follow_count,
            "nickname": user.user_name, 
            "login_uid": login_id.user_id,
            "relation": relation
        }
        json=simplejson.dumps(data)
        return HttpResponse(json)




def register(request):#显示主页
    if request.method == 'POST':
        form = RegistrationForm(request.POST)

        if form.is_valid():

            user = t_user_info.objects.create(
                                            user_login=form.cleaned_data['userlogin'],
                                            user_name = form.cleaned_data['username'],
                                            msg_count =0,
                                            fans_count =0,
                                            follow_count =0,
                                            user_mail =form.cleaned_data['email'],
                                            password =form.cleaned_data['password1'],
                                            user_sex=form.cleaned_data['sex']
                                             )
            user2 = User.objects.create_user( username=form.cleaned_data['userlogin'],
                         email=form.cleaned_data['email'],
                         password=form.cleaned_data['password1'])
            return HttpResponseRedirect('/login/')
    else:
        form = RegistrationForm()

    return render_to_response('registration/register.html',{"form":form},context_instance=RequestContext(request) )


#登录函数
def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                # response.set_cookie("username",username)
                login(request, user)
                return HttpResponseRedirect('/home/')
        else:
            return render_to_response('registration/login.html',{'has_errors':True},context_instance=RequestContext(request) )
    else:
        return render_to_response('registration/login.html',context_instance=RequestContext(request) )


def letterprocess(request):#添加私信
    if request.method == 'POST':
        dict={}
        dict={'data':'N'}   
        user=t_user_info.objects.get(user_login=request.user.username)    
        action = request.POST['action']
        content = request.POST['content']
        nickname = request.POST['nickname']
        if action=="add":
            try:
                present_user=t_user_info.objects.get(user_name=nickname)
                letter=t_letter.objects.create(
                    user_id=present_user.user_id,
                    letter_user_id=user.user_id,
                    context=content,
                    time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()),
                    read=0
                    )
                dict={'data':'Y'}
            except:
                print traceback.format_exc()

        json=simplejson.dumps(dict)
        return HttpResponse(json)

def messageprocess(request):#添加留言
    if request.method == 'POST':
        dict={}
        dict={'data':'N','error':''}   
        record={}
        user=t_user_info.objects.get(user_login=request.user.username)    
        action = request.POST['action']
        content = request.POST['content']
        uid = int(request.POST['uid'])
        if action=="add":
            try:
                present_user=t_user_info.objects.get(user_id=uid)
                message=t_message.objects.create(
                    user_id=present_user.user_id,
                    msg_user_id=user.user_id,
                    time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()),                    
                    context=content
                    )
                dict={'data':'Y'}
                record={
                    'uid':user.user_id,
                    'username':user.user_login,
                    'gravatar':'',
                    'sex':1,
                    'date':str(message.time_t),
                    'id':message.msg_id,
                    'nickname':user.user_name,
                    'content':content
                    }
                dict={'record':record,'data':'Y','error':''}                    
            except:
                print traceback.format_exc()
        json=simplejson.dumps(dict)
        return HttpResponse(json)


def  fetchshares_comment(request):#获取评论分页的内容
    if request.method == 'POST':
        classid = request.POST['classid']
        user=t_user_info.objects.get(user_login=request.user.username)
        dict = {}
        data_all=[]
        item={}
        data="Y"
        transmit_num=0
        if classid == "":#显示评论我的
            try:
                msg=t_msg_info.objects.filter(user_id=user.user_id)
                for msg_item in msg:
                    if msg_item.comment_count>0:
                        present_user=user
                        present_msg=msg_item
                        if present_msg.type_bool ==1:
                            try:
                                transmit_relation=t_msg_msg_relation.objects.get(reference_id=msg_index_item.author_id,reference_msg_id=msg_index_item.msg_id)
                                transmit_num=transmit_relation.referenced_msg_id
                            except:
                                print  traceback.format_exc()   
                                print "转发信息无法读取，fetchshares函数出错！"  
                        if present_user.user_sex=="女":
                            sex=0
                        else:
                            sex=1
                        zan_id=t_msg_zan.objects.filter(msg_id=present_msg.msg_id,user_id=user.user_id)
                        if zan_id:
                            isding=True
                        else:
                            isding=False
                        item={
                        "username": present_user.user_login,
                        "commentcount": present_msg.comment_count,
                        "pvcount": 0, 
                        "uid": present_user.user_id,
                        "pubdate": str(present_msg.time_t),
                        "class_id": 1, 
                        "isding": isding, 
                        "sex": sex, 
                        "content": present_msg.content+"||||||", 
                        "class_name": "宋健417",
                        "dingcount": present_msg.zan_count,
                        "gravatar": "c295655244.jpg",
                        "transmit": transmit_num, 
                        "sharecount": present_msg.transfer_count, 
                        "nickname": present_user.user_name,
                        "id": present_msg.msg_id,
                         "iscream": False
                        }
                        data_all.append(item)
                        transmit_num=0
            except:
                data='N'
                print traceback.format_exc()         
            dict={
                    "items":data_all,
                    "data": data, 
                    "uid": user.user_id, 
                    "staff": False
            }
            json=simplejson.dumps(dict)
            return HttpResponse(json)

        if classid == "1":#显示我评论的
            try:
                msg_comment=t_comment_info.objects.filter(user_id=user.user_id)
                for item in msg_comment:
                    msg_item=t_msg_info.objects.get(msg_id=item.msg_id)
                    present_user=t_user_info.objects.get(user_id=msg_item.user_id)
                    present_msg=msg_item
                    if present_msg.type_bool ==1:
                        try:
                            transmit_relation=t_msg_msg_relation.objects.get(reference_id=msg_index_item.author_id,reference_msg_id=msg_index_item.msg_id)
                            transmit_num=transmit_relation.referenced_msg_id
                        except:
                            print  traceback.format_exc()   
                            print "转发信息无法读取，fetchshares函数出错！"  
                    if present_user.user_sex=="女":
                        sex=0
                    else:
                        sex=1
                    zan_id=t_msg_zan.objects.filter(msg_id=present_msg.msg_id,user_id=user.user_id)
                    if zan_id:
                        isding=True
                    else:
                        isding=False
                    item={
                    "username": present_user.user_login,
                    "commentcount": present_msg.comment_count,
                    "pvcount": 0, 
                    "uid": present_user.user_id,
                    "pubdate": str(present_msg.time_t),
                    "class_id": 1, 
                    "isding": isding, 
                    "sex": sex, 
                    "content": present_msg.content+"||||||", 
                    "class_name": "宋健417",
                    "dingcount": present_msg.zan_count,
                    "gravatar": "c295655244.jpg",
                    "transmit": transmit_num, 
                    "sharecount": present_msg.transfer_count, 
                    "nickname": present_user.user_name,
                    "id": present_msg.msg_id,
                     "iscream": False
                    }
                    data_all.append(item)
                    transmit_num=0
            except:
                data='N'
                print traceback.format_exc()         
            dict={
                    "items":data_all,
                    "data": data, 
                    "uid": user.user_id, 
                    "staff": False
            }
            json=simplejson.dumps(dict)
            return HttpResponse(json)




def  fetchshares_zan(request):#获取赞分页的内容
    if request.method == 'POST':
        classid = request.POST['classid']
        user=t_user_info.objects.get(user_login=request.user.username)
        dict = {}
        data_all=[]
        item={}
        data="Y"
        transmit_num=0
        if classid == "":#显示赞我的
            try:
                msg=t_msg_info.objects.filter(user_id=user.user_id)
                for msg_item in msg:
                    if msg_item.zan_count>0:
                        present_user=user
                        present_msg=msg_item
                        if present_msg.type_bool ==1:
                            try:
                                transmit_relation=t_msg_msg_relation.objects.get(reference_id=user.user_id,reference_msg_id=msg_item.msg_id)
                                transmit_num=transmit_relation.referenced_msg_id
                            except:
                                print  traceback.format_exc()   
                                print "转发信息无法读取，fetchshares函数出错！"  
                        if present_user.user_sex=="女":
                            sex=0
                        else:
                            sex=1
                        zan_id=t_msg_zan.objects.filter(msg_id=present_msg.msg_id,user_id=user.user_id)
                        if zan_id:
                            isding=True
                        else:
                            isding=False
                        item={
                        "username": present_user.user_login,
                        "commentcount": present_msg.comment_count,
                        "pvcount": 0, 
                        "uid": present_user.user_id,
                        "pubdate": str(present_msg.time_t),
                        "class_id": 1, 
                        "isding": isding, 
                        "sex": sex, 
                        "content": present_msg.content+"||||||", 
                        "class_name": "宋健417",
                        "dingcount": present_msg.zan_count,
                        "gravatar": "c295655244.jpg",
                        "transmit": transmit_num, 
                        "sharecount": present_msg.transfer_count, 
                        "nickname": present_user.user_name,
                        "id": present_msg.msg_id,
                         "iscream": False
                        }
                        data_all.append(item)
                        transmit_num=0
            except:
                data='N'
                print traceback.format_exc()         
            dict={
                    "items":data_all,
                    "data": data, 
                    "uid": user.user_id, 
                    "staff": False
            }
            json=simplejson.dumps(dict)
            return HttpResponse(json)
            
        if classid == "1":#显示我赞的
            try:
                msg_zan=t_msg_zan.objects.filter(user_id=user.user_id)
                for item in msg_zan:
                    present_user=t_user_info.objects.get(user_id=item.user_id)
                    present_msg=t_msg_info.objects.get(msg_id=item.msg_id)
                    if present_msg.type_bool ==1:
                        try:
                            transmit_relation=t_msg_msg_relation.objects.get(reference_id=present_user.user_id,reference_msg_id=present_msg.msg_id)
                            transmit_num=transmit_relation.referenced_msg_id
                        except:
                            print  traceback.format_exc()   
                            print "转发信息无法读取，fetchshares函数出错！"  
                    if present_user.user_sex=="女":
                        sex=0
                    else:
                        sex=1
                    zan_id=t_msg_zan.objects.filter(msg_id=present_msg.msg_id,user_id=user.user_id)
                    if zan_id:
                        isding=True
                    else:
                        isding=False
                    item={
                    "username": present_user.user_login,
                    "commentcount": present_msg.comment_count,
                    "pvcount": 0, 
                    "uid": present_user.user_id,
                    "pubdate": str(present_msg.time_t),
                    "class_id": 1, 
                    "isding": isding, 
                    "sex": sex, 
                    "content": present_msg.content+"||||||", 
                    "class_name": "宋健417",
                    "dingcount": present_msg.zan_count,
                    "gravatar": "c295655244.jpg",
                    "transmit": transmit_num, 
                    "sharecount": present_msg.transfer_count, 
                    "nickname": present_user.user_name,
                    "id": present_msg.msg_id,
                     "iscream": False
                    }
                    data_all.append(item)
                    transmit_num=0
            except:
                data='N'
                print traceback.format_exc()         
            dict={
                    "items":data_all,
                    "data": data, 
                    "uid": user.user_id, 
                    "staff": False
            }
            json=simplejson.dumps(dict)
            return HttpResponse(json)










def  fetchshares_letter(request):#获取私信分页的内容
    if request.method == 'POST':
        classid = request.POST['classid']
        user=t_user_info.objects.get(user_login=request.user.username)
        dict = {}
        data_all=[]
        item={}
        data="Y"
        transmit_num=0
        sex=0
        isding=False
        try:
            letter=t_letter.objects.filter(user_id=user.user_id).order_by('-time_t')
            for letter_item in letter:
                present_user=t_user_info.objects.get(user_id=letter_item.letter_user_id)
                item={
                "username": present_user.user_login,
                "commentcount": 0,
                "pvcount": 0, 
                "uid": present_user.user_id,
                "pubdate": str(letter_item.time_t),
                "class_id": 1, 
                "isding": isding, 
                "sex": sex, 
                "content": letter_item.context+"||||||", 
                "class_name": "宋健417",
                "dingcount": 0,
                "gravatar": "c295655244.jpg",
                "transmit": 0, 
                "sharecount": letter_item.read, 
                "nickname": present_user.user_name,
                "id": letter_item.letter_id,
                 "iscream": False
                }
                letter_item.read=1;
                letter_item.save();
                data_all.append(item)
                transmit_num=0
        except:
            data='N'
            print traceback.format_exc()         
        dict={
                "items":data_all,
                "data": data, 
                "uid": user.user_id, 
                "staff": False
            }
        json=simplejson.dumps(dict)
        return HttpResponse(json)



def  fetchshares_message(request):#获取留言分页的内容
    if request.method == 'POST':
        page = int(request.POST['page'])
        user_id = int(request.POST['uid'])
        user=t_user_info.objects.get(user_login=request.user.username)
        dict = {}
        data_all=[]
        item={}
        data="Y"
        transmit_num=0
        sex=0
        isding=False
        try:
            message=t_message.objects.filter(user_id=user_id).order_by('-time_t')
            for message_item in message:
                present_user=t_user_info.objects.get(user_id=message_item.msg_user_id)
                item={
                "username": present_user.user_login,
                "commentcount": 0,
                "pvcount": 0, 
                "uid": present_user.user_id,
                "pubdate": str(message_item.time_t),
                "class_id": 1, 
                "isding": isding, 
                "sex": sex, 
                "content": message_item.context+"||||||", 
                "class_name": "宋健417",
                "dingcount": page,
                "gravatar": "c295655244.jpg",
                "transmit": 0, 
                "sharecount": 1, 
                "nickname": present_user.user_name,
                "id":message_item.msg_id,
                 "iscream": False
                }
                data_all.append(item)
                transmit_num=0
        except:
            data='N'
            print traceback.format_exc()         
        dict={
                "items":data_all,
                "data": data, 
                "uid": user_id, 
                "staff": False
            }
        json=simplejson.dumps(dict)
        return HttpResponse(json)


def  save_letter_reply(request):#存储回复
    if request.method == 'POST': 
        items=[]
        item={}
        data={}
        user=t_user_info.objects.get(user_login=request.user.username)
        msg_id =int(request.POST['shareid']) 
        letter_present=t_letter.objects.get(letter_id=msg_id)
        content=request.POST['text']
        try:
            letter=t_letter.objects.create(
                user_id=letter_present.letter_user_id,
                letter_user_id=user.user_id,
                context=content,
                time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()),
                read=0
                )
            item={
                "username": request.user.username, 
                "content": content, 
                "gravatar": "", 
                "uid": user.user_id, 
                "pubdate": str(letter.time_t), 
                "comment_id": letter.letter_id, 
                "nickname": user.user_name,
                 "sex": 1
             }
            items.append(item)
            data={"items": items, "data": "Y", "uid": user.user_id, "staff": False}
            json=simplejson.dumps(data)
            return HttpResponse(json)
        except:
            data={"items": [], "data": "N", "uid": user.user_id, "staff": False}
            print traceback.format_exc()
            json=simplejson.dumps(data)
            return HttpResponse(json)         



def del_letter(request):#删除私信
    if request.method == 'POST':
        msg_id =int(request.POST['id'])
        user_id =int(request.POST['uid'])
        try:
            msg=t_letter.objects.get(letter_id=msg_id)
            msg.delete()
        except:
            print traceback.format_exc()
            return HttpResponse("N")
    return HttpResponse("Y")


def  save_message_reply(request):#存储留言回复
    if request.method == 'POST': 
        items=[]
        item={}
        data={}
        user=t_user_info.objects.get(user_login=request.user.username)
        msg_id =int(request.POST['shareid']) 
        msg_present=t_message.objects.get(msg_id=msg_id)
        content=request.POST['text']
        try:
            letter=t_letter.objects.create(
                user_id=msg_present.msg_user_id,
                letter_user_id=user.user_id,
                context=content,
                time_t=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()),
                read=0
                )
            item={
                "username": request.user.username, 
                "content": content, 
                "gravatar": "", 
                "uid": user.user_id, 
                "pubdate": str(letter.time_t), 
                "comment_id": letter.letter_id, 
                "nickname": user.user_name,
                 "sex": 1
             }
            items.append(item)
            data={"items": items, "data": "Y", "uid": user.user_id, "staff": False}
            json=simplejson.dumps(data)
            return HttpResponse(json)
        except:
            data={"items": [], "data": "N", "uid": user.user_id, "staff": False}
            print traceback.format_exc()
            json=simplejson.dumps(data)
            return HttpResponse(json)  


def del_message(request):#删除留言
    if request.method == 'POST':
        msg_id =int(request.POST['id'])
        user_id =int(request.POST['uid'])
        try:
            msg=t_message.objects.get(msg_id=msg_id)
            msg.delete()
        except:
            print traceback.format_exc()
            return HttpResponse("N")
    return HttpResponse("Y")
