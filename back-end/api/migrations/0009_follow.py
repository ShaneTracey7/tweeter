# Generated by Django 4.2.11 on 2024-10-01 18:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_user_pic'),
    ]

    operations = [
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follower_follow_set', to='api.user')),
                ('following', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='following_follow_set', to='api.user')),
            ],
        ),
    ]
