from django.contrib import admin
from django.urls import path
from players import views

urlpatterns = [
    path('get/', views.get, name='get'),
    path('seed/', views.seedPlayers, name='seed'),
    path('seedData/', views.seedData, name='seedData'),
    path('getPlayerData/<str:player>', views.getPlayerData, name='getPlayerData'),
]
