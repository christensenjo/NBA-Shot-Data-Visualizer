from django.contrib import admin
from django.urls import path, re_path
from shots import views

urlpatterns = [
    path('', views.index, name='index'),
    re_path(r'get/?$', views.get, name='get'),
    re_path(r'get/frequency/?$', views.get_frequency, name='get_frequency'),
    re_path(r'seed/?$', views.seed, name='seed'),
]
