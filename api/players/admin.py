from django.contrib import admin

# Register your models here.

from .models import *


class PlayerAdmin(admin.ModelAdmin):
    pass


class TeamAdmin(admin.ModelAdmin):
    pass


admin.site.register(Player, PlayerAdmin)
admin.site.register(Team, TeamAdmin)