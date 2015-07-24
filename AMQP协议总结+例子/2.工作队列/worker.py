#!/usr/bin/env python
#coding=utf8
import pika
import pika
import time
 
connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))
channel = connection.channel()
 
channel.queue_declare(queue='task_queue', durable=True)
print ' [*] Waiting for messages. To exit press CTRL+C'
 
def callback(ch, method, properties, body):
    print " [x] Received %r" % (body,)
    time.sleep( body.count('.') )
    print " [x] Done"
    ch.basic_ack(delivery_tag = method.delivery_tag)
 #消息确认就是当工作者完成任务后，会反馈给rabbitmq

channel.basic_qos(prefetch_count=1)
#如果能公平调度就最好了，使用basic_qos设置prefetch_count=1，使得rabbitmq不会在同一时间给工作者分配多个任务，即只有工作者完成任务之后，才会再次接收到任务。

channel.basic_consume(callback,
                      queue='task_queue')
 
channel.start_consuming()