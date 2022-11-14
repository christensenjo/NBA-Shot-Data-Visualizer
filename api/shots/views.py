from django.core import serializers
from django.shortcuts import render
import json
from django.http import HttpResponse, JsonResponse

from shots.models import Shot

from shots.serializers import ShotSerializer


def index(request):
    return render(request, "index.html", {})


def get(request):
    # todo, url filter package?
    start_date = request.GET.get('start_date',None)
    end_date = request.GET.get('end_date',None)
    player_name = request.GET.get('player',None)
    shots = Shot.objects.filter(game__date__gte=start_date, game__date__lte=end_date, player__name=player_name)
    #return JsonResponse(serializers.serialize('json', shots), safe=False)
    # return JsonResponse(list(shots.values()), safe=False)
    return JsonResponse(ShotSerializer(shots, many=True).data, safe=False)


def seed(request):
    year = request.GET.get('year',None) or None
    Shot.load_data(year)
    return HttpResponse(json.dumps({'message': 'Finished.'}))
