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

def getPlayerData(request, player):
    player = Player.objects.filter(name=player)
    if player:
        player = player[0]
        playerData = [player.ppg, player.rpg, player.apg, player.topg, player.salary]
    else:
        playerData = [0, 0, 0, 0, 0]
    
    leagueData = []
    players = Player.objects.all()
    for p in players:
        leagueData.append([p.ppg, p.rpg, p.apg, p.topg, p.salary])

    return HttpResponse(json.dumps({'playerData': playerData, 'leagueData': leagueData}))
        

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


def seedData(request):
    files = os.listdir('../data')
    data = {'created': []}
    for file in files:
        if file.endswith('salaries.csv'):
            df = pd.read_csv('../data/' + file)
            for index, row in df.iterrows():
                player = Player.objects.filter(name=row['Player'])
                if player:
                    for p in player:
                        p.salary = float(row['2022-23'])
                        p.save()
                        data['created'].append({'name': p.name, 'salary': p.salary})

        if file.endswith('stats.csv'):
            df = pd.read_csv('../data/' + file)
            for index, row in df.iterrows():
                player = Player.objects.filter(name=row['Player'])
                if player:
                    for p in player:
                        p.ppg = row['PTS']
                        p.rpg = row['TRB']
                        p.apg = row['AST']
                        p.topg = row['TOV']
                        p.save()
                        data['created'].append({'name': p.name, 'ppg': p.ppg, 'rpg': p.rpg, 'apg': p.apg, 'topg': p.topg})

    data['createdCount'] = len(data['created'])
    return HttpResponse(json.dumps(data))