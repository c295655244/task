# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_t_letter_t_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='t_letter',
            name='letter_user_id',
            field=models.BigIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='t_message',
            name='msg_user_id',
            field=models.BigIntegerField(default=0),
            preserve_default=False,
        ),
    ]
