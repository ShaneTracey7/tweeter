# Generated by Django 4.2.11 on 2024-09-23 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='pic',
            field=models.CharField(default='url', max_length=100),
            preserve_default=False,
        ),
    ]
