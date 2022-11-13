import datetime
import os

from django.db import models

# Create your models here.
from players.models import Player, Team
import pandas as pd


class ShotEvent(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.name}'


class ShotAction(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.name}'


class ShotType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.name}'


class Zone(models.Model):
    description = models.CharField(max_length=100)
    range = models.CharField(max_length=100)
    zone_type = models.ForeignKey('ZoneType', related_name="zones", on_delete=models.PROTECT)

    def __str__(self):
        return f'{self.description} {self.zone_type}'


class ZoneType(models.Model):
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=6) #unique=True

    def __str__(self):
        return f'{self.name}'

class Game(models.Model):
    date = models.DateField()
    # home_team = models.ForeignKey(Team, related_name="home_games", on_delete=models.PROTECT)
    # away_team = models.ForeignKey(Team, related_name="away_games", on_delete=models.PROTECT)
    home_team_slug = models.CharField(max_length=20)
    away_team_slug = models.CharField(max_length=20)
    year = models.IntegerField()
    season = models.CharField(max_length=100)
    id_csv = models.IntegerField()

    def __str__(self):
        return f'{self.date} {self.home_team_slug} vs {self.away_team_slug}'


class Shot(models.Model):
    type_grid = models.CharField(max_length=100)
    event = models.ForeignKey('ShotEvent', related_name="shots", on_delete=models.PROTECT)
    action = models.ForeignKey('ShotAction', related_name="shots", on_delete=models.PROTECT)
    shot_type = models.ForeignKey('ShotType', related_name="shots", on_delete=models.PROTECT)
    player = models.ForeignKey(Player, related_name="shots", on_delete=models.PROTECT)
    zone = models.ForeignKey('Zone', related_name="shots", on_delete=models.PROTECT)
    game = models.ForeignKey('Game', related_name="shots", on_delete=models.PROTECT)
    period = models.IntegerField()
    minutes_remaining = models.IntegerField()
    location_x = models.IntegerField()
    location_y = models.IntegerField()
    seconds_remaining = models.IntegerField()
    distance = models.IntegerField()
    is_attempted = models.BooleanField(null=True, blank=True)
    is_made = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f'{self.player} @ {self.game}'

    @classmethod
    def load_data(cls):

        def create_shot_from_df(df):
            for index, row in df.iterrows():
                zone_type = ZoneType.objects.get_or_create(name=row['nameZone'], slug=row['slugZone'])[0]
                zone = Zone.objects.get_or_create(description=row['zoneBasic'], range=row['zoneRange'], zone_type=zone_type)[0]
                shot_type = ShotType.objects.get_or_create(name=row['typeShot'])[0]
                shot_action = ShotAction.objects.get_or_create(name=row['typeAction'])[0]
                shot_event = ShotEvent.objects.get_or_create(name=row['typeEvent'])[0]

                player_team = Team.objects.get_or_create(name=row['nameTeam'], id_csv=row['idTeam'])[0]
                player = Player.objects.get_or_create(name=row['namePlayer'], team=player_team, id_csv=row['idPlayer'])[0]

                # home_team = Team.objects.get_or_create(name=row['namePlayer'], team=row['nameTeam'])
                # away_team = Team.objects.get_or_create(name=row['namePlayer'], team=row['nameTeam'])

                game = Game.objects.get_or_create(
                    year=row['yearSeason'],
                    season=row['slugSeason'],
                    date=datetime.datetime.strptime(str(row['dateGame']), '%Y%m%d').date(),
                    home_team_slug=row['slugTeamHome'],
                    away_team_slug=row['slugTeamAway'],
                    id_csv=row['idGame'],
                )[0]
                shot = Shot.objects.get_or_create(
                    zone=zone,
                    shot_type=shot_type,
                    action=shot_action,
                    event=shot_event,
                    player=player,
                    game=game,
                    type_grid=row['typeGrid'],
                    period=row['numberPeriod'],
                    minutes_remaining=row['minutesRemaining'],
                    location_x=row['locationX'],
                    location_y=row['locationY'],
                    seconds_remaining=row['secondsRemaining'],
                    distance=row['distanceShot'],
                    is_attempted=row['isShotAttempted'],
                    is_made=row['isShotMade'],
                )

        data_path = "../data"
        files = os.listdir(data_path)
        for file in files:
            if file.endswith('.csv'):
                create_shot_from_df(pd.read_csv(f'{data_path}/{file}'))





