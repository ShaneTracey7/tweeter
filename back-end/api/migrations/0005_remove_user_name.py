# Generated by Django 4.2.11 on 2024-09-12 23:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_user_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='name',
        ),
    ]