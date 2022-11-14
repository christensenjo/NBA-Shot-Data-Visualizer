from rest_framework import serializers
from .models import *
from players.serializers import PlayerSerializer


class ShotEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShotEvent
        fields = '__all__'


class ShotActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShotAction
        fields = '__all__'


class ShotTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShotType
        fields = '__all__'


class ZoneTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZoneType
        fields = '__all__'


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ('description', 'range', 'zone_type')
    zone_type = ZoneTypeSerializer()


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class ShotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shot
        fields = '__all__'
    zone = ZoneSerializer()
    shot_type = ShotTypeSerializer()
    action = ShotActionSerializer()
    event = ShotEventSerializer()
    player = PlayerSerializer()
    game = GameSerializer()