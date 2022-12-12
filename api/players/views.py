from django.shortcuts import render
from django.core import serializers
import json, os
from django.http import HttpResponse
import pandas as pd
from .models import Player, Team

# Create your views here.
from api.settings import DATA_PATH

from shots.models import Shot


def get(request):
    players = Player.objects.all()
    data = serializers.serialize('json', players)
    return HttpResponse(data, content_type='application/json')

def getPlayerData(request, player):
    player = Player.objects.filter(name=player)
    if player:
        player = player[0]
        playerData = [player.ppg, player.rpg, player.apg, player.topg, player.salary]
    else:
        playerData = [0, 0, 0, 0, 0]
    
    leagueData = [[], [], [], [], []]
    players = Player.objects.filter(ppg__isnull=False, rpg__isnull=False, apg__isnull=False, topg__isnull=False, salary__isnull=False)
    for p in players:
        leagueData[0].append(p.ppg)
        leagueData[1].append(p.rpg)
        leagueData[2].append(p.apg)
        leagueData[3].append(p.topg)
        leagueData[4].append(p.salary)

    return HttpResponse(json.dumps({'playerData': playerData, 'leagueData': leagueData}))
        

def seedPlayers(request=None):
    files = os.listdir(DATA_PATH)
    data = {'created': []}
    dfs = []
    for file in files:
        if file.endswith('shotData.csv'):
            df = pd.read_csv(DATA_PATH + file)
            players = df[["namePlayer","nameTeam","idPlayer"]].drop_duplicates()
            dfs.append(players)
    players = pd.concat(dfs)
    players = players.drop_duplicates()
    for index, row in players.iterrows():
        print(row)
        team = Team.objects.filter(name=row['nameTeam'])
        if team:
            team = team[0]
            player = Player.objects.get_or_create(name=row['namePlayer'], team=team, id_csv=row['idPlayer'])
            if player[1]:
                data['created'].append({'name': player[0].name, 'team': player[0].team})

    data['createdCount'] = len(data['created'])
    data['totalPlayers'] = Player.objects.all().count()
    return HttpResponse(json.dumps({"message": "finished"}))


def seedData(request):
    data = Shot.load_league_data()
    return HttpResponse(json.dumps(data))