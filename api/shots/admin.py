from django.contrib import admin

# Register your models here.

from .models import *


class ShotAdmin(admin.ModelAdmin):
    raw_id_fields = ('game', 'player')


class ShotActionAdmin(admin.ModelAdmin):
    pass


class ShotEventAdmin(admin.ModelAdmin):
    pass


class ShotTypeAdmin(admin.ModelAdmin):
    pass


class ZoneAdmin(admin.ModelAdmin):
    pass


class ZoneTypeAdmin(admin.ModelAdmin):
    pass


admin.site.register(Shot, ShotAdmin)
admin.site.register(ShotAction, ShotActionAdmin)
admin.site.register(ShotEvent, ShotEventAdmin)
admin.site.register(ShotType, ShotTypeAdmin)
admin.site.register(Zone, ZoneAdmin)
admin.site.register(ZoneType, ZoneTypeAdmin)