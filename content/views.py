from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

def content(request):
    template = loader.get_template('homePage.html')
    return HttpResponse(template.render())


  
