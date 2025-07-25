"""
URL configuration for tweeter project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import include, path, re_path
from django.contrib import admin
from django.views.generic.base import TemplateView
from api import views
#NEW
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    
    re_path(r'^image$',views.imageApi),
    re_path(r'^message$',views.messageApi),
    #re_path(r'^notification/(.*)$',views.likeApi),
    re_path(r'^notification$',views.notificationApi),
    #re_path(r'^notification/(.*)$',views.likeApi),
    re_path(r'^retweet$',views.retweetApi),
    #re_path(r'^retweet/(.*)$',views.likeApi),
    re_path(r'^like$',views.likeApi),
    #re_path(r'^like/(.*)$',views.likeApi),
    re_path(r'^follow$',views.followApi),
    #re_path(r'^follow/(.*)$',views.followApi),
    re_path(r'^user$',views.userApi),
    #re_path(r'^user/(.*)$',views.userApi),
    re_path(r'^tweet$',views.tweetApi),
    #re_path(r'^tweet/(.*)$',views.tweetApi),

    #NEW
    path('api/tweet/', views.TweetAPI.as_view(), name='notification-detail'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    #path('', include('content.urls')),
]

    #re_path(r'^admin/', admin.site.urls),
    #re_path(r'^getData/', get_data),
    #re_path(r'^.*', TemplateView.as_view(template_name="home.html"), name="home")
    #path('', include('content.urls')),
    #path('getData/', get_data),
    #path('.*', TemplateView.as_view(template_name="home.html"), name="home")
    #path('', TemplateView.as_view(template_name="home.html"), name="home"),
    #path('studentg/',views.getData),
    #path('studentp/',views.addItem),