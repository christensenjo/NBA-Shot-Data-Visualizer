from django.core import serializers
from django.db.models import F, Max
from django.shortcuts import render
import json
from django.http import HttpResponse, JsonResponse

from shots.models import Shot
from django.db.models import Count

from shots.serializers import ShotSerializer


def index(request):
    return render(request, "index.html", {})


def universal_filter(request):
    start_date = request.GET.get('start_date', None)
    end_date = request.GET.get('end_date', None)
    player_name = request.GET.get('player', None)
    return Shot.objects.filter(game__date__gte=start_date, game__date__lte=end_date, player__name=player_name)


def get(request):
    shots = universal_filter(request)

    json_format = request.GET.get('format', "default")
    schema = ('id', 'period', 'minutes_remaining', 'location_x', 'location_y', 'seconds_remaining', 'distance', 'is_attempted', 'is_made')
    k_schema = {
        "player_name": F("player__name"),
        "team": F("player__team__name"),
        "shot_action": F("action__name"),
        "shot_event": F("event__name"),
        "shot_type_name": F("shot_type__name"),
        "shot_zone": F("zone__description"),
        "zone_type": F("zone__zone_type__name"),
        "game_date": F("game__date"),
    }

    if json_format == "nested":
        data = ShotSerializer(shots, many=True).data
    elif json_format == "schema":
        data = list(shots.values(*schema, **k_schema))
    else:
        data = list(shots.values())
    return JsonResponse(data, safe=False)


def get_frequency(request):
    shots = universal_filter(request)
    minutes_in_period = 15
    # data = shots.annotate(
    #     seconds=(
    #            (F('period') - 1) * minutes_in_period * 60) +
    #            (60 - F('seconds_remaining')) +
    #            ((minutes_in_period - F('minutes_remaining')) * 60)) \
    #     .values('seconds').order_by('seconds') \
    #     .annotate(count=Count('id'))
    data = shots.values('period').order_by('period').annotate(count=Count('id'))
        # .annotate(bucket=(F('total_seconds_left') / bucket_size * bucket_size)) \
    return JsonResponse(list(data), safe=False)


def seed(request):
    year = request.GET.get('year', None) or None
    Shot.load_data(year)
    return HttpResponse(json.dumps({'message': 'Finished.'}))
