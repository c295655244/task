 #coding=utf-8
from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin


class t_user_info(models.Model):#用户信息表
	user_id = models.AutoField(primary_key = True)#用户编号（主键）
	user_login=models.CharField(max_length=60,unique=True)#login
	user_name = models.CharField(max_length=60)#名称
	msg_count =models.BigIntegerField()#发布消息数量,可以作为t_msg_info水平切分新表的auto_increment
	fans_count =models.BigIntegerField()#粉丝数量
	follow_count =models.BigIntegerField()#关注对象数
	user_mail = models.EmailField(blank=True,null=True,max_length = 254)
	password =models.CharField(max_length=60)
	user_sex=models.CharField(max_length=60)
	user_photo=models.ImageField(blank=True,null=True,upload_to="photo",default="anonymous.jpg")#default="static/image/anonymous.jpg"
	def __unicode__(self):
	        return self.user_name


class t_msg_info(models.Model):#消息元数据表
	user_id=models.BigIntegerField()#发消息用户编号（联合主键）
	msg_id= models.AutoField(primary_key = True)#消息编号（联合主键）
	content=models.TextField()#消息内容
	type_bool=models.BigIntegerField()#消息类型（0，原创；1，评论；2，转发）
	zan_count=models.BigIntegerField()#点赞数
	commented_count= models.BigIntegerField()#评论过数量（只增不减，删除评论不影响此值，可以作为评论多页显示的页码）
	comment_count= models.BigIntegerField()#保留的评论数量
	transferred_count= models.BigIntegerField()#转发过数量（只增不减，删除转发不影响此值，可以作为转发多页显示的页码）
	transfer_count= models.BigIntegerField()#保留的转发数量
	time_t=models.DateTimeField()#发布时间

	class Meta:
        		ordering = ['-time_t']
	def __unicode__(self):
	        return unicode(self.msg_id)

class t_user_relation(models.Model):#用户之间关系表
	user_id = models.BigIntegerField()#用户编号（联合主键）
	follow_id = models.BigIntegerField()#被关注者编号（联合主键）
	#type_bool = models.BigIntegerField()#关系类型（0，粉丝；1，关注）1为a关注b，0为b关注a
	def __unicode__(self):
	        return u'%s %s' % (str(self.user_id), str(self.follow_id))



class t_uer_msg_index(models.Model):#用户消息索引表
	user_id = models.BigIntegerField()#用户编号（联合主键）
	author_id= models.BigIntegerField()#消息发布者编号（可能是被关注者，也可能是自己）（联合主键）
	msg_id= models.BigIntegerField()#消息编号(由消息发布者的msg_count自增)（联合主键）
	time_t =models.DateTimeField()#发布时间（必须是消息元数据产生时间）

	class Meta:
        		ordering = ['-time_t']
	def __unicode__(self):
	        return u'%s %s' % (str(self.user_id), str(self.author_id))



class t_msg_msg_relation(models.Model):#消息与消息关系表
	reference_id= models.BigIntegerField()#引用消息用户编号（联合主键）
	reference_msg_id= models.BigIntegerField()#引用消息编号（联合主键）
	referenced_id= models.BigIntegerField()#消息发布者编号
	referenced_msg_id= models.BigIntegerField()#被引用消息编号
	time_t=models.DateTimeField()#发布时间
	def __unicode__(self):
	        return u'%s %s' % (str(self.reference_id), str(self.reference_msg_id))


class t_msg_zan(models.Model):#点赞信息表
	user_id=models.BigIntegerField()#点赞用户
	msg_id=models.BigIntegerField()#被点赞消息
	time_t=models.DateTimeField()#时间
	def __unicode__(self):
	        return u'%s %s' % (str(self.user_id), str(self.msg_id))	


class t_comment_info(models.Model):#评论元数据表
	user_id=models.BigIntegerField()#发消息用户编号（联合主键）
	comment_id= models.AutoField(primary_key = True)#消息编号（联合主键）
	content=models.TextField()#评论内容
	msg_id=models.BigIntegerField()#被评论的信息号
	time_t=models.DateTimeField()#发布时间

	class Meta:
        		ordering = ['time_t']
	def __unicode__(self):
	        return unicode(self.msg_id)


class t_message(models.Model):#留言数据表
	user_id=models.BigIntegerField()#被留言用户id
	msg_id= models.AutoField(primary_key = True)#留言编号
	msg_user_id=models.BigIntegerField()#发表留言人id
	context=models.TextField()#留言内容
	time_t=models.DateTimeField()#发布时间

	class Meta:
        		ordering = ['time_t']
	def __unicode__(self):
	        return unicode(self.msg_id)


class t_letter(models.Model):#私信数据表
	user_id=models.BigIntegerField()#被私信用户id
	letter_id= models.AutoField(primary_key = True)#留言编号
	letter_user_id=models.BigIntegerField()#发表留言人id
	context=models.TextField()#留言内容
	time_t=models.DateTimeField()#发布时间
	read=models.BigIntegerField()#标记是否已读

	class Meta:
        		ordering = ['time_t']
	def __unicode__(self):
	        return unicode(self.letter_id)