from django.contrib import admin
from django.urls import path
from players import views

urlpatterns = [
    path('get/', views.get, name='get'),
    path('seed/', views.seedPlayers, name='seed'),
]
