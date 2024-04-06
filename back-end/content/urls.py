from django.urls import path
from . import views

urlpatterns = [
    path('content/', views.content, name='content'),
    path('search/', views.search, name='search'),
    path('notifications/', views.notifications, name='notifications'),
    path('messages/', views.messages, name='messages'),
    path('home/', views.home, name='home'),
]