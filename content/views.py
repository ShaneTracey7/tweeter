from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from . import data

def content(request):
    template = loader.get_template('homePage.html')
    context = {
    'feed': data.createFeed(),
    'topics': data.createSearchTopics(),
    'profiles': data.createProfiles(),
  }
    return HttpResponse(template.render(context,request))

def search(request):
    template = loader.get_template('searchPage.html')
    context = {
    'topics': data.createSearchTopics(),
    'profiles': data.createProfiles(),
  }
    return HttpResponse(template.render(context,request))

def notifications(request):
    template = loader.get_template('notificationPage.html')
    context = {
        'notifications': data.createNotifications(),
        'topics': data.createSearchTopics(),
        'profiles': data.createProfiles(),
    }
    return HttpResponse(template.render(context,request))

def messages(request):
    template = loader.get_template('messagePage.html')
    context = {
        'messages': data.createMessages(),
    }
    return HttpResponse(template.render(context,request))


