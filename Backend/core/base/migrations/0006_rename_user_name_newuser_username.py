# Generated by Django 5.0.3 on 2024-04-09 23:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_rename_username_newuser_user_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='newuser',
            old_name='user_name',
            new_name='username',
        ),
    ]