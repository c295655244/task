#!/usr/bin/env python
#coding=utf8
import pika
 
connection = pika.BlockingConnection(pika.ConnectionParameters(
               'localhost'))#连接到rabbitmq服务器
channel = connection.channel()
 
channel.queue_declare(queue='hello')
   #声明消息队列，消息将在这个队列中进行传递

x={'a':1, 'b':2, 'c':3}

y=str(x)
channel.basic_publish(exchange='', routing_key='hello', body=y)
#发送消息到上面声明的hello队列，其中exchange表示交换器，能精确指定消息应该发送到哪个队列，
#routing_key设置为队列的名称，body就是发送的内容，具体发送细节暂时先不关注
print y
connection.close()