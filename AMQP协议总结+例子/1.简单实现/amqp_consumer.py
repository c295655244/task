# -*- coding=utf-8 -*-
from amqplib import client_0_8 as amqp

conn = amqp.Connection(host="localhost:5672", userid="guest", password="guest", virtual_host="/", insist=False)
chan = conn.channel()

chan.queue_declare(queue="po_box", durable=True, exclusive=False, auto_delete=False)
#它创建了一个名叫“po_box”的队列，它是durable的（重启之后会重新建立），并且最后一个消费者断开的时候不会自动删除（auto_delete=False）
#将auto_delete设置成false是很重要的，否则队列将会在最后一个消费者断开的时候消失， 与durable与否无关
#“exclusive”。如果设置成True，只有创建这个队列的消费者程序才允许连接到该队列。这种队列对于这个消费者程序是私有的
chan.exchange_declare(exchange="sorting_room", type="direct", durable=True, auto_delete=False,)

chan.queue_bind(queue="po_box", exchange="sorting_room", routing_key="jason")
#任何送到交换机“sorting_room”的具有路由键“jason” 的消息都被路由到名为“po_box” 的队列。
def recv_callback(msg):
    print 'Received: ' + msg.body + ' from channel #' + str(msg.channel.channel_id)

chan.basic_consume(queue='po_box', no_ack=True, callback=recv_callback, consumer_tag="testtag")
while True:
    chan.wait()
chan.basic_cancel("testtag")


chan.close()
conn.close()
