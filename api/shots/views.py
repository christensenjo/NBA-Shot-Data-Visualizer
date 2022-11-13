from django.shortcuts import render
import json
from django.http import HttpResponse

from shots.models import Shot


def index(request):
    return render(request, "index.html", {})


def get(request):

    return HttpResponse(json.dumps({'data': 'Here is your shot data.'}))


def seed(request):
    year = request.GET.get('year',None) or None
    Shot.load_data(year)
