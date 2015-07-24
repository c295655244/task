# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_auto_20150717_0921'),
    ]

    operations = [
        migrations.CreateModel(
            name='t_letter',
            fields=[
                ('user_id', models.BigIntegerField()),
                ('letter_id', models.AutoField(serialize=False, primary_key=True)),
                ('context', models.TextField()),
                ('time_t', models.DateTimeField()),
                ('read', models.BigIntegerField()),
            ],
            options={
                'ordering': ['time_t'],
            },
        ),
        migrations.CreateModel(
            name='t_message',
            fields=[
                ('user_id', models.BigIntegerField()),
                ('msg_id', models.AutoField(serialize=False, primary_key=True)),
                ('context', models.TextField()),
                ('time_t', models.DateTimeField()),
            ],
            options={
                'ordering': ['time_t'],
            },
        ),
    ]
