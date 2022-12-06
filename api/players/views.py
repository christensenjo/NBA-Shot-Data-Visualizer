from django.shortcuts import render
import json, os
from django.http import HttpResponse
import pandas as pd
from .models import Player, Team

# Create your views here.

def get(request):
    df = pd.read_csv('../data/nba_2022_regSeason_shotData.csv')
    players = df['namePlayer'].drop_duplicates()
    return HttpResponse(json.dumps({'players': players.tolist()}))


def seedPlayers(request):
    files = os.listdir('../data')
    data = {'created': []}
    dfs = []
    for file in files:
        if file.endswith('shotData.csv'):
            df = pd.read_csv('../data/' + file)
            players = df[["namePlayer","nameTeam","idPlayer"]].drop_duplicates()
            dfs.append(players)
    players = pd.concat(dfs)
    players = players.drop_duplicates()
    for index, row in players.iterrows():
        team = Team.objects.get(name=row['nameTeam'])
        if team:
            player = Player.objects.get_or_create(name=row['namePlayer'], team=team, id_csv=row['idPlayer'])
            if player[1]:
                data['created'].append({'name': player[0].name, 'team': player[0].team})

    data['createdCount'] = len(data['created'])
    data['totalPlayers'] = Player.objects.all().count()
    return HttpResponse(json.dumps(data))
