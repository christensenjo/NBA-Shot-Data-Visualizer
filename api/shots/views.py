from django.shortcuts import render
import json
from django.http import HttpResponse

def get(request):
    return HttpResponse(json.dumps({'data': 'Here is your shot data.'}))
