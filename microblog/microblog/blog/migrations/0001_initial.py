# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='t_comment_info',
            fields=[
                ('user_id', models.BigIntegerField()),
                ('comment_id', models.AutoField(serialize=False, primary_key=True)),
                ('content', models.TextField()),
                ('msg_id', models.BigIntegerField()),
                ('time_t', models.DateTimeField()),
            ],
            options={
                'ordering': ['-time_t'],
            },
        ),
        migrations.CreateModel(
            name='t_msg_info',
            fields=[
                ('user_id', models.BigIntegerField()),
                ('msg_id', models.AutoField(serialize=False, primary_key=True)),
                ('content', models.TextField()),
                ('type_bool', models.BigIntegerField()),
                ('zan_count', models.BigIntegerField()),
                ('commented_count', models.BigIntegerField()),
                ('comment_count', models.BigIntegerField()),
                ('transferred_count', models.BigIntegerField()),
                ('transfer_count', models.BigIntegerField()),
                ('time_t', models.DateTimeField()),
            ],
            options={
                'ordering': ['-time_t'],
            },
        ),
        migrations.CreateModel(
            name='t_msg_msg_relation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('reference_id', models.BigIntegerField()),
                ('reference_msg_id', models.BigIntegerField()),
                ('referenced_id', models.BigIntegerField()),
                ('referenced_msg_id', models.BigIntegerField()),
                ('time_t', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='t_msg_zan',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_id', models.BigIntegerField()),
                ('msg_id', models.BigIntegerField()),
                ('time_t', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='t_uer_msg_index',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_id', models.BigIntegerField()),
                ('author_id', models.BigIntegerField()),
                ('msg_id', models.BigIntegerField()),
                ('time_t', models.DateTimeField()),
            ],
            options={
                'ordering': ['-time_t'],
            },
        ),
        migrations.CreateModel(
            name='t_user_info',
            fields=[
                ('user_id', models.AutoField(serialize=False, primary_key=True)),
                ('user_login', models.CharField(unique=True, max_length=60)),
                ('user_name', models.CharField(max_length=60)),
                ('msg_count', models.BigIntegerField()),
                ('fans_count', models.BigIntegerField()),
                ('follow_count', models.BigIntegerField()),
                ('user_mail', models.EmailField(max_length=254, null=True, blank=True)),
                ('password', models.CharField(max_length=60)),
                ('user_sex', models.CharField(max_length=60)),
                ('user_photo', models.ImageField(default=b'static/image/anonymous.jpg', null=True, upload_to=b'static/image/', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='t_user_relation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_id', models.BigIntegerField()),
                ('follow_id', models.BigIntegerField()),
            ],
        ),
    ]
