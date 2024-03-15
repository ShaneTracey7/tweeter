from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from . import data

def content(request):
    template = loader.get_template('homePage.html')
    context = {
    'feed': data.createFeed(),
  }
    return HttpResponse(template.render(context,request))

def search(request):
    template = loader.get_template('searchPage.html')
    return HttpResponse(template.render())

def notifications(request):
    template = loader.get_template('notificationPage.html')
    return HttpResponse(template.render())

def messages(request):
    template = loader.get_template('messagePage.html')
    return HttpResponse(template.render())

"""
  def testing(request):
  mydata = Member.objects.filter(firstname__startswith='b').order_by('-firstname').values()
  template = loader.get_template('template.html')
  context = {
    'mymembers': mydata,
  }
  return HttpResponse(template.render(context, request))
"""


