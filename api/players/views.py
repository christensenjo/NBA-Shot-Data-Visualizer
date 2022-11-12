from django.shortcuts import render
import json
from django.http import HttpResponse
import pandas as pd

# Create your views here.

def get(request):
    df = pd.read_csv('../data/nba_2022_regSeason_shotData.csv')
    players = df['namePlayer'].unique()
    return HttpResponse(json.dumps({'players': players.tolist()}))
