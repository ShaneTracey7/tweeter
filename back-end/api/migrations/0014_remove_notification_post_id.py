# Generated by Django 4.2.11 on 2024-10-24 00:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_notification_post_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='post_id',
        ),
    ]
