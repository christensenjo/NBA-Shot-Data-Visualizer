from django.contrib import admin
from django.urls import path
from shots import views

urlpatterns = [
    path('get/', views.get, name='get'),
]
