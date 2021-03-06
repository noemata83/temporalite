# Generated by Django 2.0.4 on 2018-07-12 14:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0014_invite'),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('color', models.CharField(default='#000000', max_length=7)),
                ('workspace', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='tasks.Workspace')),
            ],
        ),
        migrations.AddField(
            model_name='project',
            name='client',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='tasks.Client'),
        ),
    ]
