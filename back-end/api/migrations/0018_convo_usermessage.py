# Generated by Django 4.2.11 on 2024-11-16 23:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_user_bio_user_follower_count_user_following_count_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Convo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user1_convo_set', to='api.user')),
                ('user2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user2_convo_set', to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='UserMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=100)),
                ('date', models.DateTimeField()),
                ('user1_sent', models.BooleanField()),
                ('convo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.convo')),
            ],
        ),
    ]
