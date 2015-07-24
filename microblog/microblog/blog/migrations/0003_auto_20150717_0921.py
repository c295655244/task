# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_auto_20150713_1307'),
    ]

    operations = [
        migrations.AlterField(
            model_name='t_user_info',
            name='user_photo',
            field=models.ImageField(default=b'anonymous.jpg', null=True, upload_to=b'photo', blank=True),
        ),
    ]
