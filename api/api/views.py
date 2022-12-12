from django.shortcuts import render
import json, os
from django.http import HttpResponse

# Create your views here.

def index(request):
    return render(request, 'index.html',{})