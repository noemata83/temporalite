# Generated by Django 2.0.4 on 2018-04-13 16:30

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='start_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
