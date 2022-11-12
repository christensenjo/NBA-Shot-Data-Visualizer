from django.contrib import admin
from django.urls import path
from shots import views

urlpatterns = [
    path('', views.index, name='index'),
    path('get/', views.get, name='get'),
]
