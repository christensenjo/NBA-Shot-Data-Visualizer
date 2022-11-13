# Generated by Django 4.1.3 on 2022-11-13 19:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('players', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('home_team_slug', models.CharField(max_length=20)),
                ('away_team_slug', models.CharField(max_length=20)),
                ('year', models.IntegerField()),
                ('season', models.CharField(max_length=100)),
                ('id_csv', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='ShotAction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ShotEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ShotType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ZoneType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('slug', models.CharField(max_length=6)),
            ],
        ),
        migrations.CreateModel(
            name='Zone',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=100)),
                ('range', models.CharField(max_length=100)),
                ('zone_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='zones', to='shots.zonetype')),
            ],
        ),
        migrations.CreateModel(
            name='Shot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_grid', models.CharField(max_length=100)),
                ('period', models.IntegerField()),
                ('minutes_remaining', models.IntegerField()),
                ('location_x', models.IntegerField()),
                ('location_y', models.IntegerField()),
                ('seconds_remaining', models.IntegerField()),
                ('distance', models.IntegerField()),
                ('is_attempted', models.BooleanField(blank=True, null=True)),
                ('is_made', models.BooleanField(blank=True, null=True)),
                ('action', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shots', to='shots.shotaction')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shots', to='shots.shotevent')),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shots', to='shots.game')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shots', to='players.player')),
                ('shot_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shots', to='shots.shottype')),
                ('zone', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shots', to='shots.zone')),
            ],
        ),
    ]