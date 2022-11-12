from django.shortcuts import render
import json
from django.http import HttpResponse
import pandas as pd
from .models import Player

# Create your views here.

def get(request):
    df = pd.read_csv('../data/nba_2022_regSeason_shotData.csv')
    players = df['namePlayer'].unique()
    return HttpResponse(json.dumps({'players': players.tolist()}))


def seed(request):
    df = pd.read_csv('../data/nba_2022_regSeason_shotData.csv')
    players = []
    players = df[["namePlayer","nameTeam"]]
    players = players.drop_duplicates()
    data = {'players': []}
    for index, row in players.iterrows():
        player = Player.objects.get_or_create(name=row['namePlayer'], team=row['nameTeam'])
        data['players'].append({'name': player[0].name, 'team': player[0].team})
    return HttpResponse(json.dumps(data))
