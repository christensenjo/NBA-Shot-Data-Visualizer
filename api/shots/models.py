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

    class Meta:
        unique_together = (
            'type_grid', 'event', 'action', 'shot_type', 'player', 'zone', 'game', 'period',
            'minutes_remaining', 'location_x', 'location_y', 'seconds_remaining', 'distance',
            'is_attempted', 'is_made'
           )

    @classmethod
    def load_data(cls, year=None):
        batch_size = 1000

        class ShotCache(object):
            def __init__(self):
                self.data = {}

            def get_row(self, model_key, key, callback, callback_params):
                self.data[model_key] = self.data[model_key] if model_key in self.data else {}
                model_entries = self.data[model_key]
                if key in model_entries:
                    return model_entries[key]
                model_entries[key] = callback(**callback_params)[0].id
                return model_entries[key]

        s_cache = ShotCache()

        def create_shot_from_df(df):
            ctr = 0
            shots = []
            for index, row in df.iterrows():

                if ctr % batch_size == 0:
                    Shot.objects.bulk_create(shots, ignore_conflicts=True)
                    shots = []
                    print(ctr)
                ctr += 1

                # zone = optim.get_row('zone', row['typeShot'], Zone.objects.get_or_create, {'description':row['zoneBasic'], 'range':row['zoneRange'], 'zone_type'zone_type_id})
                # zone = Zone.objects.get_or_create(description=row['zoneBasic'], range=row['zoneRange'], zone_type=zone_type_id)[0]
                # shot_type = ShotType.objects.get_or_create(name=row['typeShot'])[0]
                # shot_action = ShotAction.objects.get_or_create(name=row['typeAction'])[0]
                # shot_event = ShotEvent.objects.get_or_create(name=row['typeEvent'])[0]
                # player_team = Team.objects.get_or_create(name=row['nameTeam'], id_csv=row['idTeam'])[0]
                # player = Player.objects.get_or_create(name=row['namePlayer'], team=player_team, id_csv=row['idPlayer'])[0]

                zone_type_id = s_cache.get_row('zone_type', row['nameZone'], ZoneType.objects.get_or_create, {'name':row['nameZone'], 'slug':row['slugZone']})
                zone_id = s_cache.get_row('zone', row['typeShot'], Zone.objects.get_or_create, {'description':row['zoneBasic'], 'range':row['zoneRange'], 'zone_type_id':zone_type_id})
                shot_type_id = s_cache.get_row('shot_type', row['typeShot'], ShotType.objects.get_or_create, {'name': row['typeShot']})
                shot_action_id = s_cache.get_row('shot_action', row['typeAction'], ShotAction.objects.get_or_create, {'name':row['typeAction']})
                shot_event_id = s_cache.get_row('shot_event', row['typeEvent'], ShotEvent.objects.get_or_create, {'name':row['typeEvent']})
                player_team_id = s_cache.get_row('player_team', row['nameTeam'], Team.objects.get_or_create, {'name':row['nameTeam'], 'id_csv':row['idTeam']})
                player_id = s_cache.get_row('player',row['namePlayer'], Player.objects.get_or_create, {'id_csv':row['idTeam'], 'name':row['namePlayer'], 'team_id': player_team_id})
                game_id = s_cache.get_row('game',row['idGame'], Game.objects.get_or_create,
                                        {
                                        'year':row['yearSeason'],
                                        'season':row['slugSeason'],
                                        'date':datetime.datetime.strptime(str(row['dateGame']), '%Y%m%d').date(),
                                        'home_team_slug':row['slugTeamHome'],
                                        'away_team_slug':row['slugTeamAway'],
                                        'id_csv':row['idGame']
                                        }
                )


                # home_team = Team.objects.get_or_create(name=row['namePlayer'], team=row['nameTeam'])
                # away_team = Team.objects.get_or_create(name=row['namePlayer'], team=row['nameTeam'])

                # game = Game.objects.get_or_create(
                #     year=row['yearSeason'],
                #     season=row['slugSeason'],
                #     date=datetime.datetime.strptime(str(row['dateGame']), '%Y%m%d').date(),
                #     home_team_slug=row['slugTeamHome'],
                #     away_team_slug=row['slugTeamAway'],
                #     id_csv=row['idGame'],
                # )[0]
                shot = Shot(
                    zone_id=zone_id,
                    shot_type_id=shot_type_id,
                    action_id=shot_action_id,
                    event_id=shot_event_id,
                    player_id=player_id,
                    game_id=game_id,
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
                shots.append(shot)
            Shot.objects.bulk_create(shots, ignore_conflicts=True) #create the remainder

        data_path = "../data"
        files = os.listdir(data_path)
        for file in files:
            if file.endswith('.csv'):
                if year:
                    if not str(year) in file:
                        continue
                create_shot_from_df(pd.read_csv(f'{data_path}/{file}'))





