#!/usr/bin/env python
#coding=utf8
import pika
 
connection = pika.BlockingConnection(pika.ConnectionParameters(
               'localhost'))
channel = connection.channel()
 
channel.queue_declare(queue='hello')
 
def callback(ch, method, properties, body):
    b= eval(body)
    for a in b:
    	print a
 
channel.basic_consume(callback, queue='hello', no_ack=True)
 
print ' [*] Waiting for messages. To exit press CTRL+C'
channel.start_consuming()